<template>
  <div v-if="!hasCryptos">
    <Guide />
  </div>
  <div v-else :class="[isSmallPeriod() ? 'container' : 'container-fluid']">  
    <div class="row" v-if="showLoader()">
        <p class="text-center">
          <span class="text-muted h2">{{ loadingMessage }}</span>
        </p>
      </div>
    <div v-else>
      <div class="row pb-3">
        <div class="col">
          <a role="button" data-bs-toggle="offcanvas" data-bs-target="#offcanvasList" aria-controls="offcanvasList">
          Pick a crypto
          </a>
        </div>
        <Cryptos @has-clicked-crypto="hasClickedCrypto" />
      </div>
      <div class="row" v-if="errors.length > 0">
          <div class="col alert alert-warning" role="alert">
            <span class="text-block" v-for="(error, index) in errors" :key="index">{{ error }}</span>
          </div>
      </div>
      <div class="row">
        <div v-if="isYearPeriod()" class="col">
          <OneYear :cryptoData="oneYearDataSource" />
        </div>
        <div class="col" v-else v-for="(crypto, index) in cryptoData" :key="index">
          <CryptoDetails 
            :dataSource="crypto">
          <template v-slot:footer>
            <Percentage />
          </template>
          </CryptoDetails>
        </div>    
      </div>
      <Refresh @has-clicked-refresh="loadData()" v-if="showRefreshButton" />
    </div>
  </div>
</template>
<script>
import CryptoDetails from "@/components/CryptoDetails.vue"
import Cryptos from "@/components/Cryptos.vue"
import Percentage from '@/components/Percentage.vue'
import Guide from '@/components/Guide.vue'
import OneYear from '@/components/periods/OneYear.vue'
import Refresh from '@/components/ui/Refresh.vue'
import c from "@/constants"
import { mapGetters } from 'vuex'

export default {
  name: "CryptosView",
  components: {
    CryptoDetails,
    Cryptos,
    Percentage,
    Guide,
    OneYear,
    Refresh
  },
  computed:{
    ...mapGetters({
      currency: [c.VUEX.GETTERS.CURRENCY],
      code: [c.VUEX.GETTERS.COIN_CODE],
      number_of_periods: [c.VUEX.GETTERS.NUMBER_OF_PERIODS]
    }),
    filterCryptoData: function(){

      var elements = Object.values(this.cryptoData).filter(function(el){
        return el.loaded === true
      })

      elements.sort((a,b) => a.id - b.id)

      return elements
    },
    hasCryptos: function(){
      var cryptos = this.$store.getters[c.VUEX.GETTERS.CRYPTOS]      
      return cryptos && cryptos.length > 0
    }
  },
  data() {
    return {
      crypto: {
        id: 0,
        rate:0,
        cap:0,
        title:'',
        imageUrl:'',
        code: '',
        currency: '',
        loaded: false  
      },
      oneYearDataSource: {},
      errors: [],
      cryptoData:null,
      loadingMessage: '',
      showRefreshButton: false
    }
  },
  methods: {
    getOneYearData(){
      this.errors = []
      this.loadingMessage = 'loading one year data'
      
      this.$getOneYearData(this.code, this.currency)
      .then((e) => {
        this.oneYearDataSource = e
        this.setApiDailyUsage()
        this.loadingMessage = ''
        this.showRefreshButton = true     
      })
      .catch((e) => {
        this.errors.push(e)
      })
    },
    showLoader(){
      return this.loadingMessage !== ''
    },
    hasClickedCrypto(val){
      this.$store.commit(c.VUEX.MUTATIONS.UPDATE_COIN_CODE, val)
      this.loadData()      
    },
    getTime(withYear, withMonth, withDays, withHours, withMinutes){
      var d = new Date()
      if (!this.$isNorU(withYear)) d.setFullYear(d.getFullYear() + withYear)
      if (!this.$isNorU(withMonth)) d.setMonth(d.getMonth() + withMonth)
      if (!this.$isNorU(withDays)) d.setHours(d.getHours() + (withDays*24))
      if (!this.$isNorU(withHours)) d.setHours(d.getHours() + withHours)
      if (!this.$isNorU(withMinutes)) d.setMinutes(d.getMinutes() + withMinutes)
/*
      this.$log('y '+withYear)
      this.$log('m '+withMonth)
      this.$log('d '+withDays)
      this.$log('h '+withHours)
      this.$log('m '+withMinutes)

      this.$log(d.toString())
  */   
      return d.getTime()
    },
    getCryptoData(start, end){
      return this.$getCryptoData(this.code, this.currency, start, end)      
    },
    loadData(){
      if (this.code === ''){
        return
      }

      if (this.isYearPeriod()){
        this.getOneYearData()
        return
      }

      this.loadingMessage = 'loading'
      this.errors = []

      //init array data      
      var pos12M = '1'//0
      var pos9M = '2'//1
      var pos6M = '3'//2      
      var pos3M = '4'//3
      var posNow = '5'//4

      this.cryptoData = Object()

      //12 months ago
      start = this.getTime(null,-12,null,null,-5)
      end = this.getTime(null,-12,null,null,-1)      
      var p1 = Promise.resolve(
        this.getCryptoData(start, end)
        .then((e) => {
          this.cryptoData[pos12M] =  this.populateCryptoDataObj(pos12M,'12 months ago',false,e)
          this.setApiDailyUsage()
          this.loadingMessage += '12 m'
        })
        .catch((e) => this.errors.push(e))
      )

      //6 months ago
      start = this.getTime(null,-6,null,null,-5)
      end = this.getTime(null,-6,null,null,-1)
      var p2 = Promise.resolve(
        this.getCryptoData(start,end)
        .then((e) => {
          this.cryptoData[pos6M] = this.populateCryptoDataObj(pos6M,'6 months ago',false,e) 
          this.setApiDailyUsage()
          this.loadingMessage += ',6 m'
        })
        .catch((e) => this.errors.push(e))
      )

      //now      
      var start = this.getTime(null,null,null,null,-5)
      var end = this.getTime(null,null,null,null,-1)
      var p3 = Promise.resolve(
        this.getCryptoData(start,end)
        .then((e) => {
          this.cryptoData[posNow] = this.populateCryptoDataObj(posNow,'Now',true,e) 
          this.setApiDailyUsage()
          this.loadingMessage += ',now'
        })
        .catch((e) => this.errors.push(e))
      )

      var p4 = 0
      var p5 = 0

      if (this.number_of_periods === c.LARGE_NUMBER_OF_PERIODS){

          //9 months ago
          start = this.getTime(null,-9,null,null,-5)
          end = this.getTime(null,-9,null,null,-1)
          p4 = Promise.resolve(
            this.getCryptoData(start,end)
            .then((e) => {
              this.cryptoData[pos9M] = this.populateCryptoDataObj(pos9M,'9 months ago',false,e)
              this.setApiDailyUsage()
              this.loadingMessage += ',9 m'
            })
            .catch((e) => this.errors.push(e))
          )

          //3 months ago
          start = this.getTime(null,-3,null,null,-5)
          end = this.getTime(null,-3,null,null,-1)
          p5 = Promise.resolve(
            this.getCryptoData(start,end)
            .then((e) => {
              this.cryptoData[pos3M] = this.populateCryptoDataObj(pos3M,'3 months ago',false,e)
              this.setApiDailyUsage()
              this.loadingMessage += ',3 m'
            })
            .catch((e) => this.errors.push(e))
          )
      }

      return Promise.all([p1, p2, p3, p4, p5]).then(() => { 
        this.loadingMessage = '',
        this.showRefreshButton = true
      })
      
    },
    getDate(val){
      if (typeof(val) === 'undefined') return

      var d = new Date(val)
      return d.toDateString()
    },
    populateCryptoDataObj(objId, objTitle, emphatize, source){
      return {
        id: objId,
        title: objTitle,
        rate: this.$isNorU(source.rate) ? 0 : source.rate, 
        cap: this.$isNorU(source.cap) ? 0 : source.cap, 
        imageUrl: this.$isNorU(source.imageUrl) ? '' : source.imageUrl,
        code: this.code,
        currency: this.currency, 
        date: this.$isNorU(source.date) ? '' : this.getDate(source.date),
        emphatize: emphatize,
        loaded: !this.$isNorU(source.rate)
      }
    },
    isSmallPeriod(){
      return this.number_of_periods === c.SMALL_NUMBER_OF_PERIODS
    },
    isYearPeriod(){
      return this.number_of_periods === c.YEAR_PERIODS
    },
    setApiDailyUsage(){
      this.$setApiDailyUsage()
    }
  },
  mounted(){
    this.loadData()    
  }
}
</script>