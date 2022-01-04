// plugins/apiDataProvider.js

import c from '../constants'

const axios = require('axios').default;

export default {
  install: (app, options) => {

    app.config.globalProperties.$getApiDailyUsage = function() {
      return axios.post(c.SERVER.API_DAILY_USAGE)
    }

    app.config.globalProperties.$setApiDailyUsage = function() {
      axios.post(c.SERVER.API_DAILY_USAGE)
      .then((e) => {
        this.$store.commit(c.VUEX.MUTATIONS.UPDATE_DAILY_USAGE, e.data.dailyCreditsRemaining)
      })
      .catch((e) => {
        this.$store.commit(c.VUEX.MUTATIONS.UPDATE_USAGE_ERRORS, (e.response.data ? e.response.data : e.response))
      })
    }

    app.config.globalProperties.$getCryptoData = async function(coinCode, currency, start, end){
      var url = c.SERVER.CRYPTO_DATA

      let data = {
        'code': coinCode.toUpperCase(),
        'currency': this.$isNorU(currency) ? 'USD' : currency,
        'meta': true
      }

      if ( (!this.$isNorU(start) && start > 0) && (!this.$isNorU(end) && end > 0) ){

        data.start = start
        data.end = end

        url = c.SERVER.CRYPTO_DATA_HISTORY
      }

      var cryptoData = { name: '', rate: 0, cap: 0, date: new Date(), imageLowUrl: '', imageUrl: '', errors: ''}
      //const request = axios.post(url, data)
      
      const response = await axios.post(url, data)
      .then(function (response) {
        if (!response.data){
          return cryptoData
        }

        if (Array.isArray(response.data.history)){

          if (response.data.history.length === 0) return cryptoData

          var el = response.data.history.pop()
          cryptoData.rate = el.rate
          cryptoData.cap = el.cap
          cryptoData.date = new Date(el.date).toString()
        }else{
          cryptoData.rate = response.data.rate
          cryptoData.cap = response.data.cap
          cryptoData.date = new Date().toString()
        }

        cryptoData.name = response.data.name
        cryptoData.imageLowUrl = response.data.png32
        cryptoData.imageUrl = response.data.png64

        return cryptoData
      })
      .catch(function (error) {
        if (error.response){
          if (error.response.data.error){
            throw error.response.data.error.description
          }

          throw error.respose
        }
        
        throw error
      });

      return response
    }
    
    app.provide('apiDataProvider', options)
  }
}