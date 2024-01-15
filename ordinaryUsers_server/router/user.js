const express = require('express')
const router = express.Router()
const userHandler = require('../router_handler/user')
const { reg_login, reg_register } = require('../schema')
const expressJoi = require('@escook/express-joi')

// 登录注册api
router.post('/register', expressJoi(reg_register), userHandler.register)
router.post('/login', expressJoi(reg_login), userHandler.login)

// 班级api
router.get('/getClasses', userHandler.getClass)

// 测试接口
router.get('/get', userHandler.get)
router.post('/post', userHandler.post)

module.exports = router