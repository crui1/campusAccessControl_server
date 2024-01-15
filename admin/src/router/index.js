import Vue from 'vue'
import store from '@/store'
import VueRouter from 'vue-router'

// 路由懒加载 前端按需请求加载组件
const Welcome = () => import('@/pages/welcome')
const Login = () => import('@/pages/welcome/login')
const Register = () => import('@/pages/welcome/register')

const Home = () => import('@/pages/home')
const Students = () => import('@/pages/home/students')
const Classes = () => import('@/pages/home/classes')
const Teachers = () => import('@/pages/home/teachers')

const UserInfo = () => import('@/pages/home/myinfo')

// VueRouter 重写push 和 replace 方法 解决 多次相同参数路由控制台报错
let originPush = VueRouter.prototype.push
let originReplace = VueRouter.prototype.replace
VueRouter.prototype.push = function (location, resolve, reject) {
  resolve = resolve || function () { }
  reject = reject || function () { }
  // call apply 改变上下文(this)指向 并且执行函数   传参方式不同: 前者使用,隔开 后者使用数组
  originPush.call(this, location, resolve, reject)
}
VueRouter.prototype.replace = function (location, resolve, reject) {
  resolve = resolve || function () { }
  reject = reject || function () { }
  // call apply 改变上下文(this)指向 并且执行函数   传参方式不同: 前者使用,隔开 后者使用数组
  originReplace.call(this, location, resolve, reject)
}
Vue.use(VueRouter)

const routes = [
  {
    path: '/', redirect: { name: 'classes' },
  },
  {
    name: 'welcome',
    path: '/welcome', redirect: '/welcome/login',
    component: Welcome,
    children: [
      { name: 'login', path: 'login', component: Login },
      { name: 'register', path: 'register', component: Register },
    ]
  },
  {
    name: 'home',
    path: '/home', redirect: { name: 'classes' },
    component: Home,
    children: [
      { name: 'students', path: 'students', component: Students },
      { name: 'teachers', path: 'teachers', component: Teachers },
      { name: 'classes', path: 'classes', component: Classes },
      { name: 'myinfo', path: 'myinfo', component: UserInfo }
    ]
  },
]
const router = new VueRouter({
  mode: 'hash',//不带#号history
  routes
})

// 全局前置导航守卫
const ex = ['login', 'register']
router.beforeEach((to, from, next) => {
  // 登录和注册页
  // console.log('路由器前置导航守卫@@to', to.name)
  // console.log('路由器前置导航守卫@@from', from.fullPath)
  const tk = store.state.token
  // 去登录页必须没有登录token
  if (to.name == 'login' && tk) {
    // 有token去登录页重定向到home
    // next({ name: 'classes', replace: true })
    next(false)
  } else if (!ex.includes(to.name) && !tk) {
    // 没有登录token不能访问其他页面，重定向到登录页面
    next({ name: 'login', replace: true })
  } else {
    next()
  }

})
export default router
