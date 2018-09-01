import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    logs: {}
  },
  mutations: {
    logSource (state, { source, log }) {
      state.logs = {
        ...state.logs,
        [source]: (state.logs[source] || '') + `${new Date().toLocaleTimeString()}: ${log}\n`
      }
    }
  },
  actions: {

  }
})
