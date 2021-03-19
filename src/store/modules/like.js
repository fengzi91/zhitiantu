import { like as likeCollect } from '@/api/collect'
import { like as likePicture } from '@/api/pictures'
import Vue from 'vue'
const state = {
  // 以对象(hash)方式保存
  collect: {},
  picture: {},
}

const mutations = {
  /**
   *
   * @param state
   * @param type
   * @param index
   * @param key
   * @param value
   * @example
   * const data = {type: 'collects', index: '1', key: 'loading', value: false}
   * commit('UPDATE', data)
   * .....
   * state.collects[1].loading === false
   *
   *
   * @constructor
   */
  UPDATE(state, { type, index, key, value }) {
    let data = state[type][index]
    if (!data) {
      data = {
        loading: false,
        count: 0,
        liked: false,
      }
    }
    data[key] = value
    Vue.set(state[type], index, data)
  },
  FILL_COLLECT(state, data) {
    data.forEach(collect => {
      Vue.set(state.collect, collect.link, {
        loading: false,
        liked: false,
        count: collect.likers_count,
      })
    })
  },
}

const actions = {
  async like({ dispatch }, { id, type }) {
    dispatch('setLoading', { id, type, loading: true })
    let callback
    if (type === 'collect') {
      callback = likeCollect
    } else if (type === 'picture') {
      callback = likePicture
    }
    try {
      const { liked, count } = await callback(id)
      dispatch('setLoading', { id, type, loading: false })
      dispatch('setIsLiked', { id, type, liked })
      dispatch('setCount', { id, type, count })
    } catch (e) {
      dispatch('setLoading', { id, type, loading: false })
    }
  },
  setCount({ commit }, { id, type, count }) {
    commit('UPDATE', {
      type,
      index: id,
      key: 'count',
      value: count,
    })
  },
  setLoading({ commit }, { id, type, loading }) {
    commit('UPDATE', {
      type,
      index: id,
      key: 'loading',
      value: loading,
    })
  },
  setIsLiked({ commit }, { id, type, liked }) {
    commit('UPDATE', {
      type,
      index: id,
      key: 'liked',
      value: liked,
    })
  },
}

export default {
  namespaced: true,
  state,
  mutations,
  actions,
}
