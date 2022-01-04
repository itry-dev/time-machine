<template>
  <div class="card mb-4 rounded-3 shadow-sm">
    <div class="card-header no-bg">
      <span :class="[dataSource.emphatize ? 'badge emph' : 'badge no-emph']">{{ dataSource.title }}</span>
    </div>
    <div class="card-header no-bg">
      {{ dataSource.date }}
    </div>
    <div class="card-header  no-bg py-3" v-if="dataSource.imageUrl !== ''">
      <h4 class="my-0 fw-normal">
        <img :src="dataSource.imageUrl" />
      </h4>
    </div>
    <div class="card-body">
      <h1 class="card-title pricing-card-title">
        {{ getFormattedCur(parseFloat(dataSource.rate)) }}
      </h1>
      <small class="text-black-50">{{dataSource.rate}}</small>
      <ul class="list-unstyled mt-3 mb-4">
        <li>Market Cap<br /> {{ getFormattedCur(dataSource.cap) }}</li>
      </ul>
    </div>
    <div class="card card-footer">
      <slot name="footer"></slot>
    </div>
  </div>
</template>
<script>

export default {
  name: 'CryptoDetails',
  props: {
    dataSource:{
      type: Object,
      required: true,
      default: {
        objId: 0,
        title: '',
        rate: 0, 
        cap: 0, 
        imageUrl: '',
        code: '',
        currency: '', 
        date: '',
        emphatize: false,
        loaded: false
      }
    }
  },
  methods: {
    getFormattedCur(val){
      var format = 'en-US'
      if (this.dataSource.currency.toLowerCase() === 'eur') format = 'it-IT'

      var formatter = new Intl.NumberFormat(format, {
        style: 'currency',
        currency: this.dataSource.currency
      })

      return formatter.format(val)
    }
  }
}
</script>
<style scoped>
.no-bg{
  background-color: transparent;
  border-bottom: none;
}
.emph{
  background-color: #28a745;
  color: #fff;
}
.no-emph{
  background-color: #007bff;
  color: #fff;
}
</style>