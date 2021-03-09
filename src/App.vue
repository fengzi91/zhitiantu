<template>
  <v-app>
    <app-navigation-drawer></app-navigation-drawer>
    <app-bar v-if="showAppBar" />
    <v-main>
      <transition name="fade" mode="in-out">
        <keep-alive key="keep-alive">
          <router-view v-if="$route.meta.keepAlive"></router-view>
        </keep-alive>
      </transition>
      <transition name="fade" mode="in-out">
        <router-view
          key="no-keep-alive"
          v-if="!$route.meta.keepAlive"
        ></router-view>
      </transition>
      <Message />
      <Upload />
    </v-main>
  </v-app>
</template>

<script>
import AppBar from './components/Common/AppBar'
import AppNavigationDrawer from '@/components/Common/AppNavigationDrawer'
import { mapGetters } from 'vuex'
import Message from '@/components/Message/Index'
import Upload from '@/components/Upload/Index'
export default {
  name: 'App',

  components: {
    Message,
    AppNavigationDrawer,
    AppBar,
    Upload,
  },

  computed: {
    ...mapGetters(['showAppBar', 'isLoggedIn']),
  },

  data: () => ({}),
  methods: {},
}
</script>
<style lang="stylus" scoped>
.fade-enter-active, .fade-leave-active
  transition opacity .1s

.fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */
  opacity 0
</style>
