import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    nav: [],
    user: JSON.parse(sessionStorage.getItem('user')) || '',
    isCollapse: JSON.parse(sessionStorage.getItem('isCollapse')) || false, // 侧边栏折叠
  },
  mutations: {
    setnav(state, data) {
      //设置导航菜单
      state.nav = data
    },
    user(state, data) {
      state.user = data
      sessionStorage.setItem('user', JSON.stringify(state.user))
    },
    IS_COLLAPSE(state, data) {
      state.isCollapse = data
      sessionStorage.setItem('isCollapse', state.isCollapse)
    },
  },
  actions: {
    //管理mutations
    SETNAV({ commit }, data) {
      //添加导航数据
      commit('setnav', data)
    },
  },
  modules: {},
})
