import ls from '@/utils/ls'
const state = {
  passwordChecked: ls.get('checkedCollect', []),
}

const mutations = {
  ADD_PASSWORD_CHECKED(state, id) {
    const checked = state.passwordChecked
    if (checked.indexOf(id) < 0) {
      state.passwordChecked.push(id)
      ls.set('checkedCollect', state.passwordChecked)
    }
  },
}

const actions = {
  savePassword({ commit }, { id, checked }) {
    if (checked) {
      commit('ADD_PASSWORD_CHECKED', id)
    } else {
      commit('REMOVE_PASSWORD_CHECKED', id)
    }
  },
}

export default {
  namespaced: true,
  state,
  mutations,
  actions,
}
