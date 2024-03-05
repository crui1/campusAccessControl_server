const sql = {
  reg: (table) => `select id,account from ${table} where account=?`,
  login: (table) => `select id,account,password from ${table} where account=?`,
  getStuInfo: () => `
    SELECT u.email,u.name,u.pic,c.name AS class  FROM students AS u
    left join class AS c on u.classID=c.id WHERE u.id=?`,
  getTcInfo: () => `
    SELECT u.id,u.email,u.name,u.pic,tcm.is_master,tcm.class_id,class.name AS class FROM teachers AS u 
    LEFT JOIN teacher_class_map AS tcm on u.id=tcm.teacher_id
    LEFT JOIN class ON class.id = class_id	WHERE u.id=?`,
  selPwd: (table) => `select password from ${table} WHERE id=?`,
  update: (table) => `update ${table} set ? where id=?`,
  getApp: (where = '') => `select * from view_application_logs ${where}`,
  getFaceInfo: `select * from face WHERE id=?`,
  postFaceInfo: `insert into face set ?`,
  updateFaceInfo: `update face set ? WHERE id=?`,
  postApp: `insert into application_logs set ?`,
  alterApp: 'update application_logs set ? WHERE id=?',
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