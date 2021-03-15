export default {
  path: '/collects/:id',
  name: 'ViewCollect',
  component: () =>
    import(/* webpackChunkName: "collect" */ '@/views/collect/show'),
  meta: {
    appBarDefault: true,
    navigation: false,
    keepAlive: true,
  },
}
