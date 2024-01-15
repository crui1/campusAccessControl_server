const db = require('../db/index')
const sqlText = require('../db/sql')
// 导入密码加密模块
const bcrypt = require('bcryptjs');

exports.getUserInfo = async (req, res) => {
  try {
    let sql = sqlText.getInfo
    console.log(req.user);
    const [rows] = await db.query(sql, req.user.id)
    if (rows.length !== 1) return res.cc('信息错误')
    console.log(4545);
    res.send({
      code: 200,
      message: "获取成功",
      data: rows[0]
    })
  } catch (error) {
    console.log(error);
    res.cc('服务器查询错误')
  }
}

// 接口参数
// 更新头像链接
// 名称 是否必填
// 1. pic   T

// 更新基本信息
// 2. email T
exports.updateInfo = async (req, res) => {
  let update = sqlText.update('admin')
  try {
    const [{ affectedRows: ars }] = await db.query(update, [req.body, req.user.id])
    if (ars != 1) return res.cc('更新失败')
    res.cc('更新成功', 200)
  } catch (error) {
    res.cc('服务器查询错误')
  }
}


// 更新密码
// 参数
// 1. odlPwd T
// 2. newPwd T
// 3. rePwd T
exports.upPassword = async (req, res) => {
  // 定义根据 id 更新用户数据的 SQL 语句
  let queryPwd = sqlText.selPwd
  let upPwd = sqlText.update('admin')
  try {
    let [result] = await db.query(queryPwd, req.user.id)
    if (result.length == 0) return res.cc('无此用户')
    // 比较密码旧密码正确否
    if (!bcrypt.compareSync(req.body.oldPwd, result[0].password)) {
      return res.cc('原密码错误！')
    }
    // 正确 加密
    let password = bcrypt.hashSync(req.body.newPwd, 10)
    const [{ affectedRows: ars }] = await db.query(upPwd, [{ password }, req.user.id])
    if (ars == 0) return res.cc('修改失败')
    res.cc('修改成功', 200)
  } catch (error) {
    if (error.errno == 1054) return res.cc('提交参数错误')
    res.cc('服务器查询错误')
  }
}