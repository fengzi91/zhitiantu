import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '@/views/Home'
import store from '@/store'

Vue.use(VueRouter)

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
    path: '/auth/login',
    name: 'Login',
    component: () =>
      import(/* webpackChunkName: "login" */ '@/views/auth/login'),
    meta: {
      hideAppBar: true,
      center: true,
      guest: true,
      navigation: false,
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
  {
    path: '/collect/:id',
    name: 'ViewCollect',
    component: () =>
      import(/* webpackChunkName: "collect" */ '@/views/collect/show'),
    meta: {
      auth: true,
      appBarDefault: true,
    },
  },
  {
    path: '/preview/:id',
    name: 'preview',
    component: () =>
      import(/* webpackChunkName: "picture" */ '@/views/picture/show'),
  },
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
    // if (
    //   to.name === 'Home' &&
    //   from.name === 'preview' &&
    //   store.state.picture.scrollTop > 0
    // ) {
    //   return { x: 0, y: store.state.picture.scrollTop, behavior: 'smooth' }
    // }
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
  if (false === to.meta.navigation) {
    store.commit('global/SET_NAVIGATION_DRAWER', false)
  } else {
    store.commit('global/SET_NAVIGATION_DRAWER', true)
  }
  if (to.meta.hideAppBar) {
    store.commit('global/HIDE_APP_BAR')
  } else {
    store.commit('global/SHOW_APP_BAR', true)
  }
  if (to.meta.center) {
    store.commit('global/FILL_HEIGHT')
  } else {
    store.commit('global/AUTO_HEIGHT')
  }
  if (to.meta.appBarDefault) {
    store.commit('global/SET_APP_BAR_TYPE', 'default')
  } else {
    store.commit('global/SET_APP_BAR_TYPE', undefined)
  }
  if (to.fullPath.indexOf('/auth') < 0 && !isLoggedIn && to.meta.auth) {
    store.commit('auth/SET_REDIRECT_TO', to.fullPath)
    store.commit('auth/SET_BACK_TO', from.fullPath)
    next({
      name: 'Login',
    })
  }
  next()
})

export default router
