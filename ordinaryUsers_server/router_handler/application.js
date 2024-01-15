const sqlText = require('../db/sql');
const db = require('../db/index');

// ######################  教师相关处理函数  ################################
// 申请信息处理
// 1. state T 审核状态码
// 3. id    T  序列号
// 2. remark F 审核留言
exports.alterApp = (req, res) => {
  console.log(req.body);
  let sql = sqlText.sql.alterApp
  req.body.reviewDate = new Date().getTime()
  db.query(sql, [req.body, req.body.id], (err, result) => {
    if (err) return res.cc(err)
    console.log(result);
    if (result.affectedRows < 1) return res.cc('申请记录不存在！')
    res.cc('审核成功', 200)
  })
}
// 申请信息查询
// state F 审核状态码
exports.tcGetApp = (req, res) => {
  let sql = sqlText.sql.getApp('where classID=?')
  if (req.query.state) sql = sqlText.sql.getApp('where classID=? AND state=?')
  db.query(sql, [req.user.classID, req.query.state], (err, result) => {
    if (err) return res.cc(err)
    res.send({
      message: '获取数据成功',
      code: 200,
      data: result
    })
  })
}

// ######################  学生相关处理函数  ################################

// 出行申请
// 1  name        T 名字
// 2  time       T 通行次数
// 3  validityDate T 有效期
// 4  reason      T  理由
// 5  classID     F 班级号
// 6  className   F 班名
exports.postApp = (req, res) => {
  let data = {
    ...req.body,
    classID: req.user.classID,
    stuID: req.user.account,
    applicationDate: new Date().getTime(),
  }
  let sql = sqlText.sql.postApp
  db.query(sql, data, (err, result) => {
    if (err) return res.cc(err)
    res.cc('提交申请成功', 200)
  })
}

// 申请审核 状态查询
// 1. state F  审核状态码 （0: 待审，1：通过，2：未通过，4：撤销申请）
exports.stuGetApp = (req, res) => {
  let sql = sqlText.sql.getApp('where stuID=?')
  console.log(req.query);
  if (req.query.state) sql = sqlText.sql.getApp('where stuID=? AND state=?')
  db.query(sql, [req.user.account, req.query.state], (err, result) => {
    if (err) return res.cc(err)
    res.send({
      code: 200,
      message: '获取数据成功',
      data: result
    })
  })
}

// 取消申请 
// id T 序列号
exports.cancelApp = (req, res) => {
  let sql = sqlText.sql.alterApp
  db.query(sql, [{ state: 3 }, req.body.id], (err, result) => {
    if (err) return res.cc(err)
    res.cc('撤销成功', 200)
  })
}