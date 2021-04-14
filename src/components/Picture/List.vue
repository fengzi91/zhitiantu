<template>
  <div
    class="tw-relative"
    :style="{ height: totalHeight + 'px', contain: 'layout' }"
  >
    <div
      v-for="(page, i) in data"
      class="tw-relative section"
      :style="{
        height: page.containerHeight + 'px',
      }"
      :key="`page-${i}`"
      :id="`section-${i}`"
      v-intersect="{
        handler: onSectionIntersect,
        options: {
          threshold: [0, 0.5, 1.0],
        },
      }"
    >
      <template v-if="showSections.indexOf(i) > -1">
        <v-hover
          v-for="(item, index) in page.data"
          :key="`index-picture-${index}`"
          v-slot="{ hover }"
        >
          <div
            class="tw-absolute tw-cursor-pointer"
            :style="{
              width: item.width + 'px',
              height: item.height + 'px',
              left: item.left + 'px',
              top: item.top + 'px',
              contain: 'layout',
              opacity: item.isShow ? 1 : 0,
              transition: 'opacity .135s',
              'background-color': item.isChecked ? '#e8f0fe' : 'transpter',
            }"
            :class="[
              item.isChecked && canCheck ? 'tw-bg-blue-400' : '',
              hover ? 'picture-background' : '',
            ]"
            :ref="`show-image-${i}-${index}`"
            @click="check(i, index)"
          >
            <v-btn
              fab
              class="tw-absolute tw-z-20"
              dark
              plain
              style="top: 4px; left: 4px; z-index:9; width: 22px;height: 22px;"
              :color="item.isChecked ? 'blue' : 'gray'"
              @click.stop="handleCheck(i, index)"
              v-if="(hover || checkedLength > 0) && canCheck"
            >
              <v-icon
                :color="item.isChecked ? 'blue' : 'gray'"
                dark
                v-html="
                  item.isChecked
                    ? 'mdi-check-circle'
                    : hover
                    ? 'mdi-check-circle-outline'
                    : 'mdi-checkbox-blank-circle-outline'
                "
              ></v-icon>
            </v-btn>
            <v-btn
              icon
              small
              color="white"
              class="tw-absolute tw-z-20"
              style="bottom: 0; right: 0; z-index:9"
              @click.stop="preview(i, index)"
              v-if="hover && checkedLength > 0 && canCheck && canPreview"
            >
              <v-icon color="gray">mdi-magnify-plus-outline</v-icon>
            </v-btn>
            <img
              :src="`${item.url}?x-bce-process=style/h200`"
              :lazy-src="`${item.url}?x-bce-process=style/h20`"
              :height="item.height"
              :width="item.width"
              class="picture-transition"
              :class="
                item.isChecked && canCheck ? 'tw-transform tw-scale-90' : ''
              "
            />
            <div
              v-show="hover"
              class="tw-transition-all tw-duration-100 tw-text-sm tw-absolute tw-inset-0 picture-background tw-z-0 tw-text-white tw-p-2 tw-inline-flex tw-items-end"
            >
              {{ item.title }}
            </div>
          </div>
        </v-hover>
      </template>
    </div>
  </div>
</template>
<script>
import { mapGetters } from 'vuex'
import { getPreviewImageStyle } from '@/utils/preview'
import store from '@/store'
import justifiedLayout from "justified-layout";

export default {
  props: {
    prentData: {
      type: Array,
      default: () => [],
    },
    width: {
      type: Number || String,
      default: () => 0,
    },
    canCheck: {
      type: Boolean,
      default: false
    },
    canPreview: {
      type: Boolean,
      default: true
    },
    layoutConfig: {
      type: Object,
      default:() => ({
        targetRowHeight: 180,
        containerWidth: 0,
        showWidows: true,
        containerPadding: {
          top: 0,
          right: 0,
          bottom: 0,
          left: 0,
        },
      })
    }
  },
  data: () => ({
    data: [],
    containerHeight: [10],
    picturesLoading: false,
    page: 1,
    current_page: 1,
    disabledLoad: false,
    showSections: [0],
    handleSectionsShow: true,
    loadCount: 0,
    noMoreData: false,
    loadDataError: false,
  }),
  computed: {
    ...mapGetters(['checkedLength']),
    totalHeight() {
      return this.containerHeight.reduce((t, n) => t + n)
    },
    containerWidth() {
      return this.width > 0
        ? this.width
        : this.$vuetify.breakpoint.width -
            this.$vuetify.application.left -
            this.$vuetify.breakpoint.scrollBarWidth
    },
  },
  mounted() {
    this.handleSectionsShow = true
  },
  activated() {
    const current = store.state.picture.currentViewIndex
    const _index = store.state.picture.initIndex
    const _section = store.state.picture.initSection

    if (current.index > -1) {
      this.showSections = [current.section]

        this.data[current.section] &&
          this.data[current.section].data &&
          this.data[current.section].data[current.index]
        ? this.$set(
            this.data[current.section].data[current.index],
            'isShow',
            true
          )
        : null
      this.handleSectionsShow = true
    }
    if (_section > -1 || _index > -1) {
      if (this.data[_section] && this.data.[_section].data) {
        this.$set(this.data[_section].data[_index], 'isShow', true)
        this.$store.commit('picture/SET_INIT_DATA', { section: -1, index: -1 })
      }
    }
  },
  watch: {
    async '$store.state.global.navigationDrawerMini'() {
      this.disabledLoad = true
      await this.layoutAllData(this.data)
      this.$nextTick(() => {
        this.disabledLoad = false
      })
    },
    '$store.state.checked.clearCount'(count) {
      if (count > 0) {
        this.data.forEach(page => {
          page.data.forEach(i => (i.isChecked = false))
        })
        this.$store.commit('checked/SET_CLEAR')
      }
    },
    totalHeight(newHeight) {
      this.$emit('update-height', newHeight)
    },
    prentData(newData) {
      for (const d of newData) {
        // 如果有第一页数据 清空所有数据
        if (d.page === 1) {
          this.data = []
          this.containerHeight = [10]
        }
        this.layout(d.data, d.page)
      }
    },
  },
  methods: {
    /**
     * 重新渲染所有数据
     * @param data
     * @returns {Promise<void>}
     */
    async layoutAllData(data) {
      for (const d of data) {
        this.layout(d.data, d.key)
      }
    },
    layout(data, page = 1) {
      return new Promise(resolve => {
        const index = page - 1
        const config = this.layoutConfig
        if (config.containerWidth === 0) {
          config.containerWidth = this.containerWidth
        }
        const { boxes, containerHeight } = justifiedLayout(
          data, config
        )
        // 把坐标和图片合并到一起
        const newData = boxes.map((item, index) => {
          const picture = { ...data[index] }
          picture._width = picture.width
          picture._height = picture.height
          picture.isChecked = false
          picture.isShow = true
          return Object.assign(picture, item)
        })
        // 记录一下 top
        let top = 76
        if (this.data.length > 0) {
          top = this.data.reduce((i, n) => i + n.containerHeight, top)
        }
        const currentData = {
          key: page,
          data: newData,
          boxes,
          containerHeight,
          top,
        }
        this.$set(this.data, index, currentData)
        this.$set(this.containerHeight, index, containerHeight)
        this.$emit('update-height', this.totalHeight)
        resolve()
      })
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
        params: { id: item.uuid },
      })
    },
    check(i, index) {
      if (this.checkedLength > 0 || !this.canPreview) {
        this.handleCheck(i, index)
        return
      }
      this.preview(i, index)
    },
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
