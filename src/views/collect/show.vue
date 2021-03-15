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
                  v-model="newPassword"
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
    <v-container>
      <v-row>
        <v-col ref="container">
          <div
            class="tw-my-md-8 tw-my-0 tw-mt-1 tw-bg-gradient-to-b"
            v-if="collect.title"
          >
            <v-card-title class="">{{ collect.title }}</v-card-title>
          </div>
          <picture-list
            :prent-data="data"
            :width="containerWidth"
          ></picture-list>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>
<script>
import { checkPassword, fetchData } from '@/api/collect'
import { mapGetters } from 'vuex'
import PictureList from '@/components/Picture/List'
export default {
  components: {
    PictureList,
  },
  computed: {
    ...mapGetters(['checkedLength']),
    id() {
      return this.$route.params.id || 0
    },
    passwordChecked() {
      return (
        this.$store.state.collect.passwordChecked.findIndex(
          i => i.id === this.id
        ) > -1
      )
    },
    password: {
      get() {
        const index = this.$store.state.collect.passwordChecked.findIndex(
          i => i.id === this.id
        )
        return index > -1
          ? this.$store.state.collect.passwordChecked[index].password
          : undefined
      },
      set(value) {
        this.$store.dispatch('collect/savePassword', {
          id: this.id,
          password: value,
        })
      },
    },
  },
  watch: {
    '$store.state.global.navigationDrawerMini'() {},
  },
  created() {
    this.newPassword = this.password
  },
  mounted() {
    this.containerWidth = this.$refs.container.getBoundingClientRect().width
    this.fetchData()
  },
  data: () => ({
    collect: {
      pictures: [],
    },
    data: [],
    pictures: [],
    loading: false,
    showPasswordForm: false,
    passwordError: false,
    passwordLoading: false,
    newPassword: null,
    containerWidth: 1160,
  }),
  methods: {
    async fetchData() {
      this.loading = true
      try {
        const requestParams = {}
        if (this.newPassword) {
          requestParams.password = this.newPassword
        }
        const { data } = await fetchData(this.id, requestParams)
        // this.layoutData(data.pictures)
        this.collect = data
        if (data.pictures.length > 0) {
          this.data.push({ page: 1, data: data.pictures })
        }
      } catch (e) {
        if (e.response && e.response.status === 403) {
          this.needPassword()
        }
      } finally {
        this.loading = false
      }
    },
    needPassword() {
      this.showPasswordForm = true
    },
    async checkPassword() {
      this.passwordLoading = true
      try {
        await checkPassword(this.id, this.newPassword)
        this.passwordError = false
        this.showPasswordForm = false
        // 更新到缓存
        this.password = this.newPassword
        this.fetchData()
      } catch (e) {
        console.log(e)
        this.passwordError = true
      } finally {
        this.passwordLoading = false
      }
    },
  },
}
</script>
