<template>
  <div>
    <input
      type="file"
      ref="upload-input"
      @change="selectHandler"
      multiple
      style="width:0; height:0; opacity: 0;"
    />
    <div
      class="tw-fixed tw-w-full tw-transition-all tw-duration-200"
      style="right: 1rem; bottom: 1rem;"
      v-show="show"
    >
      <v-card class="tw-w-full tw-max-w-lg ml-auto tw-max-h-screen">
        <v-card-title
          class="indigo lighten-1"
          :class="!showDetail ? 'rounded' : ''"
        >
          <span class="title white--text" v-if="totalFiles <= 0">上传图片</span>
          <div class="tw-flex tw-flex-col" v-else>
            <span class="title white--text"
              >共
              <i
                class="tw-cursor-pointer tw-not-italic"
                @click="filterList(null)"
                >{{ totalFiles }}</i
              >
              张图片</span
            >
            <span class="white--text subtitle-2"
              >正在上传
              <i
                class="tw-cursor-pointer tw-not-italic"
                @click="filterList('start')"
                >{{ uploadingCount }}</i
              >
              张， 上传成功
              <i
                class="tw-cursor-pointer tw-not-italic"
                @click="filterList('complete')"
                >{{ completedCount }}</i
              >
              张，上传失败
              <i
                class="tw-cursor-pointer tw-not-italic"
                @click="filterList('error')"
                >{{ errorCount }}</i
              >
              张</span
            >
          </div>

          <v-spacer></v-spacer>

          <v-btn dark icon @click="showDetail = !showDetail">
            <v-icon
              v-text="showDetail ? 'mdi-chevron-down' : 'mdi-chevron-up'"
            ></v-icon>
          </v-btn>

          <v-btn dark icon @click="$refs['upload-input'].click()">
            <v-icon>mdi-plus</v-icon>
          </v-btn>

          <v-btn dark icon @click="show = false">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-card-title>
        <v-card-text
          :style="`max-height: ${maxHeight}px;`"
          style="overflow-y: auto;"
          v-show="showDetail"
          ref="dropbox"
        >
          <template
            v-if="
              (showType === null && totalFiles <= 0) ||
                (showType === 'complete' && completedCount <= 0) ||
                (showType === 'start' && uploadingCount <= 0)
            "
          >
            <div
              class="tw-flex tw-justify-center tw-items-center"
              style="min-height: 200px"
            >
              <span>暂无正在上传的图片 点击</span>
              <v-btn
                text
                link
                class="tw-mx-1"
                @click="$refs['upload-input'].click()"
                >上传</v-btn
              >
              <span>或者将图片拖拽到此处</span>
            </div>
          </template>
          <template v-if="showType === 'error' && errorCount <= 0">
            <div
              class="tw-flex tw-justify-center tw-items-center"
              style="min-height: 200px"
            >
              <span>没有上传失败的项目，</span>
              <v-btn text link class="tw-mx-1" @click="showType = null"
                >点击这里</v-btn
              >
              <span>查看全部</span>
            </div>
          </template>
          <v-slide-y-transition
            class="py-0"
            group
            tag="v-list"
            style="overflow-y: auto;"
          >
            <template v-for="(item, index) in uploadData">
              <v-list-item
                v-if="
                  !item.deleted &&
                    (showType ? () => item.upload === showType : true)
                "
                :key="`upload-${index}`"
                class="my-2"
              >
                <v-list-item-avatar
                  tile
                  width="80"
                  max-width="80"
                  height="80"
                  max-height="80"
                >
                  <v-img
                    :src="item.url"
                    max-height="120"
                    width="120"
                    height="120"
                  />
                </v-list-item-avatar>
                <v-list-item-content>
                  <div class="tw-flex tw-justify-center tw-flex-col tw-h-full">
                    <div class="tw-mb-1 tw-text-sm tw-flex tw-items-center">
                      {{ item.title || item.name }}
                      <v-fade-transition>
                        <v-icon
                          size="18"
                          v-if="
                            item.upload === 'complete' ||
                              item.upload === 'error'
                          "
                          v-text="
                            item.upload === 'complete'
                              ? 'mdi-check'
                              : 'mdi-close'
                          "
                          :color="
                            item.upload === 'complete' ? 'success' : 'error'
                          "
                        >
                        </v-icon>
                      </v-fade-transition>
                    </div>
                    <div class="tw-mb-1 tw-text-sm">
                      {{ item.sizeText }}
                    </div>
                    <v-progress-linear
                      class="tw-content-end"
                      :indeterminate="
                        item.upload !== 'complete' && item.upload !== 'error'
                      "
                      :color="item.upload === 'error' ? 'error' : 'primary'"
                      :value="
                        item.upload === 'complete' || item.upload === 'error'
                          ? 100
                          : 0
                      "
                    ></v-progress-linear>
                  </div>
                </v-list-item-content>
                <v-list-item-action>
                  <v-btn
                    icon
                    @click="retryUploadFile(item.key)"
                    v-if="item.upload === 'error'"
                  >
                    <v-icon color="grey lighten-1">mdi-refresh</v-icon>
                  </v-btn>
                  <v-btn
                    icon
                    @click="deleteFile(item.key)"
                    :loading="item.loading"
                  >
                    <v-icon color="grey lighten-1"
                      >mdi-trash-can-outline</v-icon
                    >
                  </v-btn>
                </v-list-item-action>
              </v-list-item>
            </template>
          </v-slide-y-transition>
        </v-card-text>
      </v-card>
    </div>
  </div>
</template>
<script>
export default {
  computed: {
    show: {
      get() {
        return this.$store.state.upload.show
      },
      set(show) {
        this.$store.commit('upload/SHOW', show)
      },
    },
    maxHeight() {
      return this.$vuetify.breakpoint.height - 300 > 400
        ? 400
        : this.$vuetify.breakpoint.height - 300
    },
    uploadData() {
      switch (typeof this.showType) {
        case 'object':
          return this.$store.state.upload.files.filter(i => !i.deleted)
        case 'string':
          return this.$store.state.upload.files.filter(
            i => !i.delted && i.upload === this.showType
          )
      }
      return this.$store.state.upload.files
    },
    totalFiles() {
      return this.$store.state.upload.files.filter(i => !i.deleted).length
    },
    uploadingCount() {
      return this.$store.state.upload.files.filter(
        i => !i.deleted && i.upload === 'start'
      ).length
    },
    completedCount() {
      return this.$store.state.upload.files.filter(
        i => !i.deleted && i.upload === 'complete'
      ).length
    },
    errorCount() {
      return this.$store.state.upload.files.filter(
        i => !i.deleted && i.upload === 'error'
      ).length
    },
  },
  data: () => ({
    uploading: false,
    showDetail: true,
    showType: null,
  }),
  watch: {
    '$store.state.upload.showSelect'(n) {
      if (n > 0) {
        this.$refs['upload-input'].click()
      }
    },
  },
  mounted() {
    const dropbox = this.$refs['dropbox']
    dropbox.addEventListener('dragenter', this.dragenter, false)
    dropbox.addEventListener('dragover', this.dragover, false)
    dropbox.addEventListener('drop', this.drop, false)
  },
  methods: {
    drop(e) {
      e.stopPropagation()
      e.preventDefault()

      var dt = e.dataTransfer
      var files = dt.files

      this.uploadHandler(files)
    },
    dragenter(e) {
      e.stopPropagation()
      e.preventDefault()
    },
    dragover(e) {
      e.stopPropagation()
      e.preventDefault()
    },
    selectHandler(e) {
      const selectedFiles = e.target.files
      this.uploadHandler(selectedFiles)
      this.$store.commit('upload/SET_SHOW_SELECT', 0)
    },
    uploadHandler(files) {
      if (files.length > 0) {
        for (let i = 0; i < files.length; i++) {
          const img = new Image()
          img.src = window.URL.createObjectURL(files[i])
          this.$store.dispatch('upload/add', {
            file: files[i],
            url: img.src,
          })
        }
        this.show = true
        this.showDetail = true
      }
    },
    deleteFile(fileKey) {
      this.$store.commit('upload/UPDATE_FILE_STATE', {
        fileKey,
        key: 'loading',
        value: true,
      })
      setTimeout(() => {
        this.$store.commit('upload/UPDATE_FILE_STATE', {
          fileKey,
          key: 'deleted',
          value: true,
        })
      }, 3000)
    },
    retryUploadFile(fileKey) {
      this.$store.dispatch('upload/upload', fileKey)
    },
    filterList(type) {
      this.showType = type
    },
  },
}
</script>
