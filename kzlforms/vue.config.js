module.exports = {
  transpileDependencies: [
    'vuetify'
  ],
  devServer: {
    proxy: 'https://studyspark.kzlproject.xyz:80'
  },
  publicPath: './forms',
  assetsDir: './'
}
