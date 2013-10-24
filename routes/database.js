var mysql = require('mysql');

var connection = mysql.createConnection({
  host : process.ENV.CLEARDB_DATABASE_URL,
  user : process.ENV.CLEARDB_DATABASE_USERNAME,
  password : process.ENV.CLEARDB_DATABASE_PASSWORD,
});

connection.query('SELECT * FROM test', function(err, rows){
  console.log(rows);
});