import Vuex from 'vuex'
import Vue from 'vue'
import api from '@/api'
Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    token: null,
    userInfo: {},
    teachers: [],
    classes: [],
    students: []
  },
  actions: {
    getUserInfo: async ({ commit }) => {
      const res = await api.getUserInfo()
      if (res.code == 200) {
        commit('GETUSERINFO', res.data)
      }
    },
    getTeachers: async ({ commit }, data = {}) => {
      const res = await api.getTeachers(data)
      if (res.code == 200) {
        commit('GETTEACHERS', res.data)
      }
    },
    async getClasses({ commit }, data = {}) {
      const res = await api.getClasses(data).catch(err => { })
      if (res.code == 200) {
        commit("GETCLASSES", res.data)
      }
    },
    async getStudents({ commit }, data = {}) {
      const res = await api.getStudents(data).catch(() => { })
      if (res.code == 200) {
        commit("GETSTUDENTS", res.data)
      }
    }
  },
  mutations: {
    CHANGETOKEN: (state, val) => {
      state.token = val
    },
    GETUSERINFO: (state, val) => {
      state.userInfo = val
    },
    GETTEACHERS(state, val) {
      state.teachers = val
    },
    GETCLASSES(state, val) {
      state.classes = val
    },
    GETSTUDENTS(state, val) {
      state.students = val
    }
  },
  getters: {}
})