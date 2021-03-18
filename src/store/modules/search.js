import Vue from 'vue'
const state = {
  keyword: undefined,
  keywords: {},
}

const mutations = {
  SET_KEYWORD(state, { key, value }) {
    Vue.set(state.keywords, key, value)
  },
}

const actions = {}

export default {
  namespaced: true,
  state,
  mutations,
  actions,
}
