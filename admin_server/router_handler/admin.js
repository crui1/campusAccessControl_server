const db = require('../db/index')
const sqlText = require('../db/sql')
// 导入密码加密模块
const bcrypt = require('bcryptjs');
exports.get = (table) => {
  return async (req, res) => {
    try {
      let sql = sqlText.getAllAccount(table)
      if (table == 'class') {
        sql = sqlText.getClass()
        if (req.query.keyword && req.query.field) sql = sqlText.getClass(`where c.${req.query.field} like "%${req.query.keyword}%"`)
      }
      if (table == 'students' && req.query.classID) {
        if (req.query.classID != 0) {
          sql = sqlText.getAllAccount(table, `where u.classID=${req.query.classID}`)
        }
        else if (req.query.classID == 0) {
          sql = sqlText.getAllAccount(table, `where u.classID is null`)
        }
      }
      if (table == 'teachers' && req.query.keyword) {
        sql = sqlText.getAllAccount(table, `where u.name like "%${req.query.keyword}%"`)
      }
      // 查询数据
      const [rows] = await db.query(sql)
      res.send({
        code: 200,
        message: '获取成功',
        total: rows.length,
        data: rows
      })
    } catch (error) {
      console.log(error)
      res.cc('服务器查询错误')
    }
  }
}

exports.add = (table) => {
  return async (req, res) => {
    try {
      // 添加账号 先加密 密码
      if (table !== 'class') {
        // 加密密码 注册账户
        req.body.password = bcrypt.hashSync(req.body.password, 10)
        delete req.body.checkPass
      }
      // 先添加信息
      let sql = sqlText.add(table)
      const [{ affectedRows }] = await db.query(sql, req.body)
      if (affectedRows != 1) return res.cc('添加失败!')

      // 添加教师 传了班级信息
      if (req.body.classID && req.body.account.length == 8) {
        // 同时设置班级表的班主任
        let sql = sqlText.update('class')
        const [{ affectedRows: ar }] = await db.query(sql, [{ tcID: req.body.account }, req.body.classID])
        if (ar !== 1) return res.cc('设置班主任失败(1)!')
      }

      //添加班级 同时设置教师
      if (req.body.tcID) {
        let sql = sqlText.update('teachers', 'where account=?')
        const [{ affectedRows: ar }] = await db.query(sql, [{ classID: req.body.id }, req.body.tcID])
        console.log(ar)
        if (ar !== 1) return res.cc('设置班主任失败(2)!')
      }
      res.cc('添加成功', 200)
    } catch (error) {
      console.log(error);
      if (error.errno == 1062) return res.cc('已存在，请勿重复添加')
      if (error.errno == 1054) return res.cc('提交参数错误')
      res.cc('服务器查询错误')
    }
  }
}

exports.delete = (table) => {
  return async (req, res) => {
    try {
      let sql = sqlText.delete(table)
      const [{ affectedRows }] = await db.query(sql, req.body.id)
      if (affectedRows == 0) return res.cc('删除失败，不存在相关数据')
      res.cc('删除成功', 200)
    } catch (error) {
      console.log(error)
      res.cc('服务器查询错误')
    }
  }
}

exports.update = (table) => {
  return async (req, res) => {
    try {
      let sql = sqlText.update(table)
      const [{ affectedRows }] = await db.query(sql, [req.body, req.body.id])
      if (affectedRows == 0) return res.cc('修改失败，不存在相关数据')
      res.cc('更新成功', 200)
    } catch (error) {
      console.log(error);
      if (error.errno == 1054) return res.cc('提交参数错误')
      res.cc('服务器查询错误')
    }
  }
}
// 设置班级 的班主任
// id班级号 T
// tcID 新班主任 工号 T
// originalTcID 原班主任工号 F
exports.updateClass = async (req, res) => {
  // 如果原来有班主任 
  // 先清空原班主任账户的班级号 
  // 再设置新班主任工号的班级id
  try {
    if (req.body.originTcID) {
      // 清空原班主任管理的班当前级
      let sql = sqlText.update('teachers', 'where account=?')
      let [{ affectedRows }] = await db.query(sql, [{ classID: null }, req.body.originTcID])
      if (affectedRows == 0) return res.cc('修改失败，无相关教师账户数据')
      delete req.body.originTcID
    }
    // 设置新班主任工号的班级ID
    let up2 = sqlText.update('teachers', 'where account=?')
    let [{ affectedRows: ars }] = await db.query(up2, [{ classID: req.body.id }, req.body.tcID])
    if (ars == 0) return res.cc('修改失败，无相关教师账户数据')
    console.log(ars)
    // 设置当前班级新班主任
    let sql3 = sqlText.update('class')
    let [{ affectedRows: ar }] = await db.query(sql3, [req.body, req.body.id])
    console.log(ar)
    if (ar == 0) return res.cc('修改失败，无相关班级数据')
    res.cc('修改成功', 200)
  } catch (error) {
    console.log(error)
    if (error.errno == 1054) return res.cc('提交参数错误')
    res.cc('服务器查询错误')
  }
}

// 取消现班级有班主任
// 参数
// id T 
// tcID  T
exports.cancelHeadmaster = async (req, res) => {
  // 置空教师信息下的班级ID
  let sql = sqlText.update('teachers', 'where account=?')
  let [{ affectedRows }] = await db.query(sql, [{ classID: null }, req.body.tcID])
  if (affectedRows == 0) return res.cc('修改失败，无相关教师账户数据')

  // 置空班级信息下的教师ID
  let sql2 = sqlText.update('class')
  let [{ affectedRows: ar }] = await db.query(sql2, [{ tcID: null }, req.body.id])
  console.log(ar)
  if (ar == 0) return res.cc('修改失败，无相关班级数据')
  res.cc('修改成功', 200)
}