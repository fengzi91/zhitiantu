const state = {
  show: {},
  currentViewIndex: {
    section: 0,
    index: -1,
  },
  data: [],
  initSection: -1,
  initIndex: -1,
  scrollTop: 0,
  initScrollTop: 0,
}

const mutations = {
  SET_SHOW(state, picture) {
    state.show = picture
    state.currentViewIndex = {
      section: picture.section,
      index: picture.index,
    }
    if (state.initSection < 0 && state.initIndex < 0) {
      state.initSection = picture.section
      state.initIndex = picture.index
    }
  },
  SET_DATA(state, data) {
    state.data = data
  },
  SET_INIT_SCROLL_TOP(state, scrollTop) {
    state.initScrollTop = scrollTop
  },
  SET_SCROLL_TOP(state, scrollTop) {
    state.scrollTop = scrollTop
  },
}

const actions = {}

export default {
  namespaced: true,
  state,
  mutations,
  actions,
}
