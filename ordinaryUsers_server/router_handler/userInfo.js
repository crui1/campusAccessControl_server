// 导入数据库模块
const db = require('../db/index');
// 导入密码加密模块
const bcrypt = require('bcryptjs');
// 导入查询语句模块
const sqlText = require('../db/sql');

// 获取当前用户信息 
// 参数 无
exports.getUserinfo = (req, res) => {
  // 判断是教师还是学生
  console.log(req.user)
  let sql = sqlText.sql.getInfo('students', 'where u.id=?')
  if (req.user.isTc) {
    sql = sqlText.sql.getInfo('teachers', 'where u.id=?')
  }
  // 注意：为了防止用户的密码泄露，需要排除 password 字段
  // 注意：req 对象上的 user 属性，是 Token 解析成功，express-jwt 中间件帮我们挂载上去的
  db.query(sql, req.user.id, (err, results) => {
    // 1. 执行 SQL 语句失败
    if (err) return res.cc(err)

    // 2. 执行 SQL 语句成功，但是查询到的数据条数不等于 1
    if (results.length !== 1) return res.cc('获取用户信息失败！')
    // 如果存在班级属性 查询所在班级名
    results[0].isTc = req.user.isTc
    console.log(results[0]);
    res.send({
      code: 200,
      message: '获取用户基本信息成功！',
      data: results[0],
    })
    // results[0].isTc = isTc
    // if (req.user.classID) {
    //   let sql = `select name from class where id=?`
    //   db.query(sql, req.user.classID, (err, rest) => {
    //     // 1. 执行 SQL 语句失败
    //     if (err) return res.cc(err)
    //     // // 2. 执行 SQL 语句成功，但是查询到的数据条数不等于 1
    //     if (rest.length == 1) results[0].class = rest[0].name


    //     // 3. 将用户信息响应给客户端
    //     res.send({
    //       code: 200,
    //       message: '获取用户基本信息成功！',
    //       data: results[0],
    //     })
    //   })
    // } else {

    // }
  })
}

// 更新头像链接
// 接口参数
// 名称 是否必填
// 1. pic   T
exports.upPic = (req, res) => {
  let update = sqlText.sql.update('students')
  if (req.user.isTc) update = sqlText.sql.update('teachers')
  db.query(update, [req.body, req.user.id], (err, results) => {
    // 执行 SQL 语句失败
    if (err) return res.cc(err)

    //执行语句影响行数不位1
    if (results.affectedRows !== 1) return res.cc('更新头像失败')

    res.cc('头像更新成功', 200)
  })
}

// 更新邮箱信息
// 接口参数
// 名称 是否必填
// 1. email   T
exports.upEmail = (req, res) => {
  let update = sqlText.sql.update('students')
  if (req.user.isTc) update = sqlText.sql.update('teachers')
  db.query(update, [req.body, req.user.id], (err, results) => {
    // 执行 SQL 语句失败
    if (err) return res.cc(err)

    // 执行 SQL 语句成功，但影响行数不为 1
    if (results.affectedRows !== 1) return res.cc('修改用户基本信息失败！')

    // 修改用户信息成功
    res.cc('邮箱更新成功！', 200)
  })

}

// 更新密码
// 参数
// 1. odlPwd T
// 2. newPwd T
// 3. rePwd T
exports.upPassword = (req, res) => {
  // 定义根据 id 更新用户数据的 SQL 语句
  let sql = sqlText.sql.selPwd('students')
  let up = sqlText.sql.update('students')
  if (req.user.isTc) {
    sql = sqlText.sql.selPwd('teachers')
    up = sqlText.sql.update('teachers')
  }
  db.query(sql, req.user.id, (err, results) => {
    // 执行 SQL 语句失败
    if (err) return res.cc(err)

    // 检查指定 id 的用户是否存在
    if (results.length !== 1) return res.cc('用户不存在！')

    // 比较密码旧密码正确否
    if (!bcrypt.compareSync(req.body.oldPwd, results[0].password)) {
      return res.cc('原密码错误！')
    }
    // 旧密码正确 更新密码
    let newPwd = bcrypt.hashSync(req.body.newPwd, 10)
    db.query(up, [{ password: newPwd }, req.user.id], (err, results) => {
      // 执行 SQL 语句失败
      if (err) return res.cc(err)

      //执行语句影响行数不位1
      if (results.affectedRows !== 1) return res.cc('更新密码失败')

      res.cc('密码更新成功', 200)
    })
  })
}

// 添加人脸信息
// 1. face_pic T file
exports.postFacePic = (req, res) => {
  console.log(req.file)
  let sql = sqlText.sql.postFaceInfo
  db.query(sql, { id: req.user.account, features: 'ok' }, (err, result) => {
    if (err) return res.cc(err)
    console.log(result);
    if (result.affectedRows !== 1) res.cc('人脸添加失败')
    res.cc('人脸添加成功', 200)
  })
}
// 修改人脸信息
// 2. face_pic T file
exports.alterFacePic = (req, res) => {
  console.log(req.file)
  let sql = sqlText.sql.updateFaceInfo
  db.query(sql, [{ features: '修改人脸特征字段信息' }, req.user.account], (err, result) => {
    if (err) return res.cc(err)
    if (result.affectedRows !== 1) return res.cc('修改失败,请稍后再试')
    res.cc('修改成功', 200)
  })
}
// 人脸查询 id,feature
// 无参数
exports.getFaceInfo = (req, res) => {
  let sql = sqlText.sql.getFaceInfo
  db.query(sql, req.user.account, (err, results) => {
    if (err) return res.cc(err)
    if (results.length !== 1) return res.cc('未查询到人脸信息', 404)
    res.cc('查询到一条人脸信息', 200)
  })
}

