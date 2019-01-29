//import modules
const mysql = require("mysql");

const connection = mysql.createConnection({
  host: 'localhost',
  port: 3306,
  user: 'root',
  password: 'letsAgomArio!',
  database: 'storefront'
});

module.exports = connection;