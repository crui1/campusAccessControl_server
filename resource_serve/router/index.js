const express = require('express')
// start 文件上传处理插件
const multer = require('multer')
const storage = multer.diskStorage({
  // 存文件路径
  destination: 'uploads/images',
  // 文件名
  filename: function (req, file, cb) {
    cb(null, 'pic' + Date.now() + 'abs' + '.' + file.originalname.split('.')[1])
  }
})
const upload = multer({ storage })
// end

const router = express.Router()

router.post('/upload', upload.single('pic'), (req, res) => {
  let pic = 'http://192.168.43.24:8088/images/' + req.file.filename
  res.send({
    code: 200,
    message: '上传成功！',
    data: { pic }
  })
})

module.exports = router;