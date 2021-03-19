module.exports = {
  transpileDependencies: ['vuetify'],
  css: {
    loaderOptions: {
      postcss: {
        plugins: [require('tailwindcss'), require('autoprefixer')],
      },
    },
  },
  devServer: {
    host: 'vue.pictures.test',
    // proxy: {
    //   '/api': {
    //     target: 'http://pictures.test',
    //     pathRewrite: {
    //       '^/api': '/api',
    //     },
    //   },
    //   '/sanctum': {
    //     target: 'http://pictures.test',
    //     pathRewrite: {
    //       '^/sanctum': '/sanctum',
    //     },
    //   },
    // },
  },
}
