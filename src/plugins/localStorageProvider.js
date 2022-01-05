// plugins/localStoreProvider.js

import c from '@/constants'

function saveItem(store){
  store.subscribe( (mutation, state) => {
    console.log(mutation)

    if (mutation.type === c.VUEX.MUTATIONS.UPDATE_CURRENCY){
      try{
        window.localStorage.removeItem(c.LOCALSTORE.CURRENCY)
        window.localStorage.setItem(c.LOCALSTORE.CURRENCY, mutation.payload)
      }catch(e){
        handleError(e)
      }
    }

    if (mutation.type === c.VUEX.MUTATIONS.UPDATE_NUMBER_OF_PERIODS){
      try{
        window.localStorage.removeItem(c.LOCALSTORE.NUMBER_OF_PERIODS)
        window.localStorage.setItem(c.LOCALSTORE.NUMBER_OF_PERIODS, mutation.payload)
      }catch(e){
        handleError(e)
      }
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
  console.log(err)
}

export { saveItem, getItem }
