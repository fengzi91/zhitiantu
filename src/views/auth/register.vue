<template>
  <v-container class="fill-height">
    <v-row class="text-center" align="center" justify="center">
      <v-col cols="12" sm="8" md="4">
        <v-card :loading="registerLoading ? 'warning' : false">
          <v-toolbar color="primary" dark flat>
            <v-toolbar-title>注册</v-toolbar-title>
            <v-spacer></v-spacer>
            <v-btn text large to="/auth/login">
              已有账号？
            </v-btn>
          </v-toolbar>
          <v-card-text>
            <v-form v-model="valid" ref="registerForm">
              <v-text-field
                label="用户名"
                name="name"
                prepend-icon="mdi-account"
                v-model="name"
                :rules="nameRules"
                type="text"
              ></v-text-field>
              <v-text-field
                label="邮箱"
                name="email"
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
            </v-form>
          </v-card-text>
          <v-card-actions class="pl-5 pb-3">
            <v-btn
              color="primary"
              @click="registerSubmit"
              :disabled="registerLoading"
              >注册</v-btn
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
  name: 'Register',
  computed: {
    ...mapGetters(['authBackTo', 'authLoading', 'authRedirectTo']),
  },
  data: () => ({
    valid: false,
    emailRules: [
      v => !!v || '请填写常用邮箱',
      v =>
        /.+@((vip\.|)qq\.com)|(126\.com)|(163\.com)|(gmail\.com)/.test(v) ||
        '邮箱格式不正确,仅支持 @qq.com @126.com @163.com @gmail.com',
    ],
    passwordRules: [
      v => !!v || '请填写密码',
      v => (v && v.length >= 8) || '密码不能少于 8 位',
    ],
    nameRules: [
      v => !!v || '请填写用户名',
      v => (v && v.length >= 3) || '用户名不能少于 3 个字符',
      v => (v && v.length <= 32 && v.length >= 3) || '用户名不能超过 32 个字符',
    ],
    email: null,
    name: null,
    password: null,
  }),
  methods: {
    async registerSubmit() {
      // 进行表单校验后 使用 store 事件登录
      if (this.$refs.registerForm.validate()) {
        const registerData = {
          email: this.email,
          password: this.password,
          name: this.name,
        }
        if (await this.$store.dispatch('auth/register', registerData)) {
          this.$router.replace(this.authRedirectTo)
        }
      }
    },
  },
}
</script>
