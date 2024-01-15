const express = require('express')
const router = express.Router()
const userHandler = require('../router_handler/user')
const { login, register } = require('../schema')
const expressJoi = require('@escook/express-joi')

// 登录注册api
router.post('/register', expressJoi(register), userHandler.register)
router.post('/login', expressJoi(login), userHandler.login)

router.post('/test', (req, res) => {
  console.log(req.body)
  res.send(req.body)
})
module.exports = router