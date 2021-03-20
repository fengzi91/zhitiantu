import ls from '@/utils/ls'
import _ from 'lodash'
import {
  login as loginRequest,
  logout,
  register as registerRequest,
} from '@/api/auth'
import router from '@/router'
import { me } from '@/api/user'
const state = {
  loggedIn: ls.get('loggedIn', false),
  redirectTo: '/',
  backTo: '/', // 返回按钮跳转的页面, 始终为打开登录页时的来路页面
  userInfo: ls.get('userInfo', null),
  loginLoading: false,
  registerLoading: false,
  token: ls.get('token', null),
}

const mutations = {
  SET_LOGGED(state, logged) {
    const isLogged = typeof logged === 'undefined' ? true : logged
    ls.set('loggedIn', isLogged)
    state.loggedIn = isLogged
  },
  SET_REDIRECT_TO(state, fullPath) {
    state.redirectTo = fullPath
  },
  SET_BACK_TO(state, fullPath) {
    state.backTo = fullPath
  },
  SET_USER_INFO(state, userInfo) {
    ls.set('userInfo', userInfo)
    state.userInfo = userInfo
  },
  SET_TOKEN(state, token) {
    ls.set('token', token)
    state.token = token
  },
  TOGGLE_LOADING(state) {
    state.loginLoading = !state.loginLoading
  },
}

const actions = {
  async logout({ commit, state }) {
    try {
      await logout()
      commit('SET_LOGGED', false)
      commit('SET_USER_INFO', null)
      commit('SET_TOKEN', null)
      if (router.currentRoute.meta.auth) {
        router.push(state.backTo)
      }
    } catch (e) {
      console.log(e)
    }
  },
  async login({ commit, dispatch }, loginData) {
    commit('TOGGLE_LOADING')
    try {
      const { token, data } = await loginRequest(loginData)
      if (data.id) {
        commit('SET_LOGGED')
        commit('SET_USER_INFO', data)
        commit('SET_TOKEN', token)
        return true
      }
    } catch (e) {
      let content = '登录失败，服务器错误！'
      if (!_.get(e, 'response.data.message', false)) {
        dispatch(
          'message/pushMessage',
          {
            type: 'error',
            info: content,
            content,
            timeout: 3000,
          },
          { root: true }
        )
      }
    } finally {
      commit('TOGGLE_LOADING')
    }
  },
  async register({ commit, dispatch }, registerData) {
    commit('TOGGLE_LOADING')
    try {
      const { token, data } = await registerRequest(registerData)
      if (data.id) {
        commit('SET_LOGGED')
        commit('SET_USER_INFO', data)
        commit('SET_TOKEN', token)
        return true
      }
    } catch (e) {
      let content = '注册失败，服务器错误！'
      if (_.get(e, 'response.data.message', false)) {
        content = e.response.data.message
      }
      dispatch(
        'message/pushMessage',
        {
          type: 'error',
          info: content,
          content,
          timeout: 3000,
        },
        { root: true }
      )
    } finally {
      commit('TOGGLE_LOADING')
    }
  },
  async checkLogin({ commit }) {
    try {
      const { data } = await me()
      if (data.id) {
        commit('SET_LOGGED')
        commit('SET_USER_INFO', data)
        return true
      }
    } catch (e) {
      commit('SET_LOGGED', false)
      commit('SET_USER_INFO', null)
      commit('SET_TOKEN', null)
    }
  },
}

export default {
  namespaced: true,
  state,
  mutations,
  actions,
}
