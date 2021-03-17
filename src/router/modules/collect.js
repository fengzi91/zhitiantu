export default {
  path: '/collects',
  name: 'Collect',
  component: () =>
    import(/* webpackChunkName: "collect" */ '@/views/collect/show'),
  meta: {
    appBarDefault: true,
    navigation: false,
  },
  children: [
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
