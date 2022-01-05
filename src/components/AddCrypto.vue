<template>
  <div class="mb-1">    
    <span class="text-danger block" v-if="error">{{ error }}</span>
    <input type="text" class="form-control" @keyup.enter="addCrypto($event.target)" />  
    <div class="spinner-border spinner-border-sm ms-2" role="status" v-if="loading" />  
  </div>
</template>
<script>


export default {
  name: 'AddCrypto',
  data(){
    return {
      error: null,
      cryptoImageUrl: null,
      loading:false
    }
  },
  methods:{
    addCrypto(evt){
      this.loading = true

      this.$getCryptoData(evt.value)
      .then((e) => {
        this.error = null

        this.cryptoImageUrl = e.imageLowUrl
        var crypto = {
          code: evt.value,
          name: e.name,
          imageLowUrl: e.imageLowUrl
        }
        this.emit(crypto)

        evt.value = ''

        this.$setApiDailyUsage()
      })
      .catch((e) => {
        this.error = e
      }) 
      .finally(() =>{
        this.loading = false
      })     
    },
    emit(val){
      this.$emit('has-added-crypto', val)
    }
  }
}
</script>
<style scoped>
.block{
  display: block;
}
</style>