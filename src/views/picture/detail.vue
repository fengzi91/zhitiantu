<template>
  <div class="overlay" style="background: rgba(0, 0, 0, 1)">
    <v-toolbar color="black" class="ml-4 tw-z-20">
      <v-btn icon color="white" @click="goBack">
        <v-icon>mdi-arrow-left</v-icon>
      </v-btn>
      <v-spacer></v-spacer>
      <v-btn
        icon
        @click="like"
        :color="
          $store.state.like.picture[data.uuid] &&
          $store.state.like.picture[data.uuid].liked
            ? 'primary'
            : 'white'
        "
        :loading="
          $store.state.like.picture[data.uuid]
            ? $store.state.like.picture[data.uuid].loading
            : false
        "
      >
        <v-icon>mdi-thumb-up</v-icon>
      </v-btn>
      <span class="tw-text-white">{{
        $store.state.like.picture[data.uuid]
          ? $store.state.like.picture[data.uuid].count
          : 0
      }}</span>
    </v-toolbar>
    <div
      class="preview-img tw-z-40"
      :style="{
        width: `${style.width}px`,
        height: `${style.height}px`,
        top: `${style.top}px`,
        left: `${style.left}px`,
      }"
    >
      <img
        :src="data.url"
        :alt="data.title"
        ref="img-container"
        :style="{
          width: `${style.width}px`,
          height: `${style.height}px`,
        }"
      />
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
        style="right: 0;top: 0; width: 33.3333%;bottom: 0;margin-top: 76px;"
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
import { fetchData } from '@/api/pictures'
import { getPreviewImageStyle } from '@/utils/preview'
export default {
  computed: {
    ...mapState('picture', ['show']),
    prevSection() {
      const current = this.$store.state.picture.currentViewIndex
      if (current.index < 0) {
        return -1
      }
      return current.index > 0
        ? current.section
        : current.section > 0
        ? current.section - 1
        : -1
    },
    prevIndex() {
      const current = this.$store.state.picture.currentViewIndex
      const data = this.$store.state.picture.data
      if (current.index < 0 || data.length <= 0) {
        return -1
      }
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
      console.log(current, data)
      if (current.index < 0 || data.length <= 0) {
        return -1
      }
      return current.index < data[current.section].data.length - 1
        ? current.index + 1
        : current.section < data.length - 1
        ? 0
        : -1
    },
    nextSection() {
      const current = this.$store.state.picture.currentViewIndex
      const data = this.$store.state.picture.data
      if (current.index < 0 || data.length <= 0) {
        return -1
      }
      return current.index < data[current.section].data.length - 1
        ? current.section
        : current.section < data.length - 1
        ? current.section + 1
        : -1
    },
    hasNext() {
      return this.nextSection > -1 && this.nextIndex > -1
    },
  },
  data: () => ({
    loading: false,
    data: {},
    style: {},
  }),
  watch: {
    'show.uuid'() {
      this.loadData()
    },
  },
  mounted() {
    if (!this.show.uuid) {
      this.$set(this.show, 'uuid', this.$route.params.id)
      // this.show.uuid = this.$route.params.id
    } else {
      this.data = this.show
      this.style = getPreviewImageStyle(
        this.show,
        this.$vuetify.breakpoint.width,
        this.$vuetify.breakpoint.height
      )
    }
  },
  methods: {
    async loadData() {
      try {
        const { data } = await fetchData(this.show.uuid)
        this.$store.dispatch('like/setCount', {
          id: data.uuid,
          count: data.likers_count,
          type: 'picture',
        })
        this.$store.dispatch('like/setIsLiked', {
          id: data.uuid,
          liked: data.isLiked,
          type: 'picture',
        })
        this.data = data
        this.style = getPreviewImageStyle(
          { _width: data.width, _height: data.height },
          this.$vuetify.breakpoint.width,
          this.$vuetify.breakpoint.height
        )
        console.log('style', this.style)
      } catch (e) {
        console.log(e)
      }
    },
    goBack() {
      this.$router.push(this.$store.state.global.previewBackTo)
    },
    like() {
      this.$store.dispatch('like/like', { id: this.show.uuid, type: 'picture' })
    },
    changePicture(changeTo = 'next') {
      const section = changeTo === 'next' ? this.nextSection : this.prevSection
      const index = changeTo === 'next' ? this.nextIndex : this.prevIndex
      const data = this.$store.state.picture.data[section].data[index]
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
      this.$router.push({
        name: 'preview',
        params: { id: data.uuid },
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
