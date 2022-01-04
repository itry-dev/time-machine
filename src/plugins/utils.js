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

    app.provide('utils', options)
  }
}