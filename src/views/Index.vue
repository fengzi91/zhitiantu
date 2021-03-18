<template>
  <div class="tw-h-full">
    <picture-list
      :prent-data="data"
      @update-height="setHeight($event)"
      :layout-config="layoutConfig"
      :can-preview="true"
      :can-check="true"
    ></picture-list>
    <v-container
      fluid
      :class="{ 'fill-height': data.length <= 0 }"
      v-show="noMoreData"
    >
      <v-row>
        <v-col>
          <v-sheet
            elevation="2"
            class="tw-max-w-md mx-auto tw-p-6 text-center"
            rounded
          >
            <template v-if="data.length > 0">
              已加载全部数据
            </template>
            <template v-else-if="!loadDataError">
              没有找到与
              <span class="tw-text-red-400">{{ keyword }}</span>
              相关的图片
            </template>
            <template v-else>
              网络错误，请稍后<span
                class="tw-text-indigo-400 tw-cursor-pointer"
                @click="fetchIndex"
                >重试</span
              >！
            </template>
          </v-sheet>
        </v-col>
      </v-row>
    </v-container>
    <v-container fluid v-show="!noMoreData">
      <v-row class="text-center">
        <v-col cols="12">
          <div
            v-if="!disabledLoad"
            v-intersect="{
              handler: debounceOnIntersect,
              options: {
                threshold: [0, 0.5, 1.0],
              },
            }"
            style="height: 150px;"
          >
            <v-sheet
              elevation="2"
              class="tw-max-w-md mx-auto"
              rounded
              v-show="picturesLoading"
            >
              <v-card-text>
                <v-progress-circular
                  indeterminate
                  color="primary"
                  class="tw-mr-2"
                ></v-progress-circular
                >正在加载数据...
              </v-card-text>
            </v-sheet>
          </div>
        </v-col>
      </v-row>
    </v-container>
    <share-dialog></share-dialog>
  </div>
</template>

<script>
import { index } from '@/api/pictures'
// import layoutHelper from '@/utils/justifiedLayout'
import { debounce } from 'lodash'
import { getPreviewImageStyle } from '@/utils/preview'
import store from '@/store'
import { mapGetters, mapState } from 'vuex'
import PictureList from '@/components/Picture/List'
import ShareDialog from '@/components/Share/Dialog'
export default {
  name: 'Home',
  components: {
    PictureList,
    ShareDialog,
  },
  data: () => ({
    containerHeight: [10],
    data: [],
    picturesLoading: false,
    page: 1,
    current_page: 1,
    disabledLoad: false,
    showSections: [0],
    handleSectionsShow: true,
    loadCount: 0,
    noMoreData: false,
    loadDataError: false,
    totalHeight: 10,
  }),
  computed: {
    ...mapGetters(['checkedLength']),
    ...mapState('search', ['keyword']),
    ...mapState({
      filterTag: state => state.tag.currentId,
    }),
    containerWidth() {
      return (
        this.$vuetify.breakpoint.width -
        this.$vuetify.application.left -
        this.$vuetify.breakpoint.scrollBarWidth
      )
    },
    layoutConfig() {
      return {
        targetRowHeight: 180,
        containerWidth: this.containerWidth,
        showWidows: false,
        containerPadding: {
          top: 12,
          right: 16,
          bottom: 12,
          left: 16,
        },
      }
    },
  },
  activated() {
    const current = store.state.picture.currentViewIndex
    const _index = store.state.picture.initIndex
    const _section = store.state.picture.initSection

    if (current.index > -1) {
      this.showSections = [current.section]
      this.$set(this.data[current.section].data[current.index], 'isShow', true)
      this.handleSectionsShow = true
    }
    if (_section > -1 || _index > -1) {
      this.$set(this.data[_section].data[_index], 'isShow', true)
      this.$store.commit('picture/SET_INIT_DATA', { section: -1, index: -1 })
    }
  },
  created() {
    this.debounceOnIntersect = debounce(this.onIntersect, 200)
    this.debouncedLoadData = debounce(this.fetchIndex, 500)
  },
  mounted() {
    this.handleSectionsShow = true
    this.debouncedLoadData(true)
  },
  watch: {
    async '$store.state.global.navigationDrawerMini'() {
      this.disabledLoad = true
      await this.layoutAllData(this.data)
      this.$nextTick(() => {
        this.disabledLoad = false
      })
    },
    keyword() {
      this.debouncedLoadData(true)
    },
    filterTag() {
      this.debouncedLoadData(true)
    },
  },
  methods: {
    async fetchIndex(reset = false) {
      this.loadCount++
      if (this.picturesLoading || this.disabledLoad) return
      this.picturesLoading = true
      try {
        const params = {
          page: 1,
          keyword: this.keyword,
        }
        if (this.filterTag > 0) {
          params.tag = this.filterTag
        }
        if (!reset) {
          params.page = ++this.current_page
        } else {
          this.refreshData()
        }
        const { data, meta } = await index(params)
        this.current_page = meta.current_page
        if (reset) {
          this.$vuetify.goTo(0)
        }
        // if (data.length > 0) {
        //   await this.layout(data, this.current_page)
        // }
        this.data.push({ page: this.current_page, data })
        if (meta.current_page === meta.last_page || data.length <= 0) {
          this.noMoreData = true
        }
        this.picturesLoading = false
        this.loadDataError = false
      } catch (error) {
        this.picturesLoading = false
        this.noMoreData = true
        this.loadDataError = true
      }
    },
    // 清理数据
    refreshData() {
      this.containerHeight = [10]
      this.noMoreData = false
      this.data = []
      this.current_page = 1
    },
    // /**
    //  * 重新渲染所有数据
    //  * @param data
    //  * @returns {Promise<void>}
    //  */
    // async layoutAllData(data) {
    //   for (const d of data) {
    //     this.layout(d.data, d.key)
    //   }
    // },
    // layout(data, page = 1) {
    //   return new Promise(resolve => {
    //     const index = page - 1
    //     const { boxes, containerHeight } = layoutHelper(
    //       data,
    //       this.containerWidth,
    //       12
    //     )
    //     // 把坐标和图片合并到一起
    //     const newData = boxes.map((item, index) => {
    //       const picture = { ...data[index] }
    //       picture._width = picture.width
    //       picture._height = picture.height
    //       picture.isChecked = false
    //       picture.isShow = true
    //       return Object.assign(picture, item)
    //     })
    //     // 记录一下 top
    //     let top = 76
    //     if (this.data.length > 0) {
    //       top = this.data.reduce((i, n) => i + n.containerHeight, top)
    //     }
    //     const currentData = {
    //       key: page,
    //       data: newData,
    //       boxes,
    //       containerHeight,
    //       top,
    //     }
    //     this.$set(this.data, index, currentData)
    //     this.$set(this.containerHeight, index, containerHeight)
    //     resolve()
    //   })
    // },
    onSectionIntersect(entries) {
      const target = entries[0].target
      const index = parseInt(target.id.replace('section-', ''))
      if (entries[0].isIntersecting) {
        if (this.showSections.indexOf(index) < 0 && this.handleSectionsShow) {
          this.showSections.push(index)
        }
      } else {
        if (this.showSections.indexOf(index) > -1 && this.handleSectionsShow) {
          this.showSections = this.showSections.filter(i => i !== index)
        }
      }
    },
    onIntersect(entries) {
      // More information about these options
      // is located here: https://developer.mozilla.org/en-US/docs/Web/API/Intersection_Observer_API
      if (entries[0].intersectionRatio >= 0.5) {
        if (!this.disabledLoad) {
          this.fetchIndex(this.data.length <= 0)
        }
      }
    },
    handleCheck(i, index) {
      const checked = this.data[i].data[index].isChecked
      this.$set(this.data[i].data[index], 'isChecked', !checked)
      this.$store.commit('checked/CHECK', this.data[i].data[index])
    },
    preview(i, index) {
      this.handleSectionsShow = false
      const item = { ...this.data[i].data[index] }
      this.$set(this.data[i].data[index], 'isShow', false)
      let { width, height } = getPreviewImageStyle(
        item,
        this.$vuetify.breakpoint.width,
        this.$vuetify.breakpoint.height
      )
      const rect = this.$refs[
        `show-image-${i}-${index}`
      ][0].getBoundingClientRect()
      // 取当前显示的数据所有 ID
      this.$store.commit('picture/SET_DATA', this.data)
      const scrollTop = document.scrollingElement.scrollTop
      this.$store.commit('picture/SET_INIT_SCROLL_TOP', scrollTop)
      this.$store.commit('picture/SET_SCROLL_TOP', 0)
      this.$store.commit(
        'picture/SET_SHOW',
        Object.assign(
          {
            show_width: width,
            show_height: height,
            rect: rect,
            section: i,
            index,
          },
          item
        )
      )
      this.$store.commit('picture/SET_INIT_DATA', { section: i, index })
      this.$router.push({
        name: 'preview',
        params: { id: 'dsaczxcuirewurhsfkjdshfsdjk' },
      })
    },
    check(i, index) {
      if (this.checkedLength > 0) {
        this.handleCheck(i, index)
        return
      }
      this.preview(i, index)
    },
    setHeight() {},
  },
}
</script>
<style lang="scss" scoped>
.picture-transition {
  transition: transform 0.135s cubic-bezier(0, 0, 0.2, 1);
}
.picture-background {
  background: linear-gradient(
    to top,
    rgba(0, 0, 0, 0.26),
    transparent 56px,
    transparent
  );
}
</style>
