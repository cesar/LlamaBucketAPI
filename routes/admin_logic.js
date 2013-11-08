var mysql = require('mysql');

var connection = mysql.createConnection({
	host : process.env.CLEARDB_DATABASE_URL,  //Set up the database connection host
  	user : process.env.CLEARDB_DATABASE_USERNAME, //Username
  	password : process.env.CLEARDB_DATABASE_PASSWORD,  //Password
  	database : process.env.CLEARDB_DATABASE,  //database name
});

var get_users = function(req, res, next){
	connection.query('SELECT client_id, client_firstname, client_lastname, email, isAdmin FROM client', function(err, rows){
		console.log("Getting users from db...");
		res.send(rows[0]);
		console.log(rows[0]);
	});
}
var get_individual = function(req, res, next){
	
		connection.query('SELECT client_id, client_firstname, client_lastname, email, isAdmin FROM client WHERE client_id=' + req.params.parameter, function(err, rows){
		console.log("Getting users from db...");
		res.send(rows[0]);
		console.log(rows[0]);
	});
}
var get_report = function(req, res, next){
	//res.send(report.content);
}
exports.get_report = get_report;
exports.get_individual = get_individual;
exports.get_users = get_users;