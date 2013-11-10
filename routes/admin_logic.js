var mysql = require('mysql');

var connection = mysql.createConnection({
	host : process.env.CLEARDB_DATABASE_URL,  //Set up the database connection host
  	user : process.env.CLEARDB_DATABASE_USERNAME, //Username
  	password : process.env.CLEARDB_DATABASE_PASSWORD,  //Password
  	database : process.env.CLEARDB_DATABASE,  //database name
});

var datetime = new Date();
var thisYear = datetime.getFullYear();

/*
 * Basic method to get the users from the database
 */
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

/*
 * Methods to get from the invoice table to start preparing reports
 */
var get_report_total_sales_day = function(req, res, next){
	connection.query('select * from invoice where date_day=' + req.params.parameter + 'and date_year=' + thisYear, function(err, rows){
		console.log("Getting invoices from DB...");
		res.send(rows[0]);
		console.log(rows[0]);
	});
}
var get_report_total_sales_week = function(req, res, next){
	connection.query('select * from invoice where date_week=' + req.params.parameter  + 'and date_year=' + thisYear, function(err, rows){
		console.log("Getting invoices from DB...");
		res.send(rows[0]);
		console.log(rows[0]);
	});
}
var get_report_total_sales_month = function(req, res, next){
	connection.query('select * from invoice where date_month=' + req.params.parameter  + 'and date_year=' + thisYear, function(err, rows){
		console.log("Getting invoices from DB...");
		res.send(rows[0]);
		console.log(rows[0]);
	});
}


exports.get_report_total_sales_day = get_report_total_sales_day;
exports.get_report_total_sales_week = get_report_total_sales_week;
exports.get_report_total_sales_month = get_report_total_sales_month;

exports.get_individual = get_individual;
exports.get_users = get_users;