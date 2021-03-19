import { fetchTags } from '@/api/tag'
const state = {
  tags: [],
  currentId: 0,
}
const mutations = {
  SET_DATA(state, data) {
    state.tags = data
  },
  SET_CURRENT_ID(state, id) {
    state.currentId = id
  },
}

const actions = {
  async getTags({ state, commit }) {
    if (state.tags.length <= 0) {
      const { data } = await fetchTags()
      commit('SET_DATA', data)
    }
  },
}

export default {
  namespaced: true,
  state,
  mutations,
  actions,
}
