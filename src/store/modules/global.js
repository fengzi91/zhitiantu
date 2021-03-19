const state = {
  showAppBar: true,
  appBarType: undefined,
  fillHeight: false,
  navigationDrawer: false,
  navigationDrawerMini: false,
}

const mutations = {
  SHOW_APP_BAR(state, isShow) {
    state.showAppBar = isShow
  },
  TOGGLE_APP_BAR(state) {
    state.showAppBar = !state.showAppBar
  },
  HIDE_APP_BAR(state) {
    state.showAppBar = false
  },
  SET_APP_BAR_TYPE(state, type) {
    state.appBarType = type
  },
  FILL_HEIGHT(state) {
    state.fillHeight = true
  },
  AUTO_HEIGHT(state) {
    state.fillHeight = false
  },
  TOGGLE_FILL_HEIGHT(state) {
    state.fillHeight = !state.fillHeight
  },
  SET_NAVIGATION_DRAWER(state, payload) {
    state.navigationDrawer = payload
  },
  TOGGLE_NAVIGATION_DRAWER_MINI(state) {
    state.navigationDrawerMini = !state.navigationDrawerMini
  },
}

const actions = {}

export default {
  namespaced: true,
  state,
  mutations,
  actions,
}
