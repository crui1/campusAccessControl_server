const express = require('express')
const router = express.Router()
const expressJoi = require('@escook/express-joi')
const { alterApp, postApp, cancelApp } = require('../schema')
const appHandler = require('../router_handler/application')

// TOD 查询申请记录
// 0: 待审核, 1:审核通过, 2:不通过
router.get('/getApp', (req, res) => {
  if (req.user.isTc) {
    appHandler.tcGetApp(req, res)
  } else {
    appHandler.stuGetApp(req, res)
  }
})

// TOD 申请审核 1 2
router.post('/alterApp', expressJoi(alterApp), appHandler.alterApp)


// TOD提交出行申请
// 0: 待审核, 1:审核通过, 2:不通过 3：撤销申请
router.post('/postApp', expressJoi(postApp), appHandler.postApp)

// 撤销申请
router.post('/cancelApp', expressJoi(cancelApp), appHandler.cancelApp)

// 向外共享路由
module.exports = router