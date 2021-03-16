<template>
  <div class="tw-w-full" ref="container">
    <v-card
      v-for="item in data"
      :key="item.link"
      class="tw-mt-8"
      :to="{ name: 'ViewCollect', params: { id: item.link } }"
    >
      <v-card-title>
        {{ item.title }}
      </v-card-title>
      <v-card-text>
        <div class="tw-relative" :style="`height: ${item.containerHeight}px;`">
          <img
            class="tw-absolute"
            v-for="(box, index) in item.boxes"
            :src="
              `${item.pictures[index].url}?x-bce-process=image/resize%2Cm_lfit%2Climit_0%2Ch_160`
            "
            :key="`collect-${item.link}-${index}`"
            :style="
              `left: ${box.left}px; top: ${box.top}px; width: ${box.width}px; height: ${box.height}px;`
            "
          />
        </div>
      </v-card-text>
    </v-card>
  </div>
</template>
<script>
import { fetchCollect } from '@/api/user'
import justifiedLayout from 'justified-layout'

export default {
  data: () => ({
    data: [],
    containerWidth: 0,
  }),
  async mounted() {
    this.containerWidth =
      this.$refs['container'].getBoundingClientRect().width - 32
    this.fetchIndex()
  },
  methods: {
    async fetchIndex() {
      this.loading = true
      try {
        const { data } = await fetchCollect({
          include: ['pictures'],
        })
        // 布局
        this.data = data.map(d => {
          console.log(this.layout(d.pictures))
          return Object.assign(d, this.layout(d.pictures))
        })
      } catch (e) {
        console.log(e)
      } finally {
        this.loading = false
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
  },
}
</script>
