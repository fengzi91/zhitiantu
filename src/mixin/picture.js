export default {
  methods: {
    updateLiked(liked) {
      console.log('执行 ---', liked)
      liked.forEach(k => {
        this.$store.dispatch('like/setIsLiked', {
          id: Object.keys(k)[0],
          type: 'picture',
          liked: k[Object.keys(k)[0]],
        })
      })
    },
  },
}
