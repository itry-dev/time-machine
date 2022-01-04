<template>
  <div>
    <a class="text-muted" href="https://www.livecoinwatch.com/" target="_blank">
      <small class="fw-light">using Live Coin Watch API</small>
    </a>    
    | <small class="ms-2">daily credits remaining {{ getApiUsage() }}</small>
    <small class="ms-2 text-danger" v-if="getApiUsageErrors() !== ''">{{ getApiUsageErrors() }}</small>
  </div>
</template>
<script>
import c from '@/constants'
import { mapGetters } from 'vuex'

export default {
  name: 'Footer',
  computed:{
    ...mapGetters({
      credits: [c.VUEX.GETTERS.API_DAILY_USAGE],
      errors: [c.VUEX.GETTERS.API_USAGE_ERRORS]
    })
  },
  methods:{
    getApiUsage(){
      return this.credits
    },
    getApiUsageErrors(){
      return this.errors
    }
  }
  
  
}
</script>