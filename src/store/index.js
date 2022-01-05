import { createStore } from 'vuex'
import c from '@/constants'
import { saveItem, getItem } from '@/plugins/localStorageProvider'

const state = {
  api_credits: 0,
  API_USAGE_ERRORS: '',
  coin_code: '',
  currency: '',
  number_of_periods: 0,
  cryptos: []
}

const getters = {
  [c.VUEX.GETTERS.API_DAILY_USAGE](state){
    return state.api_credits
  },
  [c.VUEX.GETTERS.API_USAGE_ERRORS](state){
    return state.API_USAGE_ERRORS
  },
  [c.VUEX.GETTERS.COIN_CODE](state){
    return state.coin_code
  },
  [c.VUEX.GETTERS.CURRENCY](state){
    if (!state.currency || state.currency === ''){
      state.currency = getItem(c.LOCALSTORE.CURRENCY,'')
    }
    return state.currency
  },
  [c.VUEX.GETTERS.NUMBER_OF_PERIODS](state){
    if (!state.number_of_periods || state.number_of_periods === 0){
      state.number_of_periods = parseInt(getItem(c.LOCALSTORE.NUMBER_OF_PERIODS,0))
    }
    return state.number_of_periods
  },
  [c.VUEX.GETTERS.CRYPTOS](state){
    if (!state.cryptos || state.cryptos.length === 0){
      state.cryptos = getItem(c.LOCALSTORE.CRYPTOS,[])
    }
    return state.cryptos
  }
}

const mutations = {
  [c.VUEX.MUTATIONS.UPDATE_DAILY_USAGE](state, val){
    state.api_credits = val
  },
  [c.VUEX.MUTATIONS.UPDATE_USAGE_ERRORS](state, val){
    state.API_USAGE_ERRORS = val
  },
  [c.VUEX.MUTATIONS.UPDATE_COIN_CODE](state, val){
    state.coin_code = val
  },
  [c.VUEX.MUTATIONS.UPDATE_CURRENCY](state, val){
    state.currency = val
  },
  [c.VUEX.MUTATIONS.UPDATE_NUMBER_OF_PERIODS](state, val){
    state.number_of_periods = val
  },
  [c.VUEX.MUTATIONS.ADD_CRYPTO](state, payload){
    if (state.cryptos === null || !state.cryptos) return

    const pos = state.cryptos.findIndex(function(el){
      return el.code === payload.code
    })

    if (pos === -1) {
      state.cryptos.push(payload)
    }
  },
  [c.VUEX.MUTATIONS.REMOVE_CRYPTO](state, payload){
    if (state.cryptos === null || !state.cryptos) return

    state.cryptos = state.cryptos.filter(function(el){
      return el.code !== payload.code
    })
  }
}

export const store = createStore({
  state,
  getters,
  mutations,
  plugins: [saveItem]
})