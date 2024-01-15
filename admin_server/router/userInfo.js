const express = require('express')
const router = express.Router()
const expressJoi = require('@escook/express-joi')
const { up_email, up_password, up_pic, up_nickname } = require('../schema/index')
const Handler = require('../router_handler/userInfo')

router.get('/getUserInfo', Handler.getUserInfo)
router.post('/upEmail', expressJoi(up_email), Handler.updateInfo)
router.post('/upNickname', expressJoi(up_nickname), Handler.updateInfo)
router.post('/upPic', expressJoi(up_pic), Handler.updateInfo)
router.post('/upPwd', expressJoi(up_password), Handler.upPassword)

module.exports = router