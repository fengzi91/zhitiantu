<template>
  <div class="tw-h-full">
    <v-container
      :class="{ 'fill-height': loading || showPasswordForm }"
      v-if="loading || showPasswordForm"
    >
      <v-row align="center" justify="center" v-if="loading || showPasswordForm">
        <v-col cols="12" md="8" v-if="loading" class="mx-auto">
          <div class="d-flex tw-justify-center tw-items-center">
            <v-progress-circular
              indeterminate
              color="primary"
            ></v-progress-circular>
            <div class="ml-3">正在加载...</div>
          </div>
        </v-col>
        <v-col
          cols="12"
          md="8"
          lg="4"
          v-if="showPasswordForm && !passwordChecked"
          class="mx-auto"
        >
          <v-form>
            <v-card flat outlined :loading="passwordLoading">
              <v-toolbar flat>
                <v-toolbar-title>输入密码</v-toolbar-title>
              </v-toolbar>
              <v-card-text>
                <v-text-field
                  label="密码"
                  v-model="password"
                  :error-messages="
                    passwordError ? '您输入的密码有误，请重试' : null
                  "
                ></v-text-field>
              </v-card-text>
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn
                  elevation="0"
                  color="primary"
                  @click="checkPassword"
                  :disabled="passwordLoading"
                  >确认</v-btn
                >
              </v-card-actions>
            </v-card>
          </v-form>
        </v-col>
      </v-row>
    </v-container>
    <div
      class="tw-my-md-8 tw-my-0 tw-h-48 tw-mt-1"
      v-if="data.title"
      style="background-size: cover"
      :style="
        `background-image:url('${pictures[0].url}?x-bce-process=style/h200');`
      "
    >
      <v-card-title class="white--text">{{ data.title }}</v-card-title>
    </div>
    <div v-if="pictures.length > 0">
      <div class="tw-relative tw-w-full" :style="`height: ${totalHeight}px;`">
        <template v-for="(item, index) in pictures">
          <v-sheet
            :key="`index-picture-${index}`"
            class="tw-absolute tw-cursor-pointer"
            :style="{
              width: item.width + 'px',
              height: item.height + 'px',
              // left: item.left + 'px',
              // top: item.top + 'px',
              transform: `translate(${item.left}px, ${item.top}px)`,
            }"
          >
            <v-img
              :src="`${item.url}?x-bce-process=style/h200`"
              :lazy-src="`${item.url}?x-bce-process=style/h20`"
              :height="item.height"
              :width="item.width"
              cover
            />
          </v-sheet>
        </template>
      </div>
    </div>
  </div>
</template>
<script>
import { fetchData } from '@/api/collect'
import layoutHelper from '@/utils/justifiedLayout'

export default {
  computed: {
    id() {
      return this.$route.params.id || 0
    },
    containerWidth() {
      return (
        this.$vuetify.breakpoint.width -
        this.$vuetify.application.left -
        (this.$vuetify.breakpoint.mobile
          ? 0
          : this.$vuetify.breakpoint.scrollBarWidth)
      )
    },
    passwordChecked() {
      return this.$store.state.collect.passwordChecked.indexOf(this.id) > -1
    },
  },
  watch: {
    '$store.state.global.navigationDrawerMini'() {
      this.layoutData(this.data.pictures)
    },
  },
  created() {
    this.fetchData()
  },
  mounted() {},
  data: () => ({
    data: {
      pictures: [],
    },
    pictures: [],
    loading: false,
    totalHeight: 0,
    showPasswordForm: false,
    password: undefined,
    passwordError: false,
    passwordLoading: false,
  }),
  methods: {
    async fetchData() {
      this.loading = true
      const { data } = await fetchData(this.id)
      if (data.id === 1 && !this.passwordChecked) {
        this.needPassword()
        this.loading = false
        return
      }
      this.layoutData(data.pictures)
      this.data = data
      this.loading = false
    },
    layoutData(pictures) {
      console.log('记录 width -> ', this.containerWidth)
      console.log('$vuetify', this.$vuetify)
      const { boxes, containerHeight } = layoutHelper(
        pictures,
        this.containerWidth,
        64
      )
      const newData = boxes.map((item, index) => {
        const picture = { ...pictures[index] }
        picture._width = picture.width
        picture._height = picture.height
        return Object.assign(picture, item)
      })
      console.log(newData)
      this.totalHeight = containerHeight
      this.pictures = newData
    },
    needPassword() {
      this.showPasswordForm = true
    },
    checkPassword() {
      this.passwordLoading = true
      setTimeout(() => {
        if (this.password === '123456') {
          this.$store.dispatch('collect/savePassword', {
            id: this.id,
            checked: true,
          })
          this.passwordError = false
          this.showPasswordForm = false
          this.fetchData()
        } else {
          this.passwordError = true
        }
        this.passwordLoading = false
      }, 2000)
    },
  },
}
</script>
