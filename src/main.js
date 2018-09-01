import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

import 'holakit/dist/holakit.css'

import MessageCenter from './messageCenter'

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')

MessageCenter.init([
  {
    name: 'Frightened @ Bullet Message',
    symbol: '🚅',
    params: {
      account: '***REMOVED***',
      token: '***REMOVED***-r',
      group: '***REMOVED***'
    },
    type: 'NeteaseIM'
  }
])
