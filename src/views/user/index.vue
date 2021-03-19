<template>
  <v-container>
    <v-row justify="center">
      <v-col cols="10">
        <v-card
          flat
          color="gray"
          class="tw-mt-20"
          elevation="1"
          v-if="!isSelf || $route.name === 'UserIndex'"
        >
          <v-card-text class="tw-flex tw-p-6">
            <v-avatar size="120" class="tw-shadow-sm">
              <v-img :src="showUserinfo.profile_photo_url"></v-img>
            </v-avatar>
            <v-sheet
              class="tw-flex tw-flex-col tw-justify-center tw-gap-4 tw-ml-4"
            >
              <span class="tw-text-2xl">{{ showUserinfo.name }}</span>
              <span>{{ showUserinfo.introduction }}</span>
            </v-sheet>
          </v-card-text>
          <v-tabs v-model="tab" background-color="transparent">
            <v-tab
              v-for="item in items"
              :key="item.name"
              @click="
                $router.push({
                  name: item.handle.name,
                  params: { id: user_id },
                })
              "
            >
              {{ item.name }}
            </v-tab>
          </v-tabs>
        </v-card>
        <router-view></router-view>
      </v-col>
    </v-row>
  </v-container>
</template>
<script>
import { mapGetters } from 'vuex'
import { fetchUserInfo } from '@/api/user'

export default {
  computed: {
    ...mapGetters(['userinfo', 'isLoggedIn']),
    tab: {
      get() {
        const index = this.items.findIndex(
          i => i.handle.name === this.$route.name
        )
        return index > -1 ? index : 0
      },
      set() {},
    },
    user_id() {
      return this.$route.params.id || this.userinfo.id
    },
    isSelf() {
      return this.isLoggedIn && this.user_id === this.userinfo.id
    },
  },
  data: () => ({
    showUserinfo: {},
    items: [
      {
        name: '动态',
        handle: {
          name: 'UserIndex',
        },
      },
      {
        name: '分享集',
        handle: {
          name: 'UserCollect',
        },
      },
      {
        name: '赞过',
        handle: {
          name: 'UserIndex',
        },
      },
      {
        name: '收藏',
        handle: {
          name: 'UserIndex',
        },
      },
      {
        name: '粉丝',
        handle: {
          name: 'UserIndex',
        },
      },
    ],
  }),
  mounted() {
    this.fetchUserInfo()
  },
  methods: {
    async fetchUserInfo() {
      try {
        const { data } = await fetchUserInfo(this.user_id)
        this.showUserinfo = data
      } catch (e) {
        console.log(e)
      }
    },
  },
}
</script>
