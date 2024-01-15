const sql = {
  reg_login: (table) => `select id,classID,account,password from ${table} where account=?`,
  getInfo: (table, where = '') => `SELECT u.email,u.name,u.pic,c.name as class  FROM ${table} as u left join class as c on u.classID=c.id ${where}`,
  selPwd: (table) => `select password from ${table} where id=?`,
  update: (table) => `update ${table} set ? where id=?`,
  getApp: (where = undefined) => `select * from application_logs ${where}`,
  getFaceInfo: `select * from face where id=?`,
  postFaceInfo: `insert into face set ?`,
  updateFaceInfo: `update face set ? where id=?`,
  postApp: `insert into application_logs set ?`,
  alterApp: 'update application_logs set ? where id=?',
  getClass: 'select * from class',

}
// 账户管理 班级管理
const admin = {
  // 所有账户
  add: (table) => `insert into ${table} set ?`,
  // delete: (table) => `delete from ${table} where id=?`,
}

module.exports = {
  sql,
  admin
}