// db.js
const mysql = require('mysql2');

const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: 'asds123A@',
  database: 'co_tuong'
});

module.exports = pool.promise();
