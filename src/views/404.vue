<template>
  <v-container class="fill-height">
    <v-row justify="center" align="center">
      <v-col cols="12" md="8" lg="4">
        <v-alert
          border="right"
          colored-border
          prominent
          type="error"
          elevation="2"
        >
          <h2>404 Not Found</h2>
          未找到您要浏览的页面
          <v-btn @click="$router.go(-1)" text link>返回</v-btn>
        </v-alert>
      </v-col>
    </v-row>
  </v-container>
</template>
