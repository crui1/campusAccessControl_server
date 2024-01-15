// 导入数据库模块
const db = require('../db/index');
// 导入密码加密模块
const bcrypt = require('bcryptjs');
// 用这个包来生成 Token 字符串
const jwt = require('jsonwebtoken');

// 导入配置文件 登录生成token处理用
const config = require('../config');

// 导入sql语句
const sqlText = require('../db/sql')

// 注册处理模块
// 接口参数
//     名称         是否必填
// 1. account       T
// 2. password      T
// 3. rePassword    T
// 4.registrationCode  T 注册码

// 5. email         F
// 6. pic          F
// 7.nickname F
exports.register = async (req, res) => {
  let userInfo = req.body
  if (userInfo.registrationCode !== config.regCode) return res.cc('注册码错误', 0)
  let sqlInsert = sqlText.add('admin')
  // 加密密码 注册账户
  userInfo.password = bcrypt.hashSync(userInfo.password, 10)
  // 删除repassword属性 / 删除多余的注册码属性
  delete userInfo.registrationCode
  delete userInfo.checkPass
  try {
    // 添加信息到数据库
    const [{ affectedRows }] = await db.query(sqlInsert, userInfo)
    if (affectedRows !== 1) return res.cc('注册失败,请稍后再试!')
    // 注册成功
    res.cc('注册成功', 200)
  } catch (error) {
    if (error.errno == 1062) return res.cc('已存在，请勿重复添加')
    res.cc('服务器查询错误')
  }

}

// 登录处理模块
// 接口参数
//     名称         是否必填
// 1. account       T
// 2. password      T
exports.login = async (req, res) => {
  try {
    let userInfo = req.body
    let sql = sqlText.reg_login
    const [rows] = await db.query(sql, userInfo.account)
    if (rows.length !== 1) return res.cc('用户不存在！')
    // 判断用户输入的登录密码是否和数据库中的密码一致
    if (!bcrypt.compareSync(userInfo.password, rows[0].password)) {
      return res.cc('密码错误！')
    }
    // 登陆成功 生成token字符串
    let userObj = { ...rows[0], password: null }
    // 生成 Token 字符串
    let tokenStr = jwt.sign(userObj, config.jwtSecretKey, { expiresIn: config.expires })
    res.send({
      code: 200,
      message: '登陆成功',
      token: 'Bearer ' + tokenStr
    })
  } catch (error) {
    res.cc('服务器查询错误')
  }
}