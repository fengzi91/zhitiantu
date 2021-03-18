<template>
  <div>
    <v-row justify="center">
      <v-col cols="12">
        <v-toolbar flat class="tw-mt-6">
          <v-spacer></v-spacer>
          <v-menu offset-y open-on-hover>
            <template v-slot:activator="{ on, attrs }">
              <v-btn text v-bind="attrs" v-on="on">
                <v-icon v-text="`mdi-sort`"></v-icon>
              </v-btn>
            </template>
            <v-list>
              <v-list-item-group v-model="selectSort" color="primary">
                <v-list-item v-for="(item, index) in sorts" :key="index">
                  <v-list-item-title>{{ item.title }}</v-list-item-title>
                </v-list-item>
              </v-list-item-group>
            </v-list>
          </v-menu>
        </v-toolbar>
      </v-col>
    </v-row>
    <v-row justify="center">
      <v-col cols="12" ref="container">
        <template v-for="item in data">
          <div class="tw-flex" :key="item.link">
            <!--            <div class="tw-flex-none tw-mt-4 tw-mr-4 tw-flex tw-flex-col" v-if="">-->
            <!--              <v-avatar>-->
            <!--                <v-img :src="item.user.profile_photo_url" />-->
            <!--              </v-avatar>-->
            <!--            </div>-->
            <div class="tw-w-full">
              <v-card class="tw-mb-8">
                <v-card-title>
                  {{ item.title }}
                </v-card-title>
                <v-card-text
                  class="tw-cursor-pointer"
                  @click="
                    $router.push({
                      name: 'ViewCollect',
                      params: { id: item.link },
                    })
                  "
                >
                  <div
                    class="tw-relative"
                    :style="`height: ${item.containerHeight}px;`"
                  >
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
                <v-card-actions>
                  <v-btn icon>
                    <v-icon>mdi-thumb-up-outline</v-icon>
                  </v-btn>
                  <v-btn icon>
                    <v-icon>mdi-bookmark-outline</v-icon>
                  </v-btn>
                  <v-spacer></v-spacer>
                  <v-btn
                    text
                    @click="
                      $router.push({
                        name: 'ViewCollect',
                        params: { id: item.link },
                      })
                    "
                  >
                    查看
                  </v-btn>
                </v-card-actions>
              </v-card>
            </div>
          </div>
        </template>
      </v-col>
    </v-row>
    <v-row v-show="noMoreData">
      <v-col>
        <v-sheet
          elevation="2"
          class="tw-max-w-md mx-auto tw-p-6 text-center"
          rounded
        >
          <template v-if="data.length > 0">
            已加载全部数据
          </template>
          <!--          <template v-else-if="!loadDataError">-->
          <!--            没有找到与-->
          <!--            <span class="tw-text-red-400">{{ keyword }}</span>-->
          <!--            相关的图片-->
          <!--          </template>-->
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
    <v-row v-show="!noMoreData">
      <v-col>
        <div
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
            v-show="loading"
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
  </div>
</template>
<script>
import justifiedLayout from 'justified-layout'
import { fetchIndex } from '@/api/collect'
import { debounce } from 'lodash'
import { mapGetters } from 'vuex'
export default {
  computed: {
    ...mapGetters(['userinfo']),
    keyword() {
      return this.$store.state.search.keywords[this.$route.name]
    },
    user_id() {
      return this.$route.params.id || this.userinfo.id
    },
  },
  watch: {
    keyword(newKeyword, oldKeyword) {
      if (newKeyword !== oldKeyword) {
        this.debounceSearch(true)
      }
    },
    selectSort(index) {
      this.changeSort(this.sorts[index])
    },
  },
  data: () => ({
    data: [],
    loading: false,
    containerWidth: 0,
    noMoreData: false,
    current_page: 1,
    sorts: [
      {
        title: '点赞最多',
        key: '-thumb_up',
      },
      {
        title: '最新创建',
        key: '-created_at',
      },
      {
        title: '最早创建',
        key: 'created_at',
      },
      {
        title: '最多浏览',
        key: 'view_counts',
      },
    ],
    sort: '-created_at',
    selectSort: 1,
  }),
  created() {
    this.debounceOnIntersect = debounce(this.onIntersect, 200)
    this.debounceSearch = debounce(this.fetchIndex, 500)
  },
  async mounted() {
    this.containerWidth =
      this.$refs['container'].getBoundingClientRect().width - 32 - 88
  },
  methods: {
    onIntersect(entries) {
      // More information about these options
      // is located here: https://developer.mozilla.org/en-US/docs/Web/API/Intersection_Observer_API
      if (entries[0].intersectionRatio >= 0.5) {
        if (!this.loading) {
          this.fetchIndex(this.data.length <= 0)
        }
      }
    },
    async fetchIndex(reset = false) {
      this.loading = true
      try {
        const params = {
          page: 1,
          include: ['pictures'],
          'filter[user_id]': this.user_id,
        }
        if (reset) {
          this.$vuetify.goTo(0)
          this.refreshData()
        } else {
          params.page = ++this.current_page
        }
        if (this.sort) {
          params.sort = this.sort
        }
        if (this.keyword) {
          params.keyword = this.keyword
        }
        const { data, meta } = await fetchIndex(params)
        this.current_page = meta.current_page
        if (meta.current_page === meta.last_page || data.length <= 0) {
          this.noMoreData = true
        }
        // 布局
        const newData = data.map(d => {
          return Object.assign(d, this.layout(d.pictures))
        })
        this.data = this.data.concat(newData)
      } catch (e) {
        console.log(e)
      } finally {
        this.loading = false
      }
    },
    // 清理数据
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
  },
}
</script>
