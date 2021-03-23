<template>
  <div :class="loading || showPasswordForm ? 'tw-h-full' : null">
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
          <div class="tw-my-md-8 tw-my-0 tw-mt-8 tw-bg-gradient-to-b ">
            <v-slide-y-transition mode="out-in">
              <template v-if="!isEditing">
                <v-card-title
                  v-if="collect.title"
                  key="title"
                  @click="setEditing"
                  >{{ collect.title }}</v-card-title
                >
                <v-card-title
                  v-else-if="canEdit"
                  key="title"
                  @click="setEditing"
                  >创建于 {{ collect.created_at }}</v-card-title
                >
              </template>
              <template v-if="isEditing">
                <div class="ml-4" key="input">
                  <v-text-field
                    label="标题"
                    v-model="title"
                    placeholder="输入一个标题"
                  ></v-text-field>
                  <v-text-field
                    label="设置密码"
                    prepend-inner-icon="mdi-lock"
                    v-model="editPassword"
                    hint="如果不需要修改密码，请留空"
                  ></v-text-field>
                </div>
              </template>
            </v-slide-y-transition>
          </div>
          <div class="tw-m-4 tw-flex">
            <div class="tw-flex tw-col-span-2">
              <v-avatar>
                <v-img :src="collect.user.profile_photo_url"></v-img>
              </v-avatar>
              <div class="tw-ml-2 tw-flex tw-flex-col tw-justify-between">
                <span class="tw-font-medium tw-flex-grow tw-mt-auto">{{
                  collect.user.name
                }}</span>
                <span class="tw-text-sm tw-text-gray-400 tw-align-baseline"
                  >创建于 {{ collect.created_at }}</span
                >
              </div>
            </div>
            <div class="tw-flex tw-items-end tw-ml-8">
              <v-btn icon>
                <v-icon>mdi-thumb-up</v-icon>
              </v-btn>
              {{ collect.likers_count }}
            </div>
          </div>
          <v-divider></v-divider>
          <picture-list
            :prent-data="data"
            :width="containerWidth"
            :can-check="canEdit && isEditing"
            :can-preview="!isEditing"
            :layout-config="layoutConfig"
          ></picture-list>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>
<script>
import { checkPassword, fetchData } from '@/api/collect'
import { mapGetters, mapState } from 'vuex'
import _ from 'lodash'
import PictureList from '@/components/Picture/List'
export default {
  components: {
    PictureList,
  },
  computed: {
    ...mapGetters(['checkedLength']),
    ...mapState({
      isEditing: state => state.collect.isEditing,
    }),
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
    canEdit() {
      return (
        this.collect.user_id === _.get(this.$store.state.auth, 'userInfo.id', 0)
      )
    },
    title: {
      get() {
        return this.$store.state.collect.updatingInfo.title
      },
      set(title) {
        this.$store.commit('collect/UPDATE_INFO', {
          key: 'title',
          value: title,
        })
      },
    },
    editPassword: {
      get() {
        return this.$store.state.collect.updatingInfo.password
      },
      set(password) {
        this.$store.commit('collect/UPDATE_INFO', {
          key: 'password',
          value: password,
        })
      },
    },
    layoutConfig() {
      return {
        targetRowHeight: 180,
        containerWidth: this.containerWidth,
        showWidows: true,
        containerPadding: {
          top: 12,
          right: 16,
          bottom: 12,
          left: 16,
        },
      }
    },
  },
  watch: {
    '$store.state.global.navigationDrawerMini'() {},
    isEditing(editing) {
      if (editing) {
        this.data = [
          {
            page: 1,
            data: this.$store.state.collect.updatingPictures,
          },
        ]
      }
    },
    '$store.state.collect.updatingPictures'() {
      this.data = [
        {
          page: 1,
          data: this.$store.state.collect.updatingPictures,
        },
      ]
    },
    '$store.state.collect.updated'(isUpdated) {
      if (isUpdated) {
        this.fetchData()
        this.$store.commit('collect/UPDATED', false)
      }
    },
  },
  created() {
    this.newPassword = this.password
  },
  mounted() {
    this.containerWidth =
      this.$refs.container.getBoundingClientRect().width - 24
    this.fetchData()
  },
  activated() {},
  beforeRouteLeave(to, from, next) {
    if (this.isEditing) {
      this.$store.commit('collect/CLEAR')
    }
    next()
  },
  data: () => ({
    collect: {
      pictures: [],
      user: {},
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
    // 变更为编辑状态
    async setEditing() {
      if (this.canEdit) {
        this.$store.commit('collect/SET_UPDATING_DATA', {
          collect: this.collect,
          data: this.data,
        })
        this.$store.commit('collect/SET_EDITING', true)
      }
    },
  },
}
</script>
