<template>
  <v-navigation-drawer
    v-model="drawer"
    absolute
    temporary
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
    <v-spacer></v-spacer>
    <v-list dense>
      <v-subheader>筛选图片</v-subheader>
      <v-list-item
        color="primary"
        @click="handleFilter({})"
        :input-value="filter.length <= 0"
      >
        <v-list-item-content>
          <v-list-item-title>全部</v-list-item-title>
        </v-list-item-content>
      </v-list-item>
      <template v-for="(item, index) in filters">
        <v-list-item
          v-if="item.value > 0"
          :key="index"
          @click="handleFilter(item)"
          :input-value="filter.indexOf(item.key) > -1"
          color="primary"
        >
          <v-list-item-content>
            <v-list-item-title
              >{{ item.key }}({{ item.value }})</v-list-item-title
            >
          </v-list-item-content>
        </v-list-item>
      </template>
    </v-list>
  </v-navigation-drawer>
</template>
<script>
import { mapState } from 'vuex'
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
    ...mapState('filter', ['filters', 'filter']),
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
        text: '关于',
        name: 'Index',
        icon: 'mdi-home',
        handle: { name: 'Index' },
      },
      {
        text: '分享集',
        name: 'About',
        icon: 'mdi-share-variant-outline',
        handle: {
          name: 'ViewCollect',
          params: { id: '3018031e-a1f9-439a-98a2-4ee0df024123' },
        },
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
    handleFilter(item) {
      this.$store.commit('filter/SET_FILTER', item)
    },
  },
}
</script>
