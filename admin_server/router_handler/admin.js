const db = require('../db/index')
const sqlText = require('../db/sql')
// 导入密码加密模块
const bcrypt = require('bcryptjs');
exports.get = (table) => {
  return async (req, res) => {
    try {
      let sql = null;
      if (table == 'class') {
        sql = sqlText.queryClass()
        if (req.query.keyword && req.query.field) sql = sqlText.queryClass(`where c.${req.query.field} like "%${req.query.keyword}%"`)
      }
      if (table == 'students') {
        sql = sqlText.queryStudentAccounts()
        if (req.query.classID) {
          if (req.query.classID != 0) {
            sql = sqlText.queryStudentAccounts(`where u.classID=${req.query.classID}`)
          }
          else if (req.query.classID == 0) {
            sql = sqlText.queryStudentAccounts(`where u.classID is null`)
          }
        }
      }
      if (table == 'teachers') {
        sql = sqlText.queryTeacherAccounts()
        if (req.query.keyword) {
          sql = sqlText.queryTeacherAccounts(`where u.name like "%${req.query.keyword}%"`)
        }
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

async function addSqlAffair(table, data, send) {
  // 有附加信息时
  // 班级表 || 教师表 之间有个映射表
  // 使用事务
  let class_id = data.classID || data.id
  let teacher_id = data.tcID || data.account
  console.log(class_id + "----" + teacher_id)
  // 删除多余的信息
  data.classID && delete data.classID
  data.tcID && delete data.tcID
  let conn = await db.getConnection();
  try {  // 开启事务
    await conn.beginTransaction();
    // 添加基本信息
    await conn.query(sqlText.add(table), data)
    console.log("66666666")
    // 添加映射信息, 同时传入这两个才执行这个任务
    if (class_id && teacher_id) await conn.query(sqlText.add("teacher_class_map"), [{ is_master: 1, teacher_id, class_id }]);

    await conn.commit()
    send("添加成功", 200)
  } catch (e) {
    console.log(e)
    conn.rollback()
    send("添加失败")
  } finally {
    conn.release()
  }
}

exports.add = (table) => {
  return async (req, res) => {
    try {
      // 添加账号 先加密 密码
      if (table != 'class') {
        // 加密密码 注册账户
        req.body.password = bcrypt.hashSync(req.body.password, 10)
        delete req.body.checkPass
      }
      // 学生表是直接添加外键，其他表是有map表,没有穿额外信息
      // 先添加基本表信息
      if (table == "students") {
        let sql = sqlText.add(table)
        const [{ affectedRows }] = await db.query(sql, req.body)
        if (affectedRows != 1) return res.cc('添加失败!')
        return res.cc("添加成功", 200)
      } else {
        console.log("添加事务")
        await addSqlAffair(table, req.body, res.cc)
      }
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
    let sql = sqlText.delete(table, "where id=?")

    if (table == "teachers") {
      console.log("有关联班级,使用事务，两张表")
      let connection = await db.getConnection();
      try {
        // 开启事务
        await connection.beginTransaction();
        // 删除教师账户
        await connection.query(sql, req.body.id);
        // 删除班级教师映射记录
        console.log("教师ID " + JSON.stringify(req.body))
        await connection.query(
          sqlText.delete('teacher_class_map', 'where teacher_id=?'),
          req.body.account
        );
        await connection.commit();
        res.cc('删除成功', 200)
      } catch (error) {
        await connection.rollback();
        console.log(error)
        res.cc('删除失败')
      } finally {
        connection.release();
      }
      // }

    } else if (table == "class") { // table == "class"
      // 使用事务
      // 删除班级信息
      let connection = await db.getConnection();
      try {
        // 开启事务
        await connection.beginTransaction();
        // 删除班级--s
        await connection.query(sql, req.body.id);
        // 删除所有与该班级有映射联系的记录
        await connection.query(
          sqlText.delete('teacher_class_map', 'where class_id=?'),
          [req.body.id]
        );
        // 更新学生表的与当前班级关联的班级id
        await connection.query(
          sqlText.update('students', 'where classID=?'),
          [{ classID: null }, req.body.id]
        );
        await connection.commit();
        res.cc('删除成功', 200)
      } catch (error) {
        await connection.rollback();
        res.cc('删除失败')
      } finally {
        connection.release();
      }
    } else {
      // 删除学生账号
      try {
        const [{ affectedRows }] = await db.query(sql, req.body.id)
        if (affectedRows == 0) return res.cc('删除账号失败')
        res.cc('删除账号成功', 200)
      } catch (error) {
        console.log(error)
        res.cc('服务器查询错误')
      }
    }
  }
}

// 普通信息更新
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
exports.updateClassMasterTeacher = async (req, res) => {
  try {
    if (req.body.originTcID) {
      // 如果原来有班主任 
      // 先删除原班主任与班级的关联信息 
      // 再添加新班主任与班级的关联信息
      // 多表操作 使用事务
      let connection = await db.getConnection();
      try {
        // 开启事务
        await connection.beginTransaction();
        // teacher_class_map删除原班主任信息记录
        await db.query(
          sqlText.delete('teacher_class_map', 'where teacher_id=? and class_id=?'),
          [req.body.originTcID, req.body.id]
        )
        delete req.body.originTcID

        // teacher_class_map 添加新班主任记录
        await db.query(
          sqlText.add('teacher_class_map'),
          [{ is_master: 1, teacher_id: req.body.tcID, class_id: req.body.id }])
        await connection.commit();
        res.cc('成功修改班主任', 200)
      } catch (error) {
        // 回滚
        await connection.rollback();
        res.cc('修改班主任失败')
      } finally {
        // 释放连接
        connection.release();
      }
    } else {
      // 先查询之前是否属于这个班级，
      // 有记录直接修改 is_master
      // 没有记录直接添加一条记录
      const [rows] = await db.query(
        sqlText.queryTeacherClassMap("where teacher_id=? and class_id=?"),
        [req.body.tcID, req.body.id])
      if (rows.length > 0) {
        // 设置 teacher_class_map 新班主任 is_master
        console.log(JSON.stringify(rows))
        // TODO: 查询有问题
        let [{ affectedRows }] = await db.query(
          sqlText.update('teacher_class_map', 'WHERE class_id=? AND teacher_id=?'),
          [{ is_master: 1 }, req.body.id, req.body.tcID])
        console.log(affectedRows)

        if (affectedRows == 0) return res.cc('设置班主任失败！')
      } else {
        console.log("直接添加map记录")
        const [{ affectedRows }] = await db.query(
          sqlText.add("teacher_class_map"),
          [{ class_id: req.body.id, teacher_id: req.body.tcID, is_master: 1 }])
        if (affectedRows != 1) return res.cc('设置班主任失败！')
      }
      res.cc('设置班主任成功！', 200)
    }
  } catch (error) {
    console.log(error)
    if (error.errno == 1054) return res.cc('提交参数错误')
    res.cc('服务器sql查询错误')
  }
}

// 取消现班级有班主任
// 参数
// id T  班级号
// tcID  T 教师工号
exports.cancelHeadmaster = async (req, res) => {
  // 置teacher_class_map记录的is_master = 0 删除记录
  let sql = sqlText.delete('teacher_class_map', 'where class_id=? and teacher_id=?')
  let [{ affectedRows }] = await db.query(sql, [req.body.id, req.body.tcID])
  if (affectedRows == 0) return res.cc('撤销班主任失败')
  res.cc('撤销班主成功', 200)
}