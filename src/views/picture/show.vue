<template>
  <div class="overlay" :style="`background: rgba(0, 0, 0, ${opacity})`">
    <v-toolbar color="black" v-if="showTopBar" class="ml-4 tw-z-50">
      <v-btn icon color="white" @click="goBack" class="tw-absolute tw-z-50">
        <v-icon>mdi-arrow-left</v-icon>
      </v-btn>
    </v-toolbar>
    <div
      class="preview-img tw-absolute tw-z-40"
      :style="{
        top: show.rect.top + 'px',
        left: show.rect.left + 'px',
      }"
    >
      <img
        :src="show.url"
        alt="show._width"
        ref="img-container"
        :style="{
          transform: `translate(${positionStyle.translateX}px, ${positionStyle.translateY}px) scale(${positionStyle.scaleX}, ${positionStyle.scaleY})`,
          width: `${showWidth}px`,
          height: `${showHeight}px`,
          filter: `blur(${positionStyle.blur}px)`,
          transition: 'transform .135s cubic-bezier(0.0,0.0,0.2,1)',
        }"
      />
    </div>
    <v-hover v-slot:default="{ hover }" v-if="hasPrev"
      ><div
        class="left-arrow tw-absolute tw-cursor-pointer  tw-z-10"
        style="left: 0;top: 0; width: 33.3333%;bottom: 0;"
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
    <v-hover v-slot:default="{ hover }" v-if="hasPrev">
      <div
        class="right-arrow tw-absolute tw-cursor-pointer tw-z-10"
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
import { computedPosition, computedTransform } from '@/utils/preview'
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
        ? data[current.section - 1].data.length
        : -1
    },
    hasPrev() {
      const current = this.$store.state.picture.currentViewIndex
      const data = this.$store.state.picture.data
      return current.index > 0
        ? data[current.section].data[current.index - 1]
        : current.section > 0
        ? data[current.section - 1][data[current.section - 1].data.length - 1]
        : false
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
      const current = this.$store.state.picture.currentViewIndex
      const data = this.$store.state.picture.data
      return current.index < data[current.section].data.length - 1
        ? data[current.section].data[current.index + 1]
        : current.section < data.length - 1
        ? data[current.section + 1][0]
        : false
    },
  },
  data: () => ({
    opacity: 0,
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
  }),
  mounted() {
    this.$set(
      this.show,
      'url',
      this.show.url.replace('?x-bce-process=style/h200', '')
    )
    this.showWidth = this.show.width
    this.showHeight = this.show.height
    // gsap.to(this.$data, { duration: 0.1, opacity: 1 })
    this.opacity = 1
    const positionStyle = this.getImagePosition()
    positionStyle.blur = 0
    setTimeout(() => {
      this.positionStyle = positionStyle
    }, 10)

    // gsap.to(this.$data.positionStyle, 0.3, positionStyle).then(() => {})
  },
  beforeRouteLeave(to, from, next) {
    setTimeout(() => {
      next()
    }, 135)
  },
  methods: {
    getPosition(section, index) {
      console.log(this.$store.state.picture, section, index)
      const top =
        this.$store.state.picture.data[section].top +
        this.$store.state.picture.data[section].data[index].top -
        this.$store.state.picture.scrollTop
      const left = this.$store.state.picture.left
      const width = this.$store.state.picture.data[section].data[index].width
      const height = this.$store.state.picture.data[section].data[index].height
      return {
        top,
        left,
        width,
        height,
      }
    },
    goBack() {
      // 原始位置
      const origin = this.$refs['img-container'].getBoundingClientRect()
      // 新位置
      const newPosition = this.getPosition(this.show.section, this.show.index)
      const positionStyle = computedTransform(
        origin.width,
        origin.height,
        origin.top,
        origin.left,
        newPosition.width,
        newPosition.height,
        newPosition.top,
        newPosition.left
      )
      console.log(this.positionStyle, positionStyle)
      positionStyle.translateX =
        this.positionStyle.translateX + positionStyle.translateX
      positionStyle.translateY =
        this.positionStyle.translateY + positionStyle.translateY
      positionStyle.scaleX = this.positionStyle.scaleX / positionStyle.scaleX
      positionStyle.scaleY = this.positionStyle.scaleY / positionStyle.scaleY
      console.log(positionStyle)
      this.showTopBar = false
      this.opacity = 0
      this.positionStyle = positionStyle
      this.$router.back()
    },
    goNext() {
      if (this.hasNext) {
        const data = Object.assign(
          {
            rect: {
              top: 0,
              left: 0,
              bottom: 0,
              right: 0,
            },
          },
          this.hasNext
        )
        const rect = this.$refs['img-container'].getBoundingClientRect()
        this.showWidth = rect.width
        this.showHeight = rect.height
        // eslint-disable-next-line no-unreachable
        this.positionStyle = computedPosition(
          rect.width,
          rect.height,
          data._width,
          data._height,
          this.$vuetify.breakpoint.width,
          this.$vuetify.breakpoint.height,
          rect
        )

        this.$store.commit(
          'picture/SET_SHOW',
          Object.assign(
            {
              index: this.nextIndex,
              section: this.nextSection,
            },
            data
          )
        )
      }
    },
    goPrev() {
      if (this.prevSection > -1 && this.prevIndex > -1) {
        const data = this.$store.state.picture[this.prevSection][this.prevIndex]
        this.$store.commit('picture/SET_SHOW', data)
      }
    },
    getImageResetRatio(width, height) {
      // 获取预览框位置
      const top = 20
      const bottom = 20
      const left = 20
      const right = 20
      const windowHeight = this.$vuetify.breakpoint.height
      const windowWidth = this.$vuetify.breakpoint.width
      // 实际可使用的盒子大小
      const innerBoxHeight = windowHeight - top - bottom
      const innerBoxWidth = windowWidth - left - right
      // 图片可以完整的放在盒子里
      const ratioX = innerBoxWidth / width
      const ratioY = innerBoxHeight / height
      if (height <= innerBoxHeight && width <= innerBoxWidth) {
        return 1
      } else if (ratioX < ratioY) {
        // 无法完整放入，分别获取宽高的缩放比例
        return ratioX
      } else {
        return ratioY
      }
    },
    getWindowSize() {
      const windowHeight = this.$vuetify.breakpoint.height
      const windowWidth = this.$vuetify.breakpoint.width
      return {
        windowWidth,
        windowHeight,
      }
    },
    getImagePosition() {
      const rect = this.show.rect
      // 原图尺寸
      const imageRealWidth = this.show._width
      const imageRealHeight = this.show._height
      const previewOffset = {
        top: 20,
        left: 20,
        right: 20,
        bottom: 20,
      }
      const windowSize = this.getWindowSize()
      const imageRatio = this.getImageResetRatio(
        this.show._width,
        this.show._height
      )
      const positionY =
        previewOffset.top +
        (windowSize.windowHeight - previewOffset.top - previewOffset.bottom) / 2
      const positionX =
        previewOffset.left +
        (windowSize.windowWidth - previewOffset.left - previewOffset.right) / 2
      // 要进行的移动
      const translateX = positionX - (rect.left + rect.width / 2)
      const translateY = positionY - (rect.top + rect.height / 2)
      // 缩放
      const scaleY = (imageRatio * imageRealHeight) / rect.height
      const scaleX = (imageRatio * imageRealWidth) / rect.width
      return {
        translateX,
        translateY,
        scaleX,
        scaleY,
        showHeight: imageRatio * imageRealHeight,
        showWidth: imageRatio * imageRealWidth,
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
