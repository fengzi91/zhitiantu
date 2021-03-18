export default {
  path: '/collects',
  name: 'Collect',
  redirect: {
    name: 'CollectIndex',
  },
  component: () =>
    import(/* webpackChunkName: "collect" */ '@/components/Common/Empty'),
  meta: {
    appBarDefault: true,
    navigation: false,
  },
  children: [
    {
      path: '',
      name: 'CollectIndex',
      component: () =>
        import(/* webpackChunkName: "collect" */ '@/views/collect/index'),
      meta: {
        keepAlive: true,
      },
    },
    {
      path: ':id',
      name: 'ViewCollect',
      component: () =>
        import(/* webpackChunkName: "collect" */ '@/views/collect/show'),
      meta: {
        keepAlive: true,
      },
    },
    // {
    //   path: ':id/edit',
    //   name: 'EditCollect',
    //   component: () =>
    //     import(/* webpackChunkName: "collect" */ '@/views/collect/edit.vue'),
    // },
  ],
}
