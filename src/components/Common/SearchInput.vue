<template>
  <div
    class="v-input v-input--hide-details v-input--dense theme--dark v-text-field v-text-field--single-line v-text-field--solo v-text-field--solo-inverted v-text-field--solo-flat v-text-field--is-booted v-text-field--enclosed"
    :class="isFocused || keyword ? 'v-input--is-focused' : ''"
    v-show="isShow"
  >
    <div class="v-input__control">
      <div class="v-input__slot">
        <div class="v-text-field__slot">
          <label
            for="input-search-1"
            class="v-label theme--dark"
            style="left: 0px; right: auto; position: absolute;"
            v-if="!isFocused && !keyword"
            >{{ placeHolder }}</label
          ><input
            id="input-search-1"
            type="text"
            @focusin="focusIn"
            @focusout="focusOut"
            v-model="keyword"
          />
        </div>
        <div class="v-input__append-inner">
          <div class="v-input__icon v-input__icon--append">
            <i
              aria-hidden="true"
              class="v-icon notranslate mdi theme--dark"
              :class="[
                keyword
                  ? 'mdi-close tw-cursor-pointer'
                  : isFocused
                  ? 'mdi-magnify'
                  : '',
                {
                  'primary--text': isFocused || keyword,
                },
              ]"
              @click="clear"
            ></i>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { searchPlaceholder, isShow } from '@/data/search'

export default {
  data: () => ({
    isFocused: false,
  }),
  computed: {
    keyword: {
      get() {
        return this.$store.state.search.keywords[this.$route.fullPath]
      },
      set(value) {
        this.$store.commit('search/SET_KEYWORD', {
          key: this.$route.fullPath,
          value,
        })
      },
    },
    placeHolder() {
      return searchPlaceholder(this.$route)
    },
    isShow() {
      return isShow(this.$route.name)
    },
  },
  methods: {
    focusIn() {
      this.isFocused = true
    },
    focusOut() {
      this.isFocused = false
    },
    clear() {
      this.keyword = undefined
    },
  },
}
</script>
