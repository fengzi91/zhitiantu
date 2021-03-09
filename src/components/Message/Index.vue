<template>
  <div class="messages">
    <template v-for="item in messages">
      <message-item
        :id="item.id"
        :key="item.id"
        :timeout="item.timeout"
        :message="item"
        :show-close="false"
      />
    </template>
  </div>
</template>
<script>
import MessageItem from './Item'
export default {
  name: 'Message',
  components: {
    MessageItem,
  },
  computed: {
    messages() {
      return this.$store.state.message.messages
    },
  },
  methods: {},
}
</script>
<style lang="scss" scoped>
.messages {
  position: fixed;
  left: 0;
  bottom: 0;
  display: flex;
  flex-direction: column;
  z-index: 299;
  .v-snack {
    position: relative;
    margin-bottom: 0.5rem;
  }
}
</style>
