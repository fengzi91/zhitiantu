export default {
  path: '/user',
  name: 'User',
  component: () => import('@/components/User/Root'),
  redirect: { name: 'UserIndex' },

  children: [
    {
      path: '',
      name: 'UserIndex',
      component: () =>
        import(/* webpackChunkName: "user" */ '@/views/user/index'),
      meta: {
        hideAppBar: false,
      },
      children: [
        {
          path: 'collect',
          name: 'UserCollect',
          component: () =>
            import(/* webpackChunkName: "user" */ '@/views/user/collect'),
        },
      ],
    },
    {
      path: 'setting',
      name: 'UserSetting',
      component: () =>
        import(/* webpackChunkName: "user" */ '@/views/user/setting'),
      meta: {
        center: true,
        auth: true,
        navigation: false,
        keepAlive: false,
      },
    },
    {
      path: 'setting/password',
      name: 'UserSafeSetting',
      component: () =>
        import(/* webpackChunkName: "user" */ '@/views/user/setting/safe'),
      meta: {
        center: true,
        auth: true,
        navigation: false,
        keepAlive: false,
      },
    },
  ],
}
