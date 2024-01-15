import axios from "axios"
import store from "@/store"
import router from "@/router"
import md5 from "js-md5"
import { Loading, Message } from 'element-ui'
const conf = require("../../config")
const http = axios.create({
  baseURL: 'http://' + conf.serveUrl, // 后期修改实际地址
  timeout: 5000
})

// 设置拦截器
// 请求拦截器
let loading = null
http.interceptors.request.use(config => {
  // 配置
  // 设置提交表单数据类型
  if (config.method.toLowerCase() == 'post') config.headers['Content-Type'] = 'application/x-www-form-urlencoded'
  // 加密密码
  if (config.data?.password) {
    config.data.password = md5(config.data.password)
    if (config.data.checkPass) config.data.checkPass = md5(config.data.checkPass)
  }
  if (config.data?.oldPwd) {
    config.data.oldPwd = md5(config.data.oldPwd)
    config.data.newPwd = md5(config.data.newPwd)
    config.data.checkPass = md5(config.data.checkPass)
  }
  // 请求头添加token
  if (store.state.token) config.headers.Authorization = store.state.token
  loading = Loading.service({
    lock: true,
    text: '努力加载中...',
    spinner: 'el-icon-loading',
    background: 'rgba(0, 0, 0, 0.7)'
  })
  // console.log(config.data)
  return config
})

// 响应拦截器
let wx = 0
http.interceptors.response.use(res => {
  if (res.data.code == 403) {
    if (!wx) {
      Message({
        message: "登录信息无效，请重新登录",
        type: "error",
        center: true,
        duration: 3000
      })
      store.commit("CHANGETOKEN", null)
      localStorage.removeItem('token')
      router.replace({ name: 'login' })
      // location.reload()
      wx = 1
    }
  }
  loading.close()
  return res.data
}, err => {
  Message({
    message: err.message,
    type: "error",
    center: true,
    duration: 3000
  })
  loading.close()
  return err
})

export default http