var mysql = require('mysql');

var connection = mysql.createConnection({
  host : process.env.CLEARDB_DATABASE_URL,  //Set up the database connection host
  user : process.env.CLEARDB_DATABASE_USERNAME, //Username
  password : process.env.CLEARDB_DATABASE_PASSWORD,  //Password
  database : process.env.CLEARDB_DATABASE,  //database name
});






var get_item = function(req, res, next){
	

		connection.query('select * from item natural join listing natural join client natural join category join address where client.client_id = seller_id and cat_id = item_category and address_id = src_address and item_id ='+req.params.parameter, function(err, rows){
				console.log("Hello WOrld!");
				res.send(rows[0]);
				console.log(rows[0]);
		});


}

exports.get_item = get_item;