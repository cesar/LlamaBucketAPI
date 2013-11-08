var mysql = require('mysql');

var connection = mysql.createConnection({
  host : process.env.CLEARDB_DATABASE_URL,  //Set up the database connection host
  user : process.env.CLEARDB_DATABASE_USERNAME, //Username
  password : process.env.CLEARDB_DATABASE_PASSWORD,  //Password
  database : process.env.CLEARDB_DATABASE,  //database name
});






var get_item = function(req, res, next){
	

		connection.query('select *, count(B.listing_id) as bid_count from bidding_history as B RIGHT JOIN (select * from listing natural join item natural join client natural join address natural join category where item_id ='+req.params.parameter+' and item_category = cat_id) as T ON address_id = src_address and B.listing_id = T.listing_id group by T.listing_id',function(err, rows){
				console.log("Hello WOrld!");
				res.send(rows[0]);
				console.log(rows[0]);
		});


}

exports.get_item = get_item;