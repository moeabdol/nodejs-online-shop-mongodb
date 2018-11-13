const mysql = require('mysql2');

const pool = mysql.createPool({
  host: 'localhost',
  user: 'moeabdol',
  password: '12345678',
  database: 'online_shop'
});

module.exports = pool.promise();
