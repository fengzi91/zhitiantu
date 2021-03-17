import { uploadFile } from '@/api/upload'
import { computedSize } from '@/utils'
import Vue from 'vue'
const state = {
  show: false,
  showSelect: 0,
  files: [],
  totalSize: 0,
  uploadSuccessAfter: null,
}

const mutations = {
  SHOW(state, payload) {
    typeof payload === 'undefined'
      ? (state.show = true)
      : (state.show = !!payload)
  },
  SET_SHOW_SELECT(state, count) {
    state.showSelect = typeof count === 'undefined' ? 1 : count
  },
  ADD(state, file) {
    const fileInfo = {
      _file: file.file,
      url: file.url,
      key: file.key,
      name: file.file.name,
      deleted: false,
      loading: false,
    }
    fileInfo.sizeText = computedSize(file.file.size)
    state.files.push(fileInfo)
  },
  UPDATE_FILE_STATE(state, { fileKey, key, value }) {
    if (typeof key === 'string') {
      Vue.set(state.files[fileKey], key, value)
    } else if (typeof key === 'object') {
      Object.keys(key).forEach(k => {
        Vue.set(state.files[fileKey], k, key[k])
      })
    }
  },
  SET_UPLOAD_SUCCESS_AFTER(state, payload) {
    state.uploadSuccessAfter = payload
  },
}

const actions = {
  initUpload({ commit }) {
    commit('SET_SHOW_SELECT')
  },
  /**
   *
   */
  add({ commit, dispatch, state }, data) {
    const key = state.files.length
    data.key = key
    commit('ADD', data)
    dispatch('upload', key)
  },
  upload({ state, commit, dispatch }, fileKey) {
    if (state.files[fileKey].deleted) return
    const file = state.files[fileKey]._file
    const formData = new FormData()
    formData.append('file', file)
    commit('UPDATE_FILE_STATE', { fileKey, key: 'upload', value: 'start' })
    uploadFile(formData)
      .then(res => {
        commit('UPDATE_FILE_STATE', {
          fileKey,
          key: 'upload',
          value: 'complete',
        })
        commit('UPDATE_FILE_STATE', { fileKey, key: res.data })
        if (state.uploadSuccessAfter) {
          typeof state.uploadSuccessAfter === 'string'
            ? dispatch(state.uploadSuccessAfter, res.data, { root: true })
            : typeof state.uploadSuccessAfter === 'function'
            ? state.uploadSuccessAfter()
            : null
        }
      })
      .catch(() => {
        commit('UPDATE_FILE_STATE', { fileKey, key: 'upload', value: 'error' })
      })
  },
}

export default {
  namespaced: true,
  state,
  mutations,
  actions,
}
