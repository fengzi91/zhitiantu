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
                  <v-btn
                    icon
                    @click="like(item.link)"
                    :loading="
                      $store.state.like.collect[item.link] &&
                        $store.state.like.collect[item.link].loading
                    "
                    :color="
                      $store.state.like.collect[item.link] &&
                      $store.state.like.collect[item.link].liked
                        ? 'primary'
                        : null
                    "
                  >
                    <v-icon>mdi-thumb-up-outline</v-icon>
                  </v-btn>
                  <span class="tw-text-gray-500 tw-font-medium">{{
                    $store.state.like.collect[item.link].count
                  }}</span>
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
          <template v-else-if="!loadDataError">
            没有找到与
            <span class="tw-text-red-400">{{ keyword }}</span>
            相关的分享集
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
import { mapGetters } from 'vuex'
import collect from '@/mixin/collect'
export default {
  mixins: [collect],
  computed: {
    ...mapGetters(['userinfo']),
    keyword() {
      return this.$store.state.search.keywords[this.$route.fullPath]
    },
    user_id() {
      return this.$route.params.id || this.userinfo.id
    },
    type() {
      return this.$route.params.type
    },
  },
  watch: {
    type() {
      this.fetchIndex(true)
    },
  },
  async mounted() {
    this.containerWidth =
      this.$refs['container'].getBoundingClientRect().width - 32 - 24
  },
  methods: {
    getFetchParams(reset = false) {
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
      if (this.type) {
        params.type = this.type
      }
      return params
    },
  },
}
</script>
