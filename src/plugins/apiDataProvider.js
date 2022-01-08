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

    app.config.globalProperties.$getOneYearData = async function(coinCode, currency){
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
        var sd = new Date(today.getFullYear()-1, i, today.getDate(), today.getHours(), todayMn - 10)        
        var ed = new Date(today.getFullYear()-1, i, today.getDate(), today.getHours(), todayMn)
        dates.push( { start: sd.getTime(), end: ed.getTime() })
      }

      var d0 = new Date()
      d0.setMinutes(-10)
      var d1 = new Date()      
      dates.push( {start: d0.getTime(), end: d1.getTime()} )

      var dataSource = []
      //var clazz = this
      for (i = 0; i < dates.length; i++){
        var el = dates[i]
        data.start = el.start
        data.end = el.end
        
        //clazz.$log('calling data from ' + new Date(el.start).toLocaleTimeString() + ' to ' + new Date(el.end).toLocaleTimeString(), 'apiDataProvider')
        await axios.post(url, data)
        .then(function (response) {
          dataSource.push(response.data)
        })
        .catch(function (error) {
          catchError(error)
        });
      }

      var cryptoData = getCryptoData()
      cryptoData.currency = currency
      if (dataSource.length > 0){
        setBaseCryptoData(cryptoData, dataSource[0])

        dataSource.forEach(function(el) {
          //I asked 10 minutes range, take the top of the list
          if (el.history && el.history.length > 0){
            cryptoData.history.push(el.history.pop())
          }
        })
      }
      
      return cryptoData
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

      var cryptoData = getCryptoData()

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