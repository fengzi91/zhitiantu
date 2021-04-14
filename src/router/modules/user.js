export default {
  path: '/user',
  name: 'User',
  component: () => import('@/components/User/Root'),
  redirect: { name: 'UserIndex' },

  children: [
    {
      path: ':id?',
      name: 'UserIndex',
      component: () =>
        import(/* webpackChunkName: "user" */ '@/views/user/index'),
      meta: {
        hideAppBar: false,
      },
      children: [
        {
          path: 'collect/:type?',
          name: 'UserCollect',
          component: () =>
            import(/* webpackChunkName: "user" */ '@/views/user/collect'),
        },
        {
          path: 'picture/:type?',
          name: 'UserPicture',
          component: () =>
            import(/* webpackChunkName: "user" */ '@/views/user/picture'),
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
