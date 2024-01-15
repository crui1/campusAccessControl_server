const express = require('express')
const router = express.Router()
// 导入处理函数
const userinfoHandler = require('../router_handler/userInfo.js')
// 导入表单验证规则
const { up_email, up_password, up_pic } = require('../schema')
// 导入表单验证模块
const expressJoi = require('@escook/express-joi')
// 人脸文件上传处理插件
const multer = require('multer')
const storage = multer.diskStorage({
  // 存文件路径
  destination: 'uploads/face',
  // 文件名
  filename: function (req, file, cb) {
    console.log(file);
    cb(null, 'pic' + Date.now() + 'abs' + '.' + file.originalname.split('.')[1])
  }
})
const upload = multer({ storage })
// end


// TOD 获取用户信息
router.get('/getUserinfo', userinfoHandler.getUserinfo)

// TOD 更新用户邮箱
router.post('/upEmail', expressJoi(up_email), userinfoHandler.upEmail)

// TOD 更新密码
router.post('/upPassword', expressJoi(up_password), userinfoHandler.upPassword)

// TOD更新头像
router.post('/upHeadPortrait', expressJoi(up_pic), userinfoHandler.upPic)

// 人脸信息相关接口
// TOD: 添加人脸
router.post('/postFacePic', upload.single('pic'), userinfoHandler.postFacePic)
// TOD: 修改人脸
router.post('/alterFacePic', upload.single('pic'), userinfoHandler.alterFacePic)
// TOD: 查询人脸信息
router.get('/getFaceInfo', userinfoHandler.getFaceInfo)

// 向外共享路由
module.exports = router