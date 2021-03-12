<template>
  <div class="overlay" :style="`background: rgba(0, 0, 0, ${opacity})`">
    <v-toolbar color="black" v-if="showTopBar" class="ml-4 tw-z-20">
      <v-btn icon color="white" @click="goBack">
        <v-icon>mdi-arrow-left</v-icon>
      </v-btn>
    </v-toolbar>
    <div
      class="preview-img tw-absolute tw-z-40"
      :style="{
        top: initBoxRect.top + 'px',
        left: initBoxRect.left + 'px',
        width: initBoxRect.width + 'px',
        height: initBoxRect.height + 'px',
      }"
      v-if="!transitionEnd"
    >
      <img
        :src="show.url"
        alt="show._width"
        ref="img-container"
        :style="{
          transform: `translate(${positionStyle.translateX}px, ${positionStyle.translateY}px) scale(${positionStyle.scaleX}, ${positionStyle.scaleY})`,
          width: `${initBoxRect.width}px`,
          height: `${initBoxRect.height}px`,
          filter: `blur(${blur}px)`,
          transition: 'transform .135s cubic-bezier(0.0,0.0,0.2,1)',
        }"
      />
    </div>
    <div class="tw-absolute tw-z-40" v-if="transitionEnd" :style="trueStyle">
      <img :src="show.url" alt="" class="tw-w-full tw-h-full" />
    </div>
    <div
      class="tw-absolute tw-z-50"
      v-if="loading"
      style="left: 50%;top: 50%; transform: translate(-50%, -50%);"
    >
      <v-progress-circular indeterminate color="primary"></v-progress-circular>
    </div>
    <v-hover v-slot:default="{ hover }" v-if="hasPrev"
      ><div
        class="left-arrow tw-absolute tw-cursor-pointer  tw-z-50"
        style="left: 0;top: 0; width: 33.3333%;bottom: 0; margin-top: 76px;"
        @click="goPrev"
      >
        <div
          class="tw-absolute"
          style="transform: translateY(-50%); top: 50%;"
          v-show="hover"
        >
          <v-btn icon>
            <v-icon color="white">mdi-arrow-left</v-icon>
          </v-btn>
        </div>
      </div>
    </v-hover>
    <v-hover v-slot:default="{ hover }" v-if="hasNext">
      <div
        class="right-arrow tw-absolute tw-cursor-pointer tw-z-50"
        style="right: 0;top: 0; width: 33.3333%;bottom: 0;"
        @click="goNext"
      >
        <div
          class="tw-absolute"
          style="transform: translateY(-50%); top: 50%; right: 0;"
          v-show="hover"
        >
          <v-btn icon>
            <v-icon color="white">mdi-arrow-right</v-icon>
          </v-btn>
        </div>
      </div>
    </v-hover>
  </div>
</template>
<script>
import { mapState } from 'vuex'
// import { getSmallImagePosition, getPreviewImageStyle } from '@/utils/preview'
import {
  getSmallImagePosition,
  computedTransform,
  getPreviewImageStyle,
  getCurrentShowImageScrollTop,
} from '@/utils/preview'
export default {
  computed: {
    ...mapState('picture', ['show']),
    prevSection() {
      const current = this.$store.state.picture.currentViewIndex
      return current.index > 0
        ? current.section
        : current.section > 0
        ? current.section - 1
        : -1
    },
    prevIndex() {
      const current = this.$store.state.picture.currentViewIndex
      const data = this.$store.state.picture.data
      return current.index > 0
        ? current.index - 1
        : current.section > 0
        ? data[current.section - 1].data.length - 1
        : -1
    },
    hasPrev() {
      return this.prevIndex > -1 && this.prevSection > -1
    },
    nextIndex() {
      const current = this.$store.state.picture.currentViewIndex
      const data = this.$store.state.picture.data
      return current.index < data[current.section].data.length - 1
        ? current.index + 1
        : current.section < data.length - 1
        ? 0
        : -1
    },
    nextSection() {
      const current = this.$store.state.picture.currentViewIndex
      const data = this.$store.state.picture.data
      return current.index < data[current.section].data.length - 1
        ? current.section
        : current.section < data.length - 1
        ? current.section + 1
        : -1
    },
    hasNext() {
      return this.nextSection > -1 && this.nextIndex > -1
    },
    isNext() {
      return (
        this.show.section >= this.initSection &&
        this.show.index >= this.initIndex
      )
    },
  },
  data: () => ({
    opacity: 0,
    blur: 3,
    showTopBar: true,
    positionStyle: {
      translateX: 0,
      translateY: 0,
      scaleX: 1,
      scaleY: 1,
      blur: 10,
    },
    width: 0,
    height: 0,
    showWidth: 0,
    showHeight: 0,
    initSection: -1,
    initIndex: -1,
    initBoxRect: {
      top: 0,
      left: 0,
      width: 0,
      height: 0,
    },
    initItem: {
      rect: {},
    },
    transitionEnd: false,
    trueStyle: {},
    loading: false,
    showSmallPosition: {
      top: 0,
      left: 0,
      width: 0,
      height: 0,
    },
  }),
  mounted() {
    if (this.show.url.indexOf('?x-bce-process=style/h200') < 0) {
      this.$set(this.show, 'url', this.show.url + '?x-bce-process=style/h200')
    }
    this.showWidth = this.show.width
    this.showHeight = this.show.height
    this.opacity = 1
    // 初始的缩小后盒子位置
    this.initBoxRect = {
      top: this.show.rect.top,
      left: this.show.rect.left,
      width: this.show.rect.width,
      height: this.show.rect.height,
    }
    const previewStyle = getPreviewImageStyle(
      this.show,
      this.$vuetify.breakpoint.width,
      this.$vuetify.breakpoint.height
    )
    const positionStyle = computedTransform(
      this.show.rect.width,
      this.show.rect.height,
      this.show.rect.top,
      this.show.rect.left,
      previewStyle.width,
      previewStyle.height,
      previewStyle.top,
      previewStyle.left
    )

    setTimeout(() => {
      this.positionStyle = positionStyle
      this.loadOrigin(this.show.url)
      this.handleTransitionEnd(previewStyle)
    }, 0)
    this.initIndex = this.show.index
    this.initSection = this.show.section
    this.initItem = Object.assign({}, this.show)
  },
  methods: {
    async showTrueContainer(previewStyle) {
      return new Promise(resolve => {
        setTimeout(() => {
          this.trueStyle = {
            top: `${previewStyle.top}px`,
            left: `${previewStyle.left}px`,
            width: `${previewStyle.width}px`,
            height: `${previewStyle.height}px`,
          }
          this.transitionEnd = true
          resolve()
        }, 200)
      })
    },
    async handleTransitionEnd(previewStyle) {
      await this.showTrueContainer(previewStyle)
      this.initBoxRect = previewStyle
      this.positionStyle = {
        translateX: 0,
        translateY: 0,
        scaleX: 1,
        scaleY: 1,
        blur: 0,
      }
      this.blur = 0
      this.transitionEnd = false
    },
    goBack() {
      const data = this.$store.state.picture.data
      const res = getSmallImagePosition(
        this.initItem.rect,
        data[this.initSection],
        this.initItem,
        data[this.show.section],
        data[this.show.section].data[this.show.index],
        this.$store.state.picture.initScrollTop
      )
      const positionStyle = computedTransform(
        this.initBoxRect.width,
        this.initBoxRect.height,
        this.initBoxRect.top,
        this.initBoxRect.left,
        res.width,
        res.height,
        res.top,
        res.left
      )
      // eslint-disable-next-line no-unreachable
      this.showTopBar = false
      this.opacity = 0
      // 把图换成小图
      this.$set(this.show, 'url', this.show.url + '?x-bce-process=style/h200')
      const scrollTop = getCurrentShowImageScrollTop(
        data[this.initSection],
        this.initItem,
        data[this.show.section],
        data[this.show.section].data[this.show.index],
        this.$store.state.picture.initScrollTop
      )
      scrollTop !== 0
        ? this.$store.commit('picture/SET_SCROLL_TOP', scrollTop)
        : null
      this.$nextTick(() => {
        this.positionStyle = positionStyle
        this.$router.back()
      })
    },
    loadOrigin(url) {
      this.loading = true
      this.blur = 3
      const image = new Image()
      image.src = url.replace('?x-bce-process=style/h200', '')
      image.onload = () => {
        //
        if (
          this.show.url.replace('?x-bce-process=style/h200', '') === image.src
        ) {
          this.$set(this.show, 'url', image.src)
          this.loading = false
          this.blur = 0
        }
      }
    },
    // 切换图片
    changePicture(changeTo = 'next') {
      const section = changeTo === 'next' ? this.nextSection : this.prevSection
      const index = changeTo === 'next' ? this.nextIndex : this.prevIndex
      const data = this.$store.state.picture.data[section].data[index]
      this.$set(this.show, 'url', data.url + '?x-bce-process=style/h200')
      this.loadOrigin(data.url)
      // 获取正在显示的样式
      // 先显示绝对的样式
      this.transitionEnd = true
      const windowWidth = this.$vuetify.breakpoint.width
      const windowHeight = this.$vuetify.breakpoint.height
      const style = getPreviewImageStyle(data, windowWidth, windowHeight)
      const transform = computedTransform(
        this.initBoxRect.width,
        this.initBoxRect.height,
        this.initBoxRect.top,
        this.initBoxRect.left,
        style.width,
        style.height,
        style.top,
        style.left
      )
      this.showSmallPosition = getSmallImagePosition(
        this.initItem.rect,
        this.$store.state.picture.data[this.initSection],
        this.initItem,
        this.$store.state.picture.data[section],
        data,
        this.$store.state.picture.initScrollTop
      )
      setTimeout(() => {
        this.transitionEnd = false
        this.positionStyle = transform
        this.$store.commit(
          'picture/SET_SHOW',
          Object.assign(
            {
              index,
              section,
            },
            data
          )
        )
      })
    },
    goNext() {
      if (this.hasNext) {
        this.changePicture('next')
      }
    },
    goPrev() {
      if (this.hasPrev) {
        this.changePicture('prev')
      }
    },
  },
}
</script>
<style lang="stylus" scoped>
.overlay
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 5
  .preview-img
    position absolute
    //left 50%
    //top 50%
    //transform translate(-50%, -50%)
</style>
