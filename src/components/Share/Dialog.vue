<template>
  <v-dialog v-model="dialog" width="500">
    <v-card>
      <v-card-title class="headline">
        <span>{{ showTitle }}</span>
        <v-spacer></v-spacer>
        <v-tooltip bottom>
          <template v-slot:activator="{ on, attrs }">
            <v-btn icon @click="hide" v-on="on" v-bind="attrs">
              <v-icon>mdi-close</v-icon>
            </v-btn>
          </template>
          <span>关闭</span>
        </v-tooltip>
      </v-card-title>
      <v-slide-x-transition mode="out-in">
        <v-card-text v-if="mode === 'email'" key="email">
          <v-text-field
            label="邮箱"
            v-model="email"
            :rules="emailRules"
            prepend-icon="mdi-email"
            placeholder="输入好友的电子邮件地址"
            ref="email"
            @input="emailInput"
            :disabled="emailSending"
          ></v-text-field>
          <div class="d-flex">
            <v-spacer></v-spacer>
            <v-btn color="primary" @click="sendMail" :disabled="!canSendEmail">
              <template v-if="emailSending">
                <v-progress-circular
                  v-if="emailSending"
                  indeterminate
                  :width="2"
                  size="20"
                  class="mr-1"
                ></v-progress-circular>
                正在发送
              </template>
              <template v-else>
                立即发送
              </template>
            </v-btn>
          </div>
        </v-card-text>
        <v-card-text v-if="mode === 'link'" key="link">
          <template v-if="!collectCreated">
            <v-text-field
              label="标题"
              prepend-icon="mdi-image-multiple"
              placeholder="输入一个标题"
              hint="可以留空"
            ></v-text-field>
            <v-text-field
              label="访问密码"
              prepend-icon="mdi-link-lock"
              placeholder="输入一个密码以限制访问"
              v-model="password"
            >
              <template v-slot:append-outer>
                <v-tooltip bottom>
                  <template v-slot:activator="{ on, attrs }">
                    <v-btn
                      v-bind="attrs"
                      v-on="on"
                      icon
                      @click="generatorPassword"
                    >
                      <v-icon>
                        mdi-lastpass
                      </v-icon>
                    </v-btn>
                  </template>
                  <span>生成一个随机密码</span>
                </v-tooltip>
              </template>
            </v-text-field>
            <div class="d-flex">
              <v-spacer></v-spacer>
              <v-btn
                color="primary"
                @click="createCollect"
                :disabled="createCollectLoading"
              >
                <template v-if="createCollectLoading">
                  <v-progress-circular
                    v-if="createCollectLoading"
                    indeterminate
                    :width="2"
                    size="20"
                    class="mr-1"
                  ></v-progress-circular>
                  正在创建
                </template>
                <template v-else>立即创建</template>
              </v-btn>
            </div>
          </template>
          <template v-else>
            <v-card-title>分享集已创建</v-card-title>
            <v-text-field
              label="分享集地址"
              v-model="link"
              :readonly="true"
              append-outer-icon="mdi-content-copy"
              @click:append-outer="copyLink"
              ref="select-input"
              :success-messages="collectCopied ? '链接地址已复制' : ''"
              :error-messages="
                collectLinkCopyError ? '链接复制失败，请手动复制' : ''
              "
            >
            </v-text-field>
            <div class="d-flex">
              <v-spacer></v-spacer>
              <v-btn color="primary" @click="viewCollect">查看分享集 </v-btn>
            </div>
          </template>
        </v-card-text>
      </v-slide-x-transition>
      <v-divider></v-divider>

      <v-card-actions>
        <v-slide-x-transition>
          <v-btn text color="primary" @click="changeMode">
            {{ bottomButtonText }}
          </v-btn>
        </v-slide-x-transition>
        <v-spacer></v-spacer>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
<script>
import { generatorPassword } from '@/utils'
export default {
  computed: {
    dialog: {
      get() {
        return this.$store.state.share.show
      },
      set(isShow) {
        const commitAction = isShow ? 'SHOW' : 'HIDE'
        this.$store.commit(`share/${commitAction}`)
        if (!isShow) {
          this.init()
        }
      },
    },
    bottomButtonText() {
      return this.mode === 'email' ? '通过链接分享' : '通过邮件分享'
    },
    showTitle() {
      return this.mode === 'email' ? '通过邮件分享' : '创建一个分享集'
    },
  },
  data: () => ({
    emailRules: [
      v => !!v || '请填写邮箱',
      v =>
        /.+@((vip\.|)qq\.com)|(126\.com)|(163\.com)|(gmail\.com)/.test(v) ||
        '邮箱格式不正确',
    ],
    mode: 'email',
    password: '',
    createCollectLoading: false,
    collectCreated: false,
    link: '',
    collectCopied: false,
    collectLinkCopyError: false,
    email: null,
    canSendEmail: false,
    emailSending: false,
  }),
  mounted() {},
  methods: {
    changeMode(type) {
      typeof type === 'string'
        ? (this.mode = type)
        : this.mode === 'email'
        ? (this.mode = 'link')
        : (this.mode = 'email')
    },
    generatorPassword() {
      this.password = generatorPassword(4)
    },
    createCollect() {
      if (this.createCollectLoading) return
      this.createCollectLoading = true
      setTimeout(() => {
        this.createCollectLoading = false
        this.collectCreated = true
        this.link = `https://www.a.com/${generatorPassword(16)}`
      }, parseInt(Math.random() * 5) * 1000)
    },
    viewCollect() {
      this.$router.push({ name: 'ViewCollect', params: { id: 1 } })
    },
    copyLink() {
      const input = this.$refs['select-input'].$refs['input']
      if (input) {
        input.focus()
        input.select()
        try {
          document.execCommand('copy')
          this.collectCopied = true
          this.collectLinkCopyError = false
        } catch (e) {
          this.collectCopied = false
          this.collectLinkCopyError = true
        }
      }
    },
    emailInput() {
      this.canSendEmail = this.$refs['email'].validate(true)
    },
    async sendMail() {
      if (this.emailSending) return
      this.emailSending = true
      try {
        await this.send()
        this.$store.dispatch('message/pushMessage', {
          type: 'info',
          content: '已发送邮件',
          timeout: 3000,
        })
      } catch (e) {
        this.$store.dispatch('message/pushMessage', {
          type: 'error',
          content: '邮件发送失败，请重试',
          timeout: 3000,
        })
      }
      this.emailSending = false
    },
    send() {
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          const isSuccess = parseInt(Math.random() * 3 + 1) > 2
          if (isSuccess) {
            resolve(true)
          } else {
            reject(false)
          }
        }, parseInt(Math.random() * 3 + 1) * 1000)
      })
    },
    hide() {
      this.$store.commit('share/HIDE')
      this.init()
    },
    init() {
      this.mode = 'email'
      this.password = ''
      this.createCollectLoading = false
      this.collectCreated = false
      this.link = ''
      this.collectCopied = false
      this.collectLinkCopyError = false
      this.email = null
      this.canSendEmail = false
      this.emailSending = false
    },
  },
}
</script>
