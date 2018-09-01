module.exports = {
  css: {
    loaderOptions: {
      postcss: {
        config: {
          path: '.'
        }
      }
    }
  },
  chainWebpack: config => {
    config.module
      .rule('js')
      .use('babel-loader')
      .loader('babel-loader')
      .tap((options = {}) => {
        options.exclude = /3rd/
        return options
      })
    config.module
      .rule('eslint')
      .exclude
      .add(/src\/3rd/)
  }

}
