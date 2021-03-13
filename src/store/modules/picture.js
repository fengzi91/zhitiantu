import Vue from 'vue'
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
  },
  SET_PICTURE_PROPERTY(state, { section, index, key, value }) {
    Vue.set(state.data[section].data[index], key, value)
    if (state.show.section === section && state.show.index === index) {
      Vue.set(state.show, key, value)
    }
  },
  SET_INIT_DATA(state, { section, index }) {
    state.initSection = section
    state.initIndex = index
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
