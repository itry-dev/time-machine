// plugins/utils.js
export default {
  install: (app, options) => {
    
    app.config.globalProperties.$isUndef = val => {
      return typeof(val) === 'undefined'
    }

    app.config.globalProperties.$isNorU = val => {
      return val === null || typeof(val) === 'undefined'
    }

    app.config.globalProperties.$log = function(val, isError) {
      if (process.env.NODE_ENV === 'development'){
        if (typeof(val) !== 'string') val = JSON.stringify(val)

        if (typeof(isError) === 'undefined' || !isError){
          console.log(val)
        }else{
          console.error(val)
        }        
      }
    }

    app.config.globalProperties.$getFormattedCurrency = function(value, currency){
      var format = 'en-US'
      if (currency.toLowerCase() === 'eur') format = 'it-IT'

      var formatter = new Intl.NumberFormat(format, {
        style: 'currency',
        currency: currency
      })

      return formatter.format(value)
    } 

    app.config.globalProperties.$getFormattedDate = function(val, format){
      var d = new Date(val)
      if (format){
        if (format === 'short') return d.toLocaleDateString()
        return d.toLocaleString()        
      }

      return d.toLocaleString()
    }
    

    app.provide('utils', options)
  }
}