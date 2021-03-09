<template>
  <div class="tw-h-full tw-mt-3">
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
        <template v-if="showSections.indexOf(i) > -2">
          <template v-for="(item, index) in page.data">
            <v-sheet
              :key="`index-picture-${index}`"
              class="tw-absolute tw-cursor-pointer"
              :style="{
                width: item.width + 'px',
                height: item.height + 'px',
                left: item.left + 'px',
                top: item.top + 'px',
                contain: 'layout',
              }"
              :class="item.isChecked ? 'tw-bg-blue-400' : ''"
              :color="item.isChecked ? '#e8f0fe' : ''"
              :ref="`show-image-${i}-${index}`"
              @click="check(i, index)"
            >
              <v-img
                :src="`${item.url}?x-bce-process=style/h200`"
                :lazy-src="`${item.url}?x-bce-process=style/h20`"
                :height="item.height"
                :width="item.width"
                class="picture-transition"
                cover
                :class="item.isChecked ? 'tw-transform tw-scale-90' : ''"
              />
            </v-sheet>
          </template>
        </template>
        <div class="tw-bg-red tw-w-full">{{ i }}</div>
      </div>
    </div>
    <v-container fluid>
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
import layoutHelper from '@/utils/justifiedLayout'
import { debounce } from 'lodash'
import ShareDialog from '@/components/Share/Dialog'
import { position } from '@/utils/preview'
import { mapGetters } from 'vuex'
export default {
  name: 'IndexPicture',
  components: {
    ShareDialog,
  },
  data: () => ({
    pictures: [],
    containerHeight: [10],
    boxes: [],
    data: [],
    picturesLoading: false,
    page: 1,
    current_page: 1,
    disabledLoad: false,
    showSections: [0],
  }),
  computed: {
    ...mapGetters(['checkedLength']),
    totalHeight() {
      return this.containerHeight.reduce((t, n) => t + n)
    },
    containerWidth() {
      return (
        this.$vuetify.breakpoint.width -
        this.$vuetify.application.left -
        this.$vuetify.breakpoint.scrollBarWidth
      )
    },
  },
  created() {
    this.debounceOnIntersect = debounce(this.onIntersect, 200)
  },
  mounted() {
    console.log('页面加载')
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
  },
  methods: {
    async fetchIndex(reset = false) {
      if (this.picturesLoading || this.disabledLoad) return
      this.picturesLoading = true
      try {
        const params = {
          page: 1,
        }
        if (!reset) {
          params.page = ++this.current_page
        }
        const { data, meta } = await index(params)
        this.current_page = meta.current_page
        await this.layout(data, this.current_page)
        this.picturesLoading = false
      } catch (error) {
        console.log(error)
      }
    },
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
        const { boxes, containerHeight } = layoutHelper(
          data,
          this.containerWidth,
          0
        )
        // 把坐标和图片合并到一起
        const newData = boxes.map((item, index) => {
          const picture = { ...data[index] }
          picture._width = picture.width
          picture._height = picture.height
          picture.isChecked = false
          return Object.assign(picture, item)
        })
        const currentData = {
          key: page,
          data: newData,
          boxes,
          containerHeight,
        }
        this.$set(this.data, index, currentData)
        this.$set(this.containerHeight, index, containerHeight)
        resolve()
      })
    },
    onSectionIntersect(entries) {
      console.log(entries[0])

      const target = entries[0].target
      const index = parseInt(target.id.replace('section-', ''))
      if (entries[0].isIntersecting) {
        if (this.showSections.indexOf(index) < 0) {
          this.showSections.push(index)
        }
        console.log(target.id, '出现')
      } else {
        console.log(target.id, '被隐藏')
        if (this.showSections.indexOf(index) > -1) {
          this.showSections = this.showSections.filter(i => i !== index)
        }
      }
      console.log(this.showSections)
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
    check(i, index) {
      console.log(this.checkedLength)
      const item = { ...this.data[i].data[index] }
      const checked = this.data[i].data[index].isChecked
      if (this.checkedLength > 0) {
        this.$set(this.data[i].data[index], 'isChecked', !checked)
        this.$store.commit('checked/CHECK', this.data[i].data[index])
      } else {
        let { width, height } = position(item._width, item._height)
        const rect = this.$refs[
          `show-image-${i}-${index}`
        ][0].$el.getBoundingClientRect()
        item.url += '?x-bce-process=style/h200'
        this.$store.commit(
          'picture/SET_SHOW',
          Object.assign(
            { show_width: width, show_height: height, rect: rect },
            item
          )
        )
        this.$router.push({
          name: 'preview',
          params: { id: 'dsaczxcuirewurhsfkjdshfsdjk' },
        })
      }
    },
  },
}
</script>
<style lang="scss" scoped>
.picture-transition {
  transition: transform 0.135s cubic-bezier(0, 0, 0.2, 1);
}
</style>
