export default {
  path: '/auth',
  name: 'Auth',
  component: () => import('@/components/Common/Empty'),
  redirect: { name: 'Login' },
  children: [
    {
      name: 'AuthRegister',
      path: 'register',
      component: () =>
        import(/* webpackChunkName: "auth" */ '@/views/auth/register'),
      meta: {
        hideAppBar: true,
        center: true,
        guest: true,
        navigation: false,
        keepAlive: false,
      },
    },
    {
      name: 'Login',
      path: 'login',
      component: () =>
        import(/* webpackChunkName: "auth" */ '@/views/auth/login'),
      meta: {
        hideAppBar: true,
        center: true,
        guest: true,
        navigation: false,
        keepAlive: false,
      },
    },
  ],
}
