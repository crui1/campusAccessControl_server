const mysql = require('mysql2')
const db = mysql.createPool({
    host: 'localhost',
    port: '3306',
    user: 'root',
    password: 'root3397',
    database: 'camp'
})

module.exports = db