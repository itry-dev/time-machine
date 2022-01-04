import "bootstrap/dist/css/bootstrap.min.css"
import "bootstrap"
import utils from './plugins/utils'
import apiDataProvider from './plugins/apiDataProvider'

import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import { store } from './store/index'

import c from "./constants"

const axios = require('axios').default;
axios.defaults.headers.common = {
  'x-api-key': c.SERVER.X_API_KEY
}

createApp(App)
.use(router)
.use(utils)
.use(apiDataProvider)
.use(store)
.mount("#app");
