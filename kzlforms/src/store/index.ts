import Vue from 'vue'
import Vuex from 'vuex'
import Client from '@/store/modules/client.ts'

Vue.use(Vuex)

export default new Vuex.Store({
  modules: {
    Client
  }
})
