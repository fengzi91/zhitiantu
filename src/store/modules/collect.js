import ls from '@/utils/ls'
import Vue from 'vue'
const state = {
  passwordChecked: ls.get('checkedCollect', []),
}

const mutations = {
  ADD_PASSWORD_CHECKED(state, { id, password }) {
    const checked = state.passwordChecked
    const index = checked.findIndex(i => i.id === id)
    if (index < 0) {
      state.passwordChecked.push({ id, password })
    } else {
      Vue.set(state.passwordChecked, index, { id, password })
    }
    ls.set('checkedCollect', state.passwordChecked)
  },
}

const actions = {
  savePassword({ commit }, { id, password }) {
    commit('ADD_PASSWORD_CHECKED', { id, password })
  },
}

export default {
  namespaced: true,
  state,
  mutations,
  actions,
}
