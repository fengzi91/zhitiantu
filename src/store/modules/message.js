import Vue from 'vue'
import _ from 'lodash'
const state = () => ({
  messages: [],
  index: 0,
})

const mutations = {
  ADD(state, payload) {
    payload.times = payload.timeout / 1000
    state.messages.push(payload)
  },
  /**
   * @return {boolean}
   */
  UPDATE(state, message) {
    const msg = _.find(state.messages, item => item.id === message.id)
    Vue.set(msg, 'times', message.timeout / 1000)
    Vue.set(msg, 'content', message.content)
  },
  REMOVE(state, id) {
    const newMessage = _.filter(state.messages, item => item.id !== id)
    const removed = _.remove(state.messages, item => item.id === id)
    state.messages = newMessage
    if (removed.length > 0) {
      // 有数据被移除， 同时移除定时器
      _.forEach(removed, item => {
        if (item.timer) clearInterval(item.timer)
      })
    }
  },
  SET_TIMER(state, { timer, id }) {
    const message = _.find(state.messages, item => item.id === id)
    if (message) message.timer = timer
  },
  SET_TIMES(state, { times, id }) {
    const message = _.find(state.messages, item => item.id === id)
    if (message) message.times = times
  },
  ADD_INDEX(state) {
    state.index = state.index + 1
  },
  SUB_TIMES(state, id) {
    const message = _.find(state.messages, item => item.id === id)
    // const index = _.findIndex(state.messages, (item) => item.id === id)
    if (message) {
      Vue.set(message, 'times', --message.times)
    }
  },
}

const actions = {
  async pushMessage({ state, commit, dispatch }, message) {
    // 先把 id 计算出来
    commit('ADD_INDEX')
    const id = state.index
    // 添加之前判断 最多只能有三个消息在显示
    if (state.messages.length > 3) {
      // 取得第一个 timeout > -1 的消息，移除
      const deleteMessage = _.find(state.messages, item => item.timeout > -1)
      if (deleteMessage) commit('REMOVE', deleteMessage.id)
    }
    message.id = id
    commit('ADD', message)
    await dispatch('setHide', {
      id,
      timeout: message.timeout,
    })
    return id
  },
  async updateMessage({ state, commit, dispatch }, message) {
    const id = _.get(message, 'id', 0)
    if (id === 0) {
      return await dispatch('pushMessage', message)
    } else {
      const index = _.findIndex(state.messages, item => item.id === id)
      let timer = _.get(state.messages, `[${index}].timer`, -1)

      if (timer > -1) {
        // clearInterval(timer);
        commit('UPDATE', message)
        return message.id
      } else {
        return await dispatch('pushMessage', message)
      }
    }
  },
  setHide({ state, commit }, options) {
    const id = options.id
    if (options.timeout >= 0) {
      let timer = setInterval(() => {
        const message = _.find(state.messages, item => item.id === id)
        if (message) {
          commit('SUB_TIMES', message.id)
          let time = message.times
          if (!(--time > 0)) {
            commit('REMOVE', id)
          }
        } else {
          clearInterval(timer)
        }
      }, 1000)
      commit('SET_TIMER', {
        id,
        timer,
      })
    }
  },
}

export default {
  namespaced: true,
  state,
  mutations,
  actions,
}
