const path = require('path')

module.exports = {
  configureWebpack: {
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './')
      }
    }
  },
  devServer: {
    port: 8080,
    host: '0.0.0.0',
    https: false,
    open: true,
    proxy: {
      '/api': {
        target: 'https://47.83.184.139',
        changeOrigin: true,
        secure: false
      }
    }
  }
}

