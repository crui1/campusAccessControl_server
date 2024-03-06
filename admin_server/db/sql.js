
const admin = {
  // 自己账户操作
  reg_login: 'select id,account,password from admin where account=?',
  getInfo: `select name,email,pic from admin where id=?`,
  selPwd: `select password from admin where id=?`,

  // 对管理的信息操作
  // 查询
  queryTeacherClassMap: (where = '') => `SELECT * FROM teacher_class_map ${where}`,
  queryClass: (where = '') => `
    SELECT
        c.id,
        c.name,
        tcm.teacher_id AS tcID,
        teachers.name AS tcName,
        tcm.is_master
    FROM
        class AS c
    LEFT JOIN teacher_class_map AS tcm ON c.id = tcm.class_id AND tcm.is_master = 1
    LEFT JOIN teachers ON tcm.teacher_id = teachers.account ${where}`,
  queryStudentAccounts: (where = '') => `SELECT u.id,u.account,u.name,c.name as cname  FROM students as u left join class as c on u.classID=c.id ${where}`,
  queryTeacherAccounts: (where = '') => `
    SELECT
        u.id,
        u.account,
        u.name,
        tcm.class_id AS classID,
        cl.name AS cname,
        is_master
    FROM
        teachers AS u
    LEFT JOIN teacher_class_map AS tcm ON u.account = tcm.teacher_id
    LEFT JOIN class AS cl ON tcm.class_id = cl.id ${where}`,
  // 添加
  add: (table) => `insert into ${table} set ?`,
  delete: (table, where = '') => `delete from ${table} ${where}`,
  update: (table, where = 'where id=?') => `update ${table} set ? ${where}`,
}

module.exports = admin