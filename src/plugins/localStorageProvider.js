// plugins/localStorageProvider.js

import c from '@/constants'

function saveItem(store){
  store.subscribe( (mutation, state) => {

    var valToStore = mutation.payload
    var action = ''
    
    if (mutation.type === c.VUEX.MUTATIONS.UPDATE_CURRENCY){
      action = c.LOCALSTORE.CURRENCY        
    }
    if (mutation.type === c.VUEX.MUTATIONS.UPDATE_NUMBER_OF_PERIODS){
      action = c.LOCALSTORE.NUMBER_OF_PERIODS      
    }
    if (mutation.type === c.VUEX.MUTATIONS.UPDATE_COIN_CODE){
      action = c.LOCALSTORE.COIN_CODE      
    }

    if (mutation.type === c.VUEX.MUTATIONS.ADD_CRYPTO || mutation.type === c.VUEX.MUTATIONS.REMOVE_CRYPTO){
      var items = window.localStorage.getItem(c.LOCALSTORE.CRYPTOS)
      var isOk = true
      if (items && items !== ''){
        try{
          items = JSON.parse(items)
        }catch(e){
          isOk = false
          window.localStorage.removeItem(c.LOCALSTORE.CRYPTOS)
          handleError(e)          
        }
      }

      if (isOk){
        if (Array.isArray(items)){
          const pos = items.findIndex((el) => el.code === mutation.payload.code)
          if (pos !== -1){
            //remove the element, eventually it will be added later
            items = items.filter(function(el){
              el.code !== mutation.payload.code
            })
          }

        }else{
          items = []
        }
  
        if (mutation.type === c.VUEX.MUTATIONS.ADD_CRYPTO){
          items.push({code: mutation.payload.code, name: mutation.payload.name, imageLowUrl: mutation.payload.imageLowUrl })          
        }

        try {
          window.localStorage.setItem(c.LOCALSTORE.CRYPTOS, JSON.stringify(items))
        }catch(e){
          handleError(e)
        }
      }
      

    }else{
      if (action !== ''){
        try{
          window.localStorage.removeItem(action)
          window.localStorage.setItem(action, valToStore)
        }catch(e){
          handleError(e)
        }
      }
    }
  })
}

function getItem(key, defaultVal){
  var val = window.localStorage.getItem(key)
  if (val === null){
    if (typeof(defaultVal) !== 'undefined') return defaultVal
    return null
  }

  if (key === c.LOCALSTORE.CRYPTOS){
    try{
      val = JSON.parse(val)
    }catch(e){
      handleError(e)
      val = null
    }
  }
  return val
}

function handleError(err){
  console.error(err)
}

export { saveItem, getItem }
