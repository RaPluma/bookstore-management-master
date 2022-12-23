import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    login_info: {
      login: false,
      type: '',
      avatar: require('@/assets/img/avatar.png')
    }
  },
  actions: {},
  modules: {}
})
