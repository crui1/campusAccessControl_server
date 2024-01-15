// 导入express服务器包
const express = require('express')
// 导入并且配置跨域cors中间件
const cors = require('cors')
// 导入路由模块
const reg_login = require("./router/user");
const userInfo = require('./router/userInfo');
const admin = require('./router/admin');
// 导入joi 定义表单验证模式
const Joi = require('joi');
// 导入jwt字符串解析模块
const expressJwt = require('express-jwt');
// 导入全局配置
const config = require('./config')
const history = require('connect-history-api-fallback');


// 创建服务器实例
const app = express()

// 注册全局跨域请求处理中间件
app.use(cors())
// 解决前端非hash路由路径问题
app.use(history())
// 部署前端静态页面
// app.use(express.static(__dirname + '/public'))

// 注册 解析application/x-www-form-urlencoded格式的表单数据的中间件 post方法的
app.use(express.urlencoded({ extended: false }))
app.use((req, res, next) => {
    console.log(req.body);
    console.log(req.query);
    next()
})
// 注册 响应消息的 中间件函数 挂载一个发消息函数到res.cc
app.use((req, res, next) => {
    // status = 200 为成功； status = 400 为失败； 默认将 status 的值设置为 1，方便处理失败的情况
    res.cc = (err, status = 400) => {
        let message = err.message || err
        res.send({
            code: status,
            message
        })
    }
    next()
})

// 注册全局jwt字符串（token验证）解析中间件,自动挂载到req.auth unless排除path
app.use(expressJwt({ secret: config.jwtSecretKey })
    .unless({ path: [/^\/api\//, /^\/$/] }))

// 中间件在路由之前注册
//注册 用户路由模块,加前缀
app.use('/api', reg_login)
app.use('/my', userInfo)
app.use('/admin', admin)


// 错误级别中间件放最后
app.use((err, req, res, next) => {
    // Joi 表单数据校验失败
    if (err instanceof Joi.ValidationError) {
        return res.cc(err.message)
    }

    // 捕获jwt（）token身份认证失败的错误
    if (err.name === 'UnauthorizedError') return res.cc('身份认证失败！', 403)

    // 未知错误
    res.cc('服务器未知错误', err)
    console.log(err);
    next()
})

// 配置监听端口
app.listen(8082, (err) => {
    if (err) return
    console.log('administrator server running on http://localhost:8082')
})