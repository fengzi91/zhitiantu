const state = {
  keyword: undefined,
}

const mutations = {
  SET_KEYWORD(state, keyword) {
    state.keyword = keyword
  },
}

const actions = {}

export default {
  namespaced: true,
  state,
  mutations,
  actions,
}
