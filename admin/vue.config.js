const { defineConfig } = require('@vue/cli-service')
// 定义外部CDN
const CDN = {
  externals: {
    vue: 'Vue',
    vuex: 'Vuex',
    'vue-router': 'VueRouter',
    axios: 'axios',
    'element-ui': 'ELEMENT',
    'js-md5': 'md5',
    'element-resize-detector': 'elementResizeDetectorMaker'
  },
  js: [
    'https://unpkg.com/vue@2.6.14/dist/vue.min.js',
    'https://unpkg.com/element-ui@2.15.12/lib/index.js',
    'https://unpkg.com/vue-router@3.6.5/dist/vue-router.min.js',
    'https://unpkg.com/vuex@3.6.2/dist/vuex.min.js',
    'https://unpkg.com/axios@1.2.0/dist/axios.min.js',
    'https://unpkg.com/js-md5@0.7.3/build/md5.min.js',
    'https://unpkg.com/element-resize-detector@1.2.4/dist/element-resize-detector.min.js',
  ],
  css: ['https://unpkg.com/element-ui@2.15.12/lib/theme-chalk/index.css']
}
const isProd = process.env.NODE_ENV === 'production'
module.exports = defineConfig({
  transpileDependencies: true,
  publicPath: isProd ? './' : '/',
  productionSourceMap: false,
  // 打包瘦身： 排除第三方包，使用cdn引入
  configureWebpack: {
    externals: isProd ? CDN.externals : {}
  },
  // 使用Webpack插件注入cdn连接
  chainWebpack: cfg => {
    cfg.plugin('html').tap((args) => {
      args[0].cdn = isProd ? CDN : { js: [], css: [] }
      return args
    })
  }
})
