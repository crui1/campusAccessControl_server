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

const { SUCCESSSTATE } = require('../constant')

// 注册处理模块
// 接口参数
//     名称         是否必填
// 1. account       T
// 2. password      T
// 3. rePassword    T
// 4. name          T
// 5. isTc          T

// 5. classID       F
// 6. email         F
// 7. pict          F
exports.register = (req, res) => {
    let userInfo = req.body
    console.log(userInfo);
    // 查询用户名是否被占用,默认查询学生表
    let sql = sqlText.sql.reg_login('students')
    let sqlInsert = sqlText.admin.add('students')
    if (userInfo.isTc) {
        sql = sqlText.sql.reg_login('teachers')
        sqlInsert = sqlText.admin.add('teachers')
    }
    db.query(sql, userInfo.account, (err, result) => {
        // 执行sql失败
        if (err) return res.cc(err)

        // 被占用
        if (result.length > 0) return res.cc('账号已存在,请勿重复注册')

        // 未占用 加密密码 注册账户
        userInfo.password = bcrypt.hashSync(userInfo.password, 10)

        // 删除repassword属性 / 删除多余的isTc属性
        delete userInfo.isTc
        delete userInfo.rePassword
        // 添加信息到数据库
        db.query(sqlInsert, userInfo, (err, result) => {
            // 是否成功执行sql
            if (err) return res.cc(err)
            // 判断影响行数是否位1
            if (result.affectedRows !== 1) return res.cc('注册失败,请稍后再试!')
            // 注册成功
            res.cc('注册成功', SUCCESSSTATE)
        })
    })
}

// 登录处理模块
// 接口参数
//     名称         是否必填
// 1. account       T
// 2. password      T
// 3. isTc          T                 
exports.login = (req, res) => {
    let userInfo = req.body
    let sql = sqlText.sql.reg_login('students')
    if (userInfo.isTc) sql = sqlText.sql.reg_login('teachers')
    db.query(sql, userInfo.account, (err, result) => {
        // 执行 SQL 语句失败
        if (err) return res.cc(err)
        // 执行 SQL 语句成功，但是查询到数据条数不等于 1
        if (result.length !== 1) return res.cc('用户不存在！')
        // 判断用户输入的登录密码是否和数据库中的密码一致
        if (!bcrypt.compareSync(userInfo.password, result[0].password)) {
            return res.cc('密码错误！')
        }

        // 登陆成功 生成token字符串
        let userObj = { ...result[0], password: null, isTc: userInfo.isTc }
        // 生成 Token 字符串
        let tokenStr = jwt.sign(userObj, config.jwtSecretKey, { expiresIn: config.expires })

        res.send({
            code: SUCCESSSTATE,
            message: '登陆成功',
            token: 'Bearer ' + tokenStr
        })
    })
}

// 班级表信息查询接口
exports.getClass = (req, res) => {
    let sql = sqlText.sql.getClass
    db.query(sql, (err, result) => {
        if (err) return res.cc(err)
        res.send({
            code: 200,
            message: '获取成功',
            data: result
        })
    })
}



// 测试接口处理
exports.get = (req, res) => {
    console.log(req.query)
    res.send({ code: SUCCESSSTATE, message: 'get请求成功', data: req.query })
}
exports.post = (req, res) => {
    console.log(req.body)
    res.send({ code: SUCCESSSTATE, message: 'post请求成功', data: req.body })
}