const state = {
  data: [],
  clearCount: 0,
}

const mutations = {
  CHECK(state, item) {
    const id = item.id
    if (state.data.filter(i => i.id === id).length <= 0) {
      state.data.push(item)
    } else {
      state.data = state.data.filter(i => i.id !== item.id)
    }
  },
  CHECKED(state, item) {
    state.data.push(item)
  },
  UNCHECKED(state, item) {
    state.data = state.data.filter(i => i.id !== item.id)
  },
  CLEAR(state) {
    state.clearCount++
    state.data = []
  },
  SET_CLEAR(state) {
    state.clearCount = 0
  },
}

const actions = {
  clear({ commit }) {
    commit('CLEAR')
  },
}

export default {
  namespaced: true,
  state,
  mutations,
  actions,
}
