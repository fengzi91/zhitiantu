<template>
  <v-container class="fill-height">
    <v-row class="text-center" align="center" justify="center">
      <v-col cols="12" sm="8" md="6">
        <v-slide-y-transition>
          <v-card :loading="settingLoading ? 'warning' : false" v-show="loaded">
            <v-toolbar flat>
              <v-toolbar-title>设置个人信息</v-toolbar-title>
              <v-spacer></v-spacer>
            </v-toolbar>
            <v-card-text>
              <v-form>
                <v-input
                  :messages="['点击上传新的头像']"
                  prepend-icon="mdi-account-circle-outline"
                >
                  <v-avatar
                    @click="handleChooseAvatar"
                    class="tw-cursor-pointer"
                  >
                    <v-img :src="photo || userInfo.profile_photo_url"></v-img>
                  </v-avatar>
                </v-input>
                <input
                  type="file"
                  ref="avatar_file_input"
                  class="tw-hidden"
                  @change="handleChangeAvatar"
                  name="photo"
                />
                <v-text-field
                  :messages="['暂不支持修改用户名']"
                  append-icon="mdi-lock"
                  prepend-icon="mdi-account"
                  disabled
                  v-model="userInfo.name"
                >
                </v-text-field>

                <v-text-field
                  :messages="['填写个人介绍，不超过100字']"
                  prepend-icon="mdi-account-edit"
                  counter="100"
                  v-model="info.introduction"
                >
                </v-text-field>
              </v-form>
            </v-card-text>
            <v-divider></v-divider>
            <v-card-actions>
              <v-sheet class="ml-8 mt-4">
                <v-btn
                  color="primary"
                  @click="update"
                  :disabled="settingLoading"
                  >保存</v-btn
                >
              </v-sheet>
            </v-card-actions>
          </v-card>
        </v-slide-y-transition>
      </v-col>
    </v-row>
  </v-container>
</template>
<script>
import { mapState } from 'vuex'
import { updateInfo } from '@/api/user'
export default {
  computed: {
    ...mapState('auth', ['userInfo']),
  },
  data: () => ({
    settingLoading: false,
    info: {
      introduction: null,
    },
    photo: null,
    photo_file: null,
    loaded: false,
  }),
  mounted() {
    this.info.introduction = this.userInfo.introduction
    setTimeout(() => {
      this.loaded = true
    }, 100)
  },
  methods: {
    handleChooseAvatar() {
      this.$refs['avatar_file_input'].click()
    },
    handleChangeAvatar(e) {
      const file = e.target.files[0]
      this.photo = window.URL.createObjectURL(file)
      this.photo_file = file
    },
    async update() {
      this.settingLoading = true
      try {
        const updateData = new FormData()
        if (this.photo) {
          updateData.append('photo', this.photo_file)
        }
        updateData.append(
          'introduction',
          this.info.introduction ? this.info.introduction : ''
        )
        const { data } = await updateInfo(updateData)
        this.$store.commit('auth/SET_USER_INFO', data)
        this.$success('您的个人资料已更新')
      } catch (e) {
        console.log(e)
      } finally {
        this.settingLoading = false
      }
    },
  },
}
</script>
