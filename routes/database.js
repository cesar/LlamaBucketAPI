var mysql = require('mysql');

var db_config = {
  host : process.env.CLEARDB_DATABASE_URL,  //Set up the database connection host
  user : process.env.CLEARDB_DATABASE_USERNAME, //Username
  password : process.env.CLEARDB_DATABASE_PASSWORD,  //Password
  database : process.env.CLEARDB_DATABASE,  //database name
};

var connect_db = function()
{
  return mysql.createConnection(db_config);
}


exports.connect_db = connect_db;