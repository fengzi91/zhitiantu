const state = {
  show: false,
}

const mutations = {
  HIDE(state) {
    state.show = false
  },
  SHOW(state) {
    state.show = true
  },
  TOGGLE(state) {
    state.show = !state.show
  },
}

const actions = {}

export default {
  namespaced: true,
  state,
  mutations,
  actions,
}
