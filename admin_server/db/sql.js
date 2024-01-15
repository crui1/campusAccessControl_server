
const admin = {
  // 自己账户操作
  reg_login: 'select id,account,password from admin where account=?',
  getInfo: `select name,email,pic from admin where id=?`,
  selPwd: `select password from admin where id=?`,

  // 对管理的信息操作
  // 所有班级
  getClass: (where = '') => `SELECT c.id,c.name,c.tcID,s.name as sname FROM access.class as c left join access.teachers as s on c.id=s.classID ${where}`,
  // 所有账户
  getAllAccount: (table, where = '') => `SELECT u.id,u.account,u.name,u.classID,c.name as cname  FROM ${table} as u left join class as c on u.classID=c.id ${where}`,
  add: (table) => `insert into ${table} set ?`,
  delete: (table) => `delete from ${table} where id=?`,
  update: (table, where = 'where id=?') => `update ${table} set ? ${where}`,
}

module.exports = admin