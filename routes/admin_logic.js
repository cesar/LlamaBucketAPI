var mysql = require('mysql');

var connection = mysql.createConnection({
	host : process.env.CLEARDB_DATABASE_URL,  //Set up the database connection host
  	user : process.env.CLEARDB_DATABASE_USERNAME, //Username
  	password : process.env.CLEARDB_DATABASE_PASSWORD,  //Password
  	database : process.env.CLEARDB_DATABASE,  //database name
});



/*
 * Basic method to get the users from the database
 */
var get_users = function(req, res, next){
	var datetime = new Date();
	var thisYear = datetime.getFullYear();
	console.log("HEllo");

	connection.query('SELECT client_id, client_firstname, client_lastname, email, isAdmin FROM client', function(err, rows){
		if (!err)
		{

		console.log("Getting users from db...");

		res.send(rows);
		console.log(rows);			
		}
		//User email does not exist on our records as typed.
		else{
			console.log(err);
			res.send({error : 'Not Found'});
		}

	});
}
var get_individual = function(req, res, next){
	var datetime = new Date();
	var thisYear = datetime.getFullYear();
	connection.query('SELECT client_id, client_firstname, client_lastname, email, phone, isAdmin, address_1, address_2, city, country, state, zip_code  FROM client natural join address WHERE address.is_primary = 1 and client.client_id=' + parseInt(req.params.parameter), function(err, rows){
		
		if(!err)
			{
				console.log("Getting user from db...");
		res.send(rows);
		console.log(rows);
	}

	else
	{
		console.log(err);

		res.send({error: 'Not Found'});
	}
	});
}

/*
 * Methods to get from the invoice table to start preparing reports
 */
var get_report_total_sales_day = function(req, res, next){
	var datetime = new Date();
	console.log("Hello");
	var thisYear = datetime.getFullYear();
	var day = datetime.getDate();
	var month = datetime.getMonth() + 1;
	console.log(day);
	console.log(month);
	console.log(thisYear);
	//Gets the invoices for today

	connection.query('select * from invoice where date_day=' + day + ' and date_year=' + thisYear + ' and date_month=' + month, function(err, rows){
		
	if(!err){

		console.log("Getting invoices from DB...");
		res.send(rows);
		console.log(rows);
	}

	else
	{

		console.log(err);
		res.send({error: 'Not Found'});
	}
	});
}
var get_report_total_sales_week = function(req, res, next){
	var datetime = new Date();
	var thisYear = datetime.getFullYear();
	var week = (datetime.getDate()%7) + 1;
	var month = datetime.getMonth() + 1;

	connection.query('select * from invoice where date_week=' + week  + 'and date_year=' + thisYear + 'and date_month=' + month, function(err, rows){
		console.log("Getting invoices from DB...");
		res.send(rows[0]);
		console.log(rows[0]);
	});
}
var get_report_total_sales_month = function(req, res, next){
	var datetime = new Date();
	var thisYear = datetime.getFullYear();
	var month = datetime.getMonth() + 1;
	connection.query('select * from invoice where date_month=' + month  + 'and date_year=' + thisYear, function(err, rows){
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