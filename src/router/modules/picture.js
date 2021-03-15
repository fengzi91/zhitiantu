export default {
  path: '/preview/:id',
  name: 'preview',
  component: () =>
    import(/* webpackChunkName: "picture" */ '@/views/picture/show'),
  meta: {
    navigation: false,
  },
}
