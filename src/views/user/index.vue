<template>
  <v-container>
    <v-row justify="center">
      <v-col cols="8">
        <v-card flat color="gray" class="tw-mt-20" elevation="1">
          <v-card-text class="tw-flex tw-p-6">
            <v-avatar size="120" class="tw-shadow-sm">
              <v-img :src="userinfo.profile_photo_url"></v-img>
            </v-avatar>
            <v-sheet
              class="tw-flex tw-flex-col tw-justify-center tw-gap-4 tw-ml-4"
            >
              <span class="tw-text-2xl">{{ userinfo.name }}</span>
              <span>{{ userinfo.introduction }}</span>
            </v-sheet>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>
<script>
import { mapGetters } from 'vuex'
export default {
  computed: {
    ...mapGetters(['userinfo']),
  },
  mounted() {
    console.log(this.userinfo)
  },
}
</script>
