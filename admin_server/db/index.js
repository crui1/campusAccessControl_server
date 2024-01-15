const mysql = require('mysql2')
const config = require('../config')
const pool = mysql.createPool({
    host: config.db.host,
    port: config.db.port,
    user: config.db.user,
    password: config.db.pwd,
    database: config.db.database
})
const db = pool.promise()

module.exports = db