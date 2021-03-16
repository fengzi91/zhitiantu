import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '@/views/Home'
import Index from '@/views/Index'
import store from '@/store'

Vue.use(VueRouter)
import AuthRoute from './modules/auth'
import PreviewRoute from './modules/picture'
import CollectRoute from './modules/collect'
import UserRoute from './modules/user'
const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home,
    meta: {
      keepAlive: true,
    },
  },
  {
    path: '/pictures',
    name: 'Index',
    component: Index,
    meta: {
      keepAlive: true,
    },
  },
  {
    path: '/about',
    name: 'About',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () =>
      import(/* webpackChunkName: "about" */ '../views/About.vue'),
    meta: {
      auth: true,
    },
  },
  {
    path: '/upload',
    name: 'Upload',
    component: () => import(/* webpackChunkName: "upload" */ '@/views/Upload'),
    meta: {
      auth: true,
    },
  },
  AuthRoute,
  PreviewRoute,
  CollectRoute,
  UserRoute,
  {
    path: '*',
    name: 'NotFound',
    component: () => import('@/views/404.vue'),
    meta: {
      center: true,
      navigation: false,
    },
  },
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes,
  scrollBehavior(to, from, savedPosition) {
    if (
      (to.name === 'Home' || to.name === 'ViewCollect') &&
      from.name === 'preview' &&
      top !== 0
    ) {
      const scrollTop = savedPosition.y + store.state.picture.scrollTop
      console.log('操作滚动条？', scrollTop)
      return {
        x: 0,
        y: scrollTop,
      }
    }
    if (savedPosition) {
      return savedPosition
    } else {
      return { x: 0, y: 0 }
    }
  },
})

router.beforeEach((to, from, next) => {
  const isLoggedIn = store.state.auth.loggedIn
  if (to.fullPath.indexOf('/auth') > -1 && isLoggedIn) {
    return
  }
  // if (
  //   to.matched.some(
  //     record => record.meta.navigation !== undefined && !record.meta.navigation
  //   )
  // ) {
  //   store.commit('global/SET_NAVIGATION_DRAWER', false)
  // } else {
  //   store.commit('global/SET_NAVIGATION_DRAWER', true)
  // }
  if (to.matched.some(record => record.meta.hideAppBar)) {
    store.commit('global/HIDE_APP_BAR')
  } else {
    store.commit('global/SHOW_APP_BAR', true)
  }
  if (to.matched.some(record => record.meta.center)) {
    store.commit('global/FILL_HEIGHT')
  } else {
    store.commit('global/AUTO_HEIGHT')
  }
  if (to.meta.appBarDefault) {
    store.commit('global/SET_APP_BAR_TYPE', 'default')
  } else {
    store.commit('global/SET_APP_BAR_TYPE', undefined)
  }
  if (
    to.fullPath.indexOf('/auth') < 0 &&
    !isLoggedIn &&
    to.matched.some(record => record.meta.auth)
  ) {
    store.commit('auth/SET_REDIRECT_TO', to.fullPath)
    store.commit('auth/SET_BACK_TO', from.fullPath)
    next({
      name: 'Login',
    })
  }
  next()
})

export default router
