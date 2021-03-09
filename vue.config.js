module.exports = {
  transpileDependencies: ['vuetify'],
  css: {
    loaderOptions: {
      postcss: {
        plugins: [require('tailwindcss'), require('autoprefixer')],
      },
    },
  },
}
