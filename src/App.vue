<template>
  <v-app>
    <user-navigation v-if="isLoggedIn"></user-navigation>
    <app-navigation-drawer v-else-if="!isLoggedIn"></app-navigation-drawer>

    <collect-edit-app-bar v-if="isEditingCollect"></collect-edit-app-bar>
    <app-bar v-else-if="showAppBar" />
    <v-main>
      <transition name="fade" mode="in-out">
        <keep-alive>
          <router-view
            :key="$route.fullPath"
            v-if="$route.meta.keepAlive"
          ></router-view>
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
import CollectEditAppBar from '@/components/Common/CollectEditAppBar'
import { mapGetters, mapState } from 'vuex'
import Message from '@/components/Message/Index'
import Upload from '@/components/Upload/Index'
import UserNavigation from '@/components/Common/UserNavigation'
// import { csrfCookie } from '@/api/auth'

export default {
  name: 'App',

  components: {
    UserNavigation,
    Message,
    AppNavigationDrawer,
    CollectEditAppBar,
    AppBar,
    Upload,
  },

  computed: {
    ...mapGetters(['showAppBar', 'isLoggedIn']),
    ...mapState('global', ['navigationDrawer']),
    ...mapState({ isEditingCollect: state => state.collect.isEditing }),
    inUserInfoPage() {
      return this.$route.matched.some(record => record.name === 'User')
    },
  },
  created() {
    this.$store.dispatch('tag/getTags')
  },
  data: () => ({}),
  methods: {},
}
</script>
<style lang="stylus" scoped>
.fade-enter-active, .fade-leave-active
  transition opacity .3s

.fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */
  opacity 0
</style>
