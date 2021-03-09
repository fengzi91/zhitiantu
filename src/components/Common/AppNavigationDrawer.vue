<template>
  <v-navigation-drawer
    v-model="drawer"
    app
    clipped
    :mini-variant="$store.state.global.navigationDrawerMini"
  >
    <v-list dense>
      <v-subheader>REPORTS</v-subheader>
      <v-list-item-group color="primary" v-model="selectedItem">
        <v-list-item
          v-for="(item, index) in items"
          :key="index"
          @click="goTo(item)"
        >
          <v-list-item-icon>
            <v-icon v-text="item.icon"></v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title>{{ item.text }}</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list-item-group>
    </v-list>
  </v-navigation-drawer>
</template>
<script>
export default {
  computed: {
    drawer: {
      get() {
        return this.$store.state.global.navigationDrawer
      },
      set(state) {
        this.$store.commit('global/SET_NAVIGATION_DRAWER', state)
      },
    },
    selectedItem: {
      get() {
        const route = this.$route
        return this.items.findIndex(i => {
          return typeof i.handle === 'object'
            ? i.handle.name === route.name
            : typeof i.handle === 'string'
            ? i.handle === route.name
            : 0
        })
      },
      set() {},
    },
  },
  data: () => ({
    items: [
      {
        text: '首页',
        name: 'Home',
        icon: 'mdi-home',
        handle: { name: 'Home' },
      },
      {
        text: '关于',
        name: 'About',
        icon: 'mdi-home',
        handle: { name: 'About' },
      },
      {
        text: '消息',
        name: 'message',
        handle: vm => {
          vm.$store.dispatch('message/pushMessage', {
            content: vm.message + vm.messageCount,
            type: 'info',
            timeout: vm.messageCount * 100,
          })
          vm.messageCount++
        },
        icon: 'mdi-home',
      },
    ],
    message: '消息',
    messageCount: 1,
  }),
  methods: {
    goTo(item) {
      const handle = item.handle

      typeof handle === 'string'
        ? this.$router.push({ name: handle })
        : typeof handle === 'object'
        ? this.$router.push(handle)
        : typeof handle === 'function'
        ? handle(this)
        : null
    },
  },
}
</script>
