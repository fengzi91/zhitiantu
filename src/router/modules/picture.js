export default {
  path: '/pictures/:id',
  name: 'preview',
  component: () =>
    import(/* webpackChunkName: "picture" */ '@/views/picture/detail'),
  meta: {
    navigation: false,
  },
}
