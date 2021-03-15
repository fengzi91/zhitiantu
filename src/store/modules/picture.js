import Vue from 'vue'
import { getPreviewImageStyle } from '@/utils/preview'
import router from '@/router'
import vuetify from '@/plugins/vuetify'
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

const actions = {
  preview({ commit }, { picture, data, scrollTop, rect }) {
    console.log(vuetify)
    let { width, height } = getPreviewImageStyle(
      picture,
      vuetify.framework.breakpoint.width,
      vuetify.framework.breakpoint.height
    )
    commit('SET_DATA', data)
    commit('SET_INIT_SCROLL_TOP', scrollTop)
    commit('SET_SCROLL_TOP', 0)
    commit(
      'SET_SHOW',
      Object.assign(
        {
          show_width: width,
          show_height: height,
          rect: rect,
          section: picture.section,
          index: picture.index,
        },
        picture
      )
    )
    commit('SET_INIT_DATA', {
      section: picture.section,
      index: picture.index,
    })
    router.push({
      name: 'preview',
      params: { id: 'dsaczxcuirewurhsfkjdshfsdjk' },
    })
  },
}

export default {
  namespaced: true,
  state,
  mutations,
  actions,
}
