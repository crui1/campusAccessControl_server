import Vue from 'vue'
import App from './App.vue'
import store from './store'
import router from './router'
import ELEMENT from 'element-ui'
// import './exportEl'
// 打包时根据运行环境动态导入element-ui组件样式
const isDev = process.env.NODE_ENV === 'development'
if (isDev) import('element-ui/lib/theme-chalk/index.css')
// import 'element-ui/lib/theme-chalk/index.css'
Vue.use(ELEMENT)
Vue.config.productionTip = false

// 软件启动时获取token信息
const localTk = localStorage.getItem('token')
if (localTk) store.state.token = localTk

new Vue({
  beforeCreate() {
    this.__proto__.$bus = this
  },
  render: h => h(App),
  router, //挂载路由规则
  store //挂载VueX状态管理 全局共享
}).$mount('#app')
