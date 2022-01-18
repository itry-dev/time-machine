<template>
  <div class="alert alert-info" role="alert">
  Now {{ $getFormattedCurrency(parseFloat(cryptoData.rate), cryptoData.currency) }}
  {{ $getFormattedCurrency(parseFloat(cryptoData.cap), cryptoData.currency) }}
  {{ cryptoData.date }}
  </div>
</template>
<script>
export default {
  name:'Today',
  props:{
    cryptoData:{
      type: Object,
      required: true
    }
  }
}
</script>