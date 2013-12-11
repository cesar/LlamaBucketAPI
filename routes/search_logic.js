/*
*	All logic related to searching for items on the database.
*/

var database = require('./database.js');


var connection = database.connect_db();



var get_filtered_results = function(req, res, next)
{
	console.log(req.body);

	


	var type_query = 'and is_auction =' + connection.escape(req.body.item_type);
	var sort_by_query;

	if(req.body.sort_by == '')
	{
		sort_by_query = "";
	}

	else{


		sort_by_query = "order by " + req.body.sort_by;
	}
	if(req.body.item_type == "all" || req.body.item_type == '')
	{


		type_query = "";


	}
	var price_min_query;
	var price_max_query;


	if(typeof(parseInt(req.body.min_price)) == 'number' &&  req.body.min_price != '')
	{
		price_min_query = 'and price >' + req.body.min_price;
	}

	else if(req.body.min_price == '')
	{

		price_min_query = 'and price > 0';
	}

	else
	{


		price_min_query = "";
	}

	if( typeof(parseInt(req.body.max_price)) == 'number' &&  req.body.max_price != '')
	{
				price_max_query = ' and price <' + req.body.max_price;

	}

	else{


		price_max_query = "";
	}


	var price_filter_query = price_min_query + price_max_query;


	var search_param = '%' + req.body.search +'%';


	console.log(price_filter_query);
	var query = 'select *, count(B.listing_id) as bid_count from bidding_history as B RIGHT JOIN (select * from listing natural join item natural join category where item_category = cat_id and item_name like '+ connection.escape(search_param)+ type_query + price_filter_query+') as T ON B.listing_id = T.listing_id  and listing_is_active = 1 group by T.listing_id ' + sort_by_query; 
	console.log(query);
	connection.query(query, function(err, rows)
	{

		if(!err){
		res.send({content: rows});
		console.log({content: rows});
	}
		else{

			console.log(err);
		}
	});

	connection.on('error', function(err)
  {
    if(err.code == 'PROTOCOL_CONNECTION_LOST')
    {
      console.log('reconnected');
      connection =  database.connect_db();
    }
    else
    {
      throw err;
    }
  });

}

var get_filtered_category_results = function(req, res, next)
{



console.log(req.body);

	


	var type_query = 'and is_auction =' + connection.escape(req.body.item_type);
	var sort_by_query;

	if(req.body.sort_by == '')
	{


		sort_by_query = "";
	}

	else{


		sort_by_query = "order by " + req.body.sort_by;
	}
	if(req.body.item_type == "all")
	{


		type_query = "";


	}
	var price_min_query;
	var price_max_query;


	if(typeof(parseInt(req.body.min_price)) == 'number' &&  req.body.min_price != '')
	{
		price_min_query = 'and price >' + req.body.min_price;
	}

	else if(req.body.min_price == '')
	{

		price_min_query = 'and price > 0';
	}

	else
	{


		price_min_query = "";
	}

	if( typeof(parseInt(req.body.max_price)) == 'number' &&  req.body.max_price != '')
	{
				price_max_query = ' and price <' + req.body.max_price;

	}

	else{


		price_max_query = "";
	}


	var price_filter_query = price_min_query + price_max_query;


	var search_param = '%' + req.body.search +'%';


	console.log(price_filter_query);
	var query = 'select *, count(B.listing_id) as bid_count from bidding_history as B RIGHT JOIN (select * from listing natural join item natural join category where item_category ='+connection.escape(req.body.cat_id) + type_query + price_filter_query+') as T ON B.listing_id = T.listing_id and listing_is_active = 1  group by T.listing_id ' + sort_by_query; 
	console.log(query);
	connection.query(query, function(err, rows)
	{
		if(!err){

		res.send({content: rows});
		console.log({content: rows});
	}

	else{console.log(err);}
	});

}

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
		connection.query('select *, count(B.listing_id) as bid_count from bidding_history as B RIGHT JOIN (select * from listing natural join item natural join category where item_category='+connection.escape(cat)+' and listing_is_active = 1 and item_category = cat_id) as T ON B.listing_id = T.listing_id  group by T.listing_id', function(err, rows){
				res.send({content : rows});
				console.log({content:rows});
		});
	}

	else if(query_parameter.search(re_search_by_name) >= 0)
	{
		var search_terms = query_parameter.split(separator);

		search_terms = '%' + search_terms[1] + '%'
		
		connection.query('select *, count(B.listing_id) as bid_count from bidding_history as B RIGHT JOIN (select * from listing natural join item where item_name like '+connection.escape(search_terms)+' and listing_is_active = 1) as T ON B.listing_id = T.listing_id   group by T.listing_id', function(err, rows){
			if(!err){
				res.send({content : rows});
							console.log({content:rows});
						}
			else
				console.log(err);
		});
	}
	connection.on('error', function(err)
  {
    if(err.code == 'PROTOCOL_CONNECTION_LOST')
    {
      console.log('reconnected');
      connection =  database.connect_db();
    }
    else
    {
      throw err;
    }
  });
}



//Export functions

exports.get_results = get_results;
exports.get_filtered_results = get_filtered_results;
exports.get_filtered_category_results = get_filtered_category_results;



