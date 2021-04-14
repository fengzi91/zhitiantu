<template>
  <div>
    <v-row justify="center">
      <v-col cols="12">
        <v-toolbar flat class="tw-mt-6" ref="container-width">
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
    <picture-list
      :prent-data="data"
      :layout-config="layoutConfig"
      :can-preview="true"
      :can-check="false"
    ></picture-list>
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
  </div>
</template>
<script>
import { index } from '@/api/pictures'
import PictureList from '@/components/Picture/List'
import { debounce } from 'lodash'
import { mapGetters } from 'vuex'
export default {
  components: {
    PictureList,
  },
  computed: {
    ...mapGetters(['userinfo']),
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
    user_id() {
      return this.$route.params.id || this.userinfo.id
    },
  },
  data: () => ({
    sorts: [
      {
        title: '最近上传',
        key: '-created_at',
      },
      {
        title: '最早上传',
        key: 'created_at',
      },
    ],
    sort: '-created_at',
    selectSort: 0,
    noMoreData: false,
    loadDataError: false,
    containerHeight: [10],
    showSections: [0],
    data: [],
    picturesLoading: false,
    page: 1,
    current_page: 1,
    disabledLoad: false,
    containerWidth: 1350,
  }),
  created() {
    this.debounceOnIntersect = debounce(this.onIntersect, 200)
    this.debouncedLoadData = debounce(this.fetchIndex, 500)
  },
  mounted() {
    this.containerWidth = this.$refs[
      'container-width'
    ].$el.getBoundingClientRect().width
    this.handleSectionsShow = true
    this.debouncedLoadData(true)
  },
  methods: {
    async fetchIndex(reset = false) {
      if (this.picturesLoading || this.disabledLoad) return
      this.picturesLoading = true
      try {
        const params = {
          page: 1,
          // keyword: this.keyword,
        }
        // if (this.filterTag > 0) {
        //   params.tag = this.filterTag
        // }
        if (!reset) {
          params.page = ++this.current_page
        } else {
          this.refreshData()
          this.$vuetify.goTo(0)
        }
        if (this.user_id > 0) {
          params.user_id = this.user_id
        }
        const { data, meta } = await index(params)
        this.current_page = meta.current_page
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
    refreshData() {
      this.containerHeight = [10]
      this.noMoreData = false
      this.data = []
      this.current_page = 1
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
  },
}
</script>
