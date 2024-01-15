const mysql = require('mysql2')
const db = mysql.createPool({
    host: 'localhost',
    port: '3306',
    user: 'xyptyh',
    password: 'ptyh123456',
    database: 'access'
})

module.exports = db