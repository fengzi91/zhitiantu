const state = {
  filters: [],
  data: {},
  filter: [],
}
const mutations = {
  SET_DATA(state, data) {
    state.filters = data.tag
  },
  SET_FILTER(state, filter) {
    state.filter = filter.key ? [filter.key] : []
  },
}

const actions = {}

export default {
  namespaced: true,
  state,
  mutations,
  actions,
}
