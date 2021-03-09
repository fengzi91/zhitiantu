<template>
  <v-snackbar value="1" left bottom :timeout="-1" :color="type" absolute app>
    <template>
      {{ message.content }}
      <v-btn
        v-if="message.btn"
        rasied
        text
        class="btn"
        @click="$router.push(message.btn.link)"
      >
        {{ message.btn.text }}
      </v-btn>
      <v-btn text @click="close(id)">
        关闭
      </v-btn>
    </template>

    <v-btn text @click="close(id)" v-if="showClose">
      关闭
    </v-btn>
  </v-snackbar>
</template>
<script>
export default {
  name: 'MessageItem',
  props: {
    message: {
      default: null,
      type: Object,
    },
    timeout: {
      default: 0,
      type: Number,
    },
    id: {
      default: 0,
      type: Number,
    },
    showClose: {
      default: true,
      type: Boolean,
    },
  },
  computed: {
    type() {
      return this.message.type
    },
  },
  methods: {
    close(id) {
      this.$store.commit('message/REMOVE', id)
    },
  },
}
</script>
<style lang="scss" scoped>
.image {
  &::v-deep .v-snack__content {
    padding: 0;
  }
  .file-upload {
    position: relative;
    flex: 1;
    .v-progress-linear {
      position: absolute;
      border-bottom-right-radius: 4px;
      border-bottom-left-radius: 4px;
    }
    .content {
      display: flex;
      color: #333;
      .image-item {
        border-top-left-radius: 4px;
        border-bottom-left-radius: 4px;
      }
      .text {
        &.error {
          color: #f7f8fb;
        }
        max-width: 20rem;
        align-self: center;
        padding: 0 0.8rem;
        display: flex;
        flex-direction: column;
        flex: 1;
        height: 120px;
        justify-items: center;
        justify-content: center;
        align-content: center;
        .name {
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          flex: 0.5;
          line-height: 2;
        }
        .status-btn {
          display: flex;
          flex-direction: row;
          flex: 1;
          .status-bar {
            flex: 1;
            display: flex;
            flex-direction: column;
            justify-content: center;
          }
          .btn {
            align-self: flex-end;
            margin-bottom: 0.4rem;
          }
        }
      }
    }
  }
}
</style>
