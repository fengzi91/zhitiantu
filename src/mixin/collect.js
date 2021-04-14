import justifiedLayout from 'justified-layout'
import { debounce } from 'lodash'
import { fetchIndex } from '@/api/collect'
export default {
  data: () => ({
    data: [],
    loading: false,
    containerWidth: 0,
    noMoreData: false,
    current_page: 1,
    loadDataError: false,
    sorts: [
      // {
      //   title: '点赞最多',
      //   key: '-thumb_up',
      // },
      {
        title: '最新创建',
        key: '-created_at',
      },
      {
        title: '最早创建',
        key: 'created_at',
      },
      // {
      //   title: '最多浏览',
      //   key: 'view_counts',
      // },
    ],
    sort: '-created_at',
    selectSort: 0,
  }),
  watch: {
    selectSort(index) {
      this.changeSort(this.sorts[index])
    },
    keyword(newKeyword, oldKeyword) {
      if (newKeyword !== oldKeyword) {
        this.debounceSearch(true)
      }
    },
  },
  created() {
    this.debounceSearch = debounce(this.fetchIndex, 500)
    this.debounceOnIntersect = debounce(this.onIntersect, 200)
  },
  async mounted() {
    this.containerWidth =
      this.$refs['container'].getBoundingClientRect().width - 32 - 88
  },
  methods: {
    onIntersect(entries) {
      if (entries[0].intersectionRatio >= 0.5) {
        if (!this.loading) {
          this.fetchIndex(this.data.length <= 0)
        }
      }
    },
    async fetchIndex(reset = false) {
      if (this.loading) return
      this.loading = true
      try {
        const params = this.getFetchParams(reset)
        const { data, meta, liked } = await fetchIndex(params)
        this.current_page = meta.current_page
        if (meta.current_page === meta.last_page || data.length <= 0) {
          this.noMoreData = true
        }
        // 布局
        const newData = data.map(d => {
          return Object.assign(d, this.layout(d.pictures))
        })
        this.$store.commit('like/FILL_COLLECT', data)
        this.data = this.data.concat(newData)
        this.loadDataError = false
        liked.forEach(k => {
          this.$store.dispatch('like/setIsLiked', {
            id: Object.keys(k)[0],
            type: 'collect',
            liked: k[Object.keys(k)[0]],
          })
        })
      } catch (e) {
        this.loadDataError = true
      } finally {
        this.loading = false
      }
    },
    refreshData() {
      this.noMoreData = false
      this.data = []
      this.current_page = 1
    },
    changeSort(item) {
      if (this.sort !== item.key) {
        this.sort = item.key
        this.fetchIndex(true)
      }
    },
    layout(pictures) {
      return justifiedLayout(pictures, {
        targetRowHeight: 80,
        containerWidth: this.containerWidth,
        showWidows: true,
        containerPadding: {
          top: 0,
          right: 0,
          bottom: 0,
          left: 0,
        },
      })
    },
    async like(link) {
      await this.$store.dispatch('like/like', { id: link, type: 'collect' })
    },
  },
}
