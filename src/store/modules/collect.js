import ls from '@/utils/ls'
import Vue from 'vue'
import { update } from '@/api/collect'
import { cloneDeep } from 'lodash'
const state = {
  passwordChecked: ls.get('checkedCollect', []),
  isEditing: false,
  updatingInfo: {},
  updatingPictures: [],
  loading: false,
  updated: false,
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
  SET_EDITING(state, isEditing) {
    state.isEditing = isEditing
  },
  TOGGLE_LOADING(state) {
    state.loading = !state.loading
  },
  SET_UPDATING_DATA(state, data) {
    state.updatingPictures = cloneDeep(data.collect.pictures)
    state.updatingInfo = cloneDeep(data.collect)
  },
  UPDATE_INFO(state, { key, value }) {
    Vue.set(state.updatingInfo, key, value)
  },
  INSERT_FILE(state, data) {
    state.updatingPictures.push(data)
  },
  // 过滤指定的 ID
  FILTER(state, data) {
    state.updatingPictures = state.updatingPictures.filter(i => {
      return data.findIndex(v => v.id === i.id) < 0
    })
  },
  // 删除缓存的编辑数据
  CLEAR(state) {
    state.isEditing = false
    state.updatingInfo = {}
    state.updatingPictures = []
  },
  UPDATED(state, payload) {
    state.updated = payload
  },
}

const actions = {
  savePassword({ commit }, { id, password }) {
    commit('ADD_PASSWORD_CHECKED', { id, password })
  },
  async update({ commit }, data) {
    commit('TOGGLE_LOADING')
    await update(data)
    commit('TOGGLE_LOADING')
    commit('SET_EDITING', false)
  },
  insert({ commit }, data) {
    commit('INSERT_FILE', data)
  },
  /**
   *
   * @param commit
   * @param data[...id]
   */
  deletePicture({ commit }, data) {
    commit('FILTER', data)
    commit('checked/CLEAR', null, { root: true })
  },
  // 移除指定数据
  remove({ dispatch, rootState }) {
    dispatch('deletePicture', rootState.checked.data)
  },
  removeReverse({ dispatch, state, rootState }) {
    const checked = rootState.checked.data
    const removes = state.updatingPictures.filter(i => {
      return checked.findIndex(v => v.id === i.id) < 0
    })
    dispatch('deletePicture', removes)
  },
}

export default {
  namespaced: true,
  state,
  mutations,
  actions,
}
