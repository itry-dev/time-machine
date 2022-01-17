<template>
  <div class="container">
    <div class="row text-start">
      <!-- currency -->
      <div class="mb-3">
        <label class="sm-2 form-label">Currency</label>
        <select class="form-select" v-model="m_currency" @change="saveCurrency($event.target)">
          <option selected>Select currency</option>
          <option value="EUR">EUR</option>
          <option value="USD">USD</option>
          <option value="GBP">GBP</option>
        </select>          
      </div>
      <!-- periods -->
      <div class="mb-3">
        <label class="sm-2 form-label">
          Periods
        </label>
        <select class="form-select" v-model="m_nr_periods" @change="saveNumberOfPeriods($event.target)">
          <option :value="small">Now, 6 months ago, Last year</option>
          <option :value="large">Now, 3 months ago, 6 months ago, 9 months ago, Last year</option>
          <option :value="threeDays">Three Days</option>
          <option :value="year">One year</option>
        </select>
      </div>
      <!-- cryptos -->

      <div class="mb-3">
        <label class="sm-2 form-label">
          Add new crypto
        </label>
        <AddCrypto @has-added-crypto="hasAddedCrypto" />        
      </div>  
      <div class="mb-3">
        <label class="sm-2 form-label">
          Added cryptos
        </label>
        <ul class="nav">
          <li class="nav-item me-3" v-for="(crypto, index) in cryptos" :key="index">
            {{ crypto.name }} <img :src="crypto.imageLowUrl" />
            <a role="button" @click="removeCrypto(crypto)">
              <i class="bi bi-x" style="font-size: 2rem;"></i>
            </a>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
import 'bootstrap-icons/font/bootstrap-icons.css';
import c from "@/constants"
import { mapGetters } from 'vuex'
import AddCrypto from '@/components/AddCrypto.vue'

export default {
  name: "Home",
  components: {
    AddCrypto
  },
  computed:{
    ...mapGetters({
      currency: [c.VUEX.GETTERS.CURRENCY],
      number_of_periods: [c.VUEX.GETTERS.NUMBER_OF_PERIODS],
      cryptos: [c.VUEX.GETTERS.CRYPTOS]
    })
  },
  data(){
    return {
      m_currency: '',
      m_nr_periods: 0,
      small: c.SMALL_NUMBER_OF_PERIODS,
      large: c.LARGE_NUMBER_OF_PERIODS,
      year: c.YEAR_PERIODS,
      threeDays: c.THREE_DAYS_PERIOD,
      rows:['']
    }
  },
  methods:{
    hasAddedCrypto(crypto){
      this.$store.commit(c.VUEX.MUTATIONS.ADD_CRYPTO, crypto)
    },
    removeCrypto(crypto){
      this.$store.commit(c.VUEX.MUTATIONS.REMOVE_CRYPTO, crypto)
    },
    saveCurrency(sel){
      this.m_currency = sel.value
      this.$store.commit(c.VUEX.MUTATIONS.UPDATE_CURRENCY, sel.value)
    },
    saveNumberOfPeriods(sel){
      this.m_nr_periods = parseInt(sel.value)
      this.$store.commit(c.VUEX.MUTATIONS.UPDATE_NUMBER_OF_PERIODS, this.m_nr_periods)
    }
  },
  mounted(){
    this.m_currency = this.currency    
    this.m_nr_periods = this.number_of_periods
  }
};
</script>
