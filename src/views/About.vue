<template>
  <v-container :class="{ 'fill-height': fillHeight }">
    <v-row class="text-center" align="center" justify="center">
      <v-col cols="12" sm="8" md="4">
        <v-card class="elevation-12">
          <v-toolbar color="primary" dark flat>
            <v-toolbar-title>Login form</v-toolbar-title>
            <v-spacer></v-spacer>
            <v-tooltip bottom>
              <template v-slot:activator="{ on }">
                <v-btn :to="{ name: 'Home' }" icon large v-on="on">
                  <v-icon>mdi-home</v-icon>
                </v-btn>
              </template>
              <span>Source</span>
            </v-tooltip>
          </v-toolbar>
          <v-card-text>
            这是一个需要登录才可以浏览的页面
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="primary" @click="$router.go(-1)">返回</v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>
<script>
import { mapGetters } from 'vuex'
export default {
  computed: {
    ...mapGetters(['fillHeight']),
  },
}
</script>
