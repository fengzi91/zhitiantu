<template>
  <v-navigation-drawer v-model="drawer" app clipped>
    <div class="tw-flex tw-flex-col tw-h-full">
      <div
        class="tw-flex tw-my-4 tw-mx-6 tw-flex-col tw-items-center"
        v-if="isLoggedIn"
      >
        <v-avatar size="112" class="tw-self-center tw-ml-1">
          <v-img :src="userinfo.profile_photo_url" :alt="userinfo.name" />
        </v-avatar>
        <div class="tw-text-2xl tw-mt-1">
          {{ userinfo.name }}
        </div>
        <div class="tw-text-gray-500 tw-text-sm">
          {{ userinfo.introduction }}
        </div>
      </div>
      <div v-else class="tw-m-6">
        <v-toolbar-title>织田图</v-toolbar-title>
      </div>
      <v-divider></v-divider>
      <v-list nav dense>
        <v-list-item-group color="primary" dense>
          <v-list-item
            v-for="(item, index) in global"
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
      <template v-if="isPicturesListPage && tags.length > 0">
        <v-divider></v-divider>
        <div class="tw-my-4">
          <v-subheader>筛选图片</v-subheader>
          <div class="tw-p-2">
            <v-chip-group active-class="primary--text" column>
              <v-chip
                v-for="{ name, count, id } in tags"
                :key="name"
                @click="filterTag(id)"
              >
                {{ name }}({{ count }})
              </v-chip>
            </v-chip-group>
          </div>
        </div>
      </template>
      <v-list dense nav v-if="isLoggedIn">
        <v-subheader>我的</v-subheader>
        <template v-for="(item, index) in items">
          <v-list-item
            :key="index"
            link
            @click="menuHandler(index)"
            v-if="!item.children || item.children.length === 0"
          >
            <v-list-item-icon>
              <v-icon v-text="item.icon"></v-icon>
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title>{{ item.title }}</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
          <v-list-group
            :key="index"
            v-if="item.children.length > 0"
            :value="false"
            :prepend-icon="item.icon"
          >
            <template v-slot:activator>
              <v-list-item-title>{{ item.title }}</v-list-item-title>
            </template>
            <v-list-item
              v-for="({ title, icon, handler }, i) in item.children"
              :key="i"
              @click="handlerMenu(handler)"
              dense
              class="tw-ml-6"
            >
              <v-list-item-icon>
                <v-icon v-text="icon"></v-icon>
              </v-list-item-icon>
              <v-list-item-title v-text="title"></v-list-item-title>
            </v-list-item>
          </v-list-group>
        </template>
      </v-list>
      <v-spacer></v-spacer>
      <div class="tw-text-center tw-my-2">
        <p class="tw-my-1">
          <a
            href="https://beian.miit.gov.cn/"
            target="_blank"
            class="text-decoration-none grey--text text--lighten-1"
            >京ICP备 04000001号</a
          >
        </p>
        <p class="tw-my-1">&copy; zhitiantu.com</p>
      </div>
    </div>
  </v-navigation-drawer>
</template>
<script>
import { menu } from '@/data/user'
import { global } from '@/data/menu'
import { mapGetters, mapState } from 'vuex'
export default {
  computed: {
    ...mapGetters(['userinfo', 'isLoggedIn']),
    ...mapState('tag', ['tags']),
    filter() {
      console.log(this.$store.state.tag.currentId)
      return this.$store.state.tag.currentId
    },
    items() {
      return menu.map(i => {
        if (!i.children) {
          i.children = []
        }
        return i
      })
    },
    isPicturesListPage() {
      return this.$route.name === 'Index'
    },
  },
  data: () => ({
    drawer: true,
    global,
  }),
  methods: {
    menuHandler(index) {
      const handler = this.items[index].handler
      this.handlerMenu(handler)
    },
    goTo(item) {
      const handle = item.handle
      this.handlerMenu(handle)
    },
    handlerMenu(handle) {
      typeof handle === 'string'
        ? this.$router.push({ name: handle })
        : typeof handle === 'object'
        ? this.$router.push(handle)
        : typeof handle === 'function'
        ? handle(this)
        : null
    },
    filterTag(id) {
      this.$store.commit('tag/SET_CURRENT_ID', id)
    },
  },
}
</script>
