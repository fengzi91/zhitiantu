<template>
  <v-app-bar app color="primary" dark clipped-left>
    <template
      v-if="checkedLength <= 0 || $store.state.global.appBarType === 'default'"
    >
      <div class="d-flex align-center">
        <v-app-bar-nav-icon
          v-if="isLoggedIn"
          @click="toggleDrawer"
          class="mr-2"
        >
        </v-app-bar-nav-icon>

        <v-toolbar-title>我的图片网站</v-toolbar-title>
      </div>

      <v-spacer></v-spacer>
      <search-input></search-input>
      <v-spacer></v-spacer>
      <v-btn :to="{ name: 'Login' }" text v-if="!isLoggedIn">
        <span class="mr-2">登录/注册</span>
        <v-icon>mdi-auth</v-icon>
      </v-btn>
      <template v-else>
        <v-menu open-on-hover offset-y>
          <template v-slot:activator="{ on, attrs }">
            <v-avatar size="36" v-bind="attrs" v-on="on">
              <img :src="userinfo.profile_photo_url" />
            </v-avatar>
          </template>

          <v-list dense>
            <v-list-item
              v-for="(item, index) in items"
              :key="index"
              link
              @click="menuHandler(index)"
            >
              <v-list-item-icon>
                <v-icon v-text="item.icon"></v-icon>
              </v-list-item-icon>
              <v-list-item-content>
                <v-list-item-title>{{ item.title }}</v-list-item-title>
              </v-list-item-content>
            </v-list-item>
          </v-list>
        </v-menu>
      </template>
    </template>
    <template v-else>
      <div class="d-flex align-center">
        <v-btn icon @click="clearAll" class="mr-2">
          <v-icon>mdi-close</v-icon>
        </v-btn>
        <v-toolbar-title>选则了 {{ checkedLength }} 张图片</v-toolbar-title>
      </div>
      <v-spacer></v-spacer>
      <v-tooltip bottom>
        <template v-slot:activator="{ on, attrs }">
          <v-btn
            icon
            text
            class="mr-2"
            v-on="on"
            v-bind="attrs"
            @click="$store.commit('share/SHOW')"
          >
            <v-icon>mdi-share-variant-outline</v-icon>
          </v-btn>
        </template>
        <span>通过邮件或者链接分享</span>
      </v-tooltip>
      <v-tooltip bottom>
        <template v-slot:activator="{ on, attrs }">
          <v-btn text icon v-bind="attrs" v-on="on">
            <v-icon>mdi-bookmark-outline</v-icon>
          </v-btn>
        </template>
        <span>收藏这些图片</span>
      </v-tooltip>
      <v-tooltip bottom>
        <template v-slot:activator="{ on, attrs }">
          <v-btn text icon v-bind="attrs" v-on="on">
            <v-icon>mdi-heart-outline</v-icon>
          </v-btn>
        </template>
        <span>给这些图片点赞</span>
      </v-tooltip>
    </template>
  </v-app-bar>
</template>
<script>
import { mapGetters, mapState } from 'vuex'
import SearchInput from '@/components/Common/SearchInput'
import { menu } from '@/data/user'

export default {
  name: 'AppBar',
  components: { SearchInput },
  computed: {
    ...mapGetters(['isLoggedIn', 'userinfo', 'checkedLength']),
    ...mapState('global', ['navigationDrawer']),
  },
  data: () => ({
    items: menu,
  }),
  methods: {
    menuHandler(index) {
      const handler = this.items[index].handler
      if (typeof handler === 'function') {
        handler(this)
      } else if (typeof handler === 'object') {
        console.log(handler)
        this.$router.push(handler)
      }
    },
    toggleDrawer() {
      // const state = this.$store.state.global.navigationDrawer
      this.$store.commit('global/SET_NAVIGATION_DRAWER', !this.navigationDrawer)
    },
    clearAll() {
      this.$store.commit('checked/CLEAR')
    },
  },
}
</script>
