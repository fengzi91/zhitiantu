<template>
  <v-container class="fill-height">
    <v-row class="text-center" align="center" justify="center">
      <v-col cols="12" sm="8" md="4">
        <v-slide-y-transition>
          <v-card :loading="settingLoading ? 'warning' : false" v-show="loaded">
            <v-toolbar flat>
              <v-toolbar-title>修改您的密码</v-toolbar-title>
              <v-spacer></v-spacer>
            </v-toolbar>
            <v-card-text>
              <v-form ref="form" v-model="valid" lazy-validation>
                <v-text-field
                  prepend-icon="mdi-lock"
                  v-model="oldPassword"
                  label="旧密码"
                  hint="输入旧密码以确认您的身份"
                  :rules="oldPasswordRules"
                  :append-icon="showOldPassword ? 'mdi-eye' : 'mdi-eye-off'"
                  :type="showOldPassword ? 'text' : 'password'"
                  @click:append="showOldPassword = !showOldPassword"
                >
                </v-text-field>
                <v-text-field
                  hint="请填写新密码"
                  prepend-icon="mdi-lock"
                  v-model="password"
                  :rules="passwordRules"
                  label="新密码"
                  :append-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
                  :type="showPassword ? 'text' : 'password'"
                  @click:append="showPassword = !showPassword"
                >
                </v-text-field>
                <v-text-field
                  hint="再次输入新密码"
                  prepend-icon="mdi-lock"
                  v-model="passwordConfirmed"
                  :rules="[
                    ...passwordConfirmedRules,
                    v => v === password || '两次输入的密码不一致，请检查',
                  ]"
                  label="确认新密码"
                  :append-icon="
                    showPasswordConfirmed ? 'mdi-eye' : 'mdi-eye-off'
                  "
                  :type="showPasswordConfirmed ? 'text' : 'password'"
                  @click:append="showPasswordConfirmed = !showPasswordConfirmed"
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
import { updatePassword } from '@/api/user'
import { required, length } from '@/utils/rules'
export default {
  computed: {
    ...mapState('auth', ['userInfo']),
  },
  data: () => ({
    settingLoading: false,
    password: null,
    passwordConfirmed: null,
    oldPassword: null,
    loaded: false,
    valid: false,
    oldPasswordRules: [required('旧密码')],
    passwordRules: [required('新密码'), length('新密码', 8, 32, 'X')],
    passwordConfirmedRules: [v => !!v || '请再次输入新密码'],
    showOldPassword: false,
    showPassword: false,
    showPasswordConfirmed: false,
  }),
  mounted() {
    setTimeout(() => {
      this.loaded = true
    }, 100)
  },
  methods: {
    async update() {
      this.settingLoading = true
      try {
        const updateData = {
          old_password: this.oldPassword,
          password: this.password,
          password_confirmation: this.passwordConfirmed,
        }
        const { data } = await updatePassword(updateData)
        console.log(data)
        // this.$store.commit('auth/SET_USER_INFO', data)
        this.$success('您的登录密码已变更')
      } catch (e) {
        console.log(e)
      } finally {
        this.settingLoading = false
      }
    },
  },
}
</script>
