<template>
  <v-app-bar app color="primary" dark clipped-left>
    <div class="d-flex align-center">
      <!--v-app-bar-nav-icon class="mr-2"> </v-app-bar-nav-icon-->
      <template v-if="checkedLength <= 0">
        <v-tooltip bottom>
          <template v-slot:activator="{ on, attrs }">
            <v-btn icon v-bind="attrs" v-on="on" class="mr-2" @click="close">
              <v-icon>mdi-close</v-icon>
            </v-btn>
          </template>
          <span>放弃修改</span>
        </v-tooltip>
        <v-toolbar-title>修改分享集</v-toolbar-title>
      </template>
      <template v-else>
        <v-tooltip bottom>
          <template v-slot:activator="{ on, attrs }">
            <v-btn
              icon
              v-bind="attrs"
              v-on="on"
              class="mr-2"
              @click="$store.commit('checked/CLEAR')"
            >
              <v-icon>mdi-close</v-icon>
            </v-btn>
          </template>
          <span>取消选择</span>
        </v-tooltip>
        <v-toolbar-title
          >选中了 {{ checkedLength }} 张分享集中的图片</v-toolbar-title
        >
      </template>
    </div>
    <v-spacer></v-spacer>
    <v-tooltip bottom>
      <template v-slot:activator="{ on, attrs }">
        <v-btn icon v-bind="attrs" v-on="on" @click="upload">
          <v-icon>mdi-upload</v-icon>
        </v-btn>
      </template>
      <span>往分享集中添加图片</span>
    </v-tooltip>
    <template v-if="checkedLength > 0">
      <v-tooltip bottom>
        <template v-slot:activator="{ on, attrs }">
          <v-btn icon v-bind="attrs" v-on="on" @click="remove">
            <v-icon>mdi-trash-can</v-icon>
          </v-btn>
        </template>
        <span>将选中的图片从分享集中移除</span>
      </v-tooltip>
      <v-tooltip bottom>
        <template v-slot:activator="{ on, attrs }">
          <v-btn icon v-bind="attrs" v-on="on" @click="removeReverse">
            <v-icon>mdi-filter-outline</v-icon>
          </v-btn>
        </template>
        <span>仅保留选中的图片</span>
      </v-tooltip>
    </template>
    <template v-else>
      <v-tooltip bottom>
        <template v-slot:activator="{ on, attrs }">
          <v-btn icon v-bind="attrs" v-on="on" @click="save" :loading="loading">
            <v-icon>mdi-check</v-icon>
          </v-btn>
        </template>
        <span>保存分享集的变更</span>
      </v-tooltip>
    </template>
  </v-app-bar>
</template>
<script>
import { mapGetters, mapActions, mapState } from 'vuex'

export default {
  computed: {
    ...mapGetters(['isLoggedIn', 'userinfo', 'checkedLength']),
    ...mapState('collect', ['updatingData', 'loading']),
  },
  methods: {
    ...mapActions('collect', ['update', 'close']),
    async save() {
      // 组合数据
      const saveData = Object.assign({}, this.$store.state.collect.updatingInfo)
      saveData.pictures = this.$store.state.collect.updatingPictures.map(
        i => i.id
      )
      try {
        await this.update(saveData)
        this.$success('分享集已被修改')
        this.$store.commit('upload/SET_UPLOAD_SUCCESS_AFTER', null)
        this.$store.commit('collect/UPDATED', true)
      } catch (e) {
        this.$store.commit('collect/TOGGLE_LOADING')
      }
    },
    upload() {
      this.$store.commit('upload/SET_UPLOAD_SUCCESS_AFTER', 'collect/insert')
      this.$store.dispatch('upload/initUpload')
    },
    close() {
      this.$store.commit('collect/SET_EDITING', false)
      this.$store.commit('upload/SET_UPLOAD_SUCCESS_AFTER', null)
    },
    remove() {
      this.$store.dispatch('collect/remove')
    },
    removeReverse() {
      this.$store.dispatch('collect/removeReverse')
    },
  },
}
</script>
