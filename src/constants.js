const BASE_URL = 'https://api.livecoinwatch.com'

export default Object.freeze({
  SERVER: {
    CRYPTO_DATA: BASE_URL + '/coins/single',
    CRYPTO_DATA_HISTORY: BASE_URL + '/coins/single/history',
    API_DAILY_USAGE: BASE_URL + '/credits',
    X_API_KEY: process.env.VUE_APP_CRYPTO_API_KEY
  },
  VUEX:{
    GETTERS:{
      API_DAILY_USAGE: 'getApiCredits',
      API_USAGE_ERRORS: 'getApiDailyUsageErrors',
      COIN_CODE: 'getCoinCode',
      CURRENCY: 'getCurrency',
      NUMBER_OF_PERIODS: 'getNumberOfPeriods',
      CRYPTOS: 'getCryptos'
    },
    MUTATIONS:{
      UPDATE_DAILY_USAGE: 'updateApiCredits',
      UPDATE_USAGE_ERRORS: 'onDailyUsageError',
      UPDATE_COIN_CODE: 'updateCoinCode',
      UPDATE_CURRENCY: 'updateCurrency',
      UPDATE_NUMBER_OF_PERIODS: 'updateNumberOfPeriods',
      ADD_CRYPTO: 'addCrypto',
      REMOVE_CRYPTO: 'removeCrypto'
    }
  },
  SMALL_NUMBER_OF_PERIODS: 3,
  LARGE_NUMBER_OF_PERIODS: 5

})