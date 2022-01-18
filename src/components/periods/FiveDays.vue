<template>
  <div class="container-fluid">  
    <div class="row">
      <div class="col" v-for="(crypto, index) in cryptoData" :key="index">
        <CryptoDetails 
          :dataSource="crypto">
        </CryptoDetails>
      </div>    
    </div>
  </div>
</template>
<script>
import CryptoDetails from "@/components/CryptoDetails.vue"

export default {
  name: "FiveDays",
  components: {
    CryptoDetails
  },
  props:{
    cryptoData:{
      type:Object,
      required:true
    }
  },
  data() {
    return {
    }
  }
}
</script>