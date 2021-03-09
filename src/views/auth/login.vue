<template>
  <v-container class="fill-height">
    <v-row class="text-center" align="center" justify="center">
      <v-col cols="12" sm="8" md="4">
        <v-card :loading="loginLoading ? 'warning' : false">
          <v-toolbar color="primary" dark flat>
            <v-toolbar-title>登录</v-toolbar-title>
            <v-spacer></v-spacer>
            <v-btn text large to="/auth/register">
              还没有账号？
            </v-btn>
          </v-toolbar>
          <v-card-text>
            <v-form v-model="valid" ref="loginForm">
              <v-text-field
                label="邮箱/用户名"
                name="login"
                prepend-icon="mdi-email"
                v-model="email"
                :rules="emailRules"
                type="text"
              ></v-text-field>

              <v-text-field
                id="password"
                label="密码"
                name="password"
                v-model="password"
                :rules="passwordRules"
                prepend-icon="mdi-lock"
                type="password"
              ></v-text-field>
              <v-checkbox
                v-model="remember"
                label="记住我?"
                required
              ></v-checkbox>
            </v-form>
          </v-card-text>
          <v-card-actions class="pl-5 pb-3">
            <v-btn color="primary" @click="loginSubmit" :disabled="loginLoading"
              >登录</v-btn
            >
            <v-btn text :to="authBackTo">返回</v-btn>
            <v-spacer></v-spacer>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>
<script>
import { mapGetters } from 'vuex'
export default {
  name: 'Login',
  computed: {
    ...mapGetters(['authBackTo', 'loginLoading', 'authRedirectTo']),
  },
  data: () => ({
    valid: false,
    emailRules: [
      v => !!v || '请填写用户名或邮箱',
      v => {
        if (v && v.indexOf('@') > -1) {
          return (
            /.+@((vip\.|)qq\.com)|(126\.com)|(163\.com)|(gmail\.com)/.test(v) ||
            '邮箱格式不正确'
          )
        } else {
          return !/^([_\-\d]).+/.test(v) || '用户名格式不正确'
        }
      },
    ],
    passwordRules: [
      v => !!v || '请填写密码',
      v => (v && v.length >= 8) || '密码不能少于 8 位',
    ],
    email: null,
    password: null,
    remember: false,
  }),
  methods: {
    async loginSubmit() {
      // 进行表单校验后 使用 store 事件登录
      if (this.$refs.loginForm.validate()) {
        const loginData = {
          email: this.email,
          password: this.password,
          remember: this.remember,
        }
        if (await this.$store.dispatch('auth/login', loginData)) {
          this.$router.replace(this.authRedirectTo)
        }
      }
    },
  },
}
</script>
