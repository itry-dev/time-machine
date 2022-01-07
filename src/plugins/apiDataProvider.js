// plugins/apiDataProvider.js

import c from '@/constants'

const axios = require('axios').default;

function getCryptoData(){
  return  { code: '', name: '', currency: '' , rate: 0, cap: 0, allTimeHighUSD:0,  history: [], date: null, imageLowUrl: '', imageUrl: '', errors: ''}      
}

function setBaseCryptoData(target, source){
  target.code = source.code
  target.name = source.name
  target.imageLowUrl = source.png32
  target.imageUrl = source.png64
  target.allTimeHighUSD = source.allTimeHighUSD

  return target
}

function catchError(error){
  if (error.response){
    if (error.response.data.error){
      throw error.response.data.error.description
    }

    throw error.respose
  }
  
  throw error
}

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

    app.config.globalProperties.$getOneYearData = function(coinCode, currency){
      var url = c.SERVER.CRYPTO_DATA_HISTORY

      let data = {
        'code': coinCode.toUpperCase(),
        'currency': this.$isNorU(currency) ? 'USD' : currency,
        'meta': true
      }

      var today = new Date()
      var dates = []
      var todayMn = today.getMinutes()
      for (var i=0; i<12; i++){
        var sd = new Date(today.getFullYear()-1, i, today.getDate(), today.getHours(), todayMn - 5)        
        var ed = new Date(today.getFullYear()-1, i, today.getDate(), today.getHours(), todayMn)
        dates.push( { start: sd.getTime(), end: ed.getTime() })
      }

      dates.push( {start: today.setMinutes(todayMn - 5), end: today.setMinutes(todayMn)} )

      var cryptoData = getCryptoData()
      cryptoData.currency = currency

      var clazz = this
      dates.forEach(function(el) {

        data.start = el.start
        data.end = el.end

        //clazz.$log(url,'apiDataProvide:getOneYearData')
        //clazz.$log(data,'apiDataProvide:getOneYearData')

        clazz.$log('start ' + new Date(data.start).toLocaleString())
        clazz.$log('end ' + new Date(data.end).toLocaleString())

        axios.post(url, data)
        .then(function (response) {
          //I asked 5 minutes range, take the top on the list
          console.log(response.data.history.length)
          cryptoData.history.push(response.data.history.pop())

          setBaseCryptoData(cryptoData, response.data)
        })
        .catch(function (error) {
          catchError(error)
        });
      })

      //console.log(cryptoData)

      return Promise.resolve(cryptoData)
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

      //this.$log(url,'apiDataProvide:getCryptoData')
      //this.$log(data,'apiDataProvide:getCryptoData')

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

        setBaseCryptoData(cryptoData, response.data)

        return cryptoData
      })
      .catch(function (error) {
        catchError(error)
      });

      return response
    }
    
    app.provide('apiDataProvider', options)
  }
}