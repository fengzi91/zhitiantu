const state = {
  show: {},
  currentViewIndex: {
    section: 0,
    index: -1,
  },
  data: [],
  scrollTop: 0,
  left: 0,
}

const mutations = {
  SET_SHOW(state, picture) {
    state.show = picture
    state.currentViewIndex = {
      section: picture.section,
      index: picture.index,
    }
  },
  SET_DATA(state, data) {
    state.data = data
  },
  SET_POSITION(state, { scrollTop }) {
    state.scrollTop = scrollTop
    state.left = 0
  },
}

const actions = {}

export default {
  namespaced: true,
  state,
  mutations,
  actions,
}
