/*
*	All logic related to searching for items on the database.
*/

var mysql = require('mysql');

var connection = mysql.createConnection({
  host : process.env.CLEARDB_DATABASE_URL,  //Set up the database connection host
  user : process.env.CLEARDB_DATABASE_USERNAME, //Username
  password : process.env.CLEARDB_DATABASE_PASSWORD,  //Password
  database : process.env.CLEARDB_DATABASE,  //database name
});




var get_results = function(req, res, next)
{
	//Regular expression for matching a category
	var re_category = /category/;
	var re_search_by_name = /item_name/;

	//Regular expression to separate the category number.
	var separator = /=/;

	//Determine if its a category or a name
	var query_parameter = req.params.parameter;

	if(query_parameter.search(re_category) >= 0)
	{

		//Get the actual category.
		var category_id = query_parameter.split(separator);
		var cat = parseInt(category_id[1]);

		//Here is where the DB query should normally go.
		//NOTE: Makes this asynchronous later.
		connection.query('select *, count(B.listing_id) as bid_count from bidding_history as B RIGHT JOIN (select * from listing natural join item natural join category where item_category='+connection.escape(cat)+' and item_category = cat_id) as T ON B.listing_id = T.listing_id group by T.listing_id', function(err, rows){
				res.send({content : rows});
				console.log({content:rows});
		});
	}

	else if(query_parameter.search(re_search_by_name) >= 0)
	{
		var search_terms = query_parameter.split(separator);

		search_terms = '%' + search_terms[1] + '%'
		
		connection.query('select *, count(B.listing_id) as bid_count from bidding_history as B RIGHT JOIN (select * from listing natural join item where item_name like '+connection.escape(search_terms)+') as T ON B.listing_id = T.listing_id group by T.listing_id', function(err, rows){
			if(!err){
				res.send({content : rows});
							console.log({content:rows});
						}
			else
				console.log(err);
		});
	}
	
}



//Export functions

exports.get_results = get_results;



