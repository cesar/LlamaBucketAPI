var mysql = require('mysql');

var connection = mysql.createConnection({
  host : process.env.CLEARDB_DATABASE_URL,  //Set up the database connection host
  user : process.env.CLEARDB_DATABASE_USERNAME, //Username
  password : process.env.CLEARDB_DATABASE_PASSWORD,  //Password
  database : process.env.CLEARDB_DATABASE,  //database name
});



var get_address = function(req,res, err)
{
	res.send(user_data);
}

/**
*	GET the contents of the users bucket. 
*/
var get_cart = function(req, res, err)
{
	var query = 'select * from item natural join (select item_id, price_buy, listing_id from listing where is_active = 1 and is_auction = "buy" or is_auction = "both") as t1 natural join (select listing_id, client_id from bucket where client_id = '
		+connection.escape(req.params.id)+') as t2';
	connection.query(query, function(err, items)
	{
		if (!err)
		{
			//res.send(content : items);
		}
		else
			throw err
	});
}

var add_to_cart = function(req, res, next)
{
	req.body.price = parseFloat(req.body.price);
	user_data.content.push(req.body);
	res.send(200);
}

var remove = function(req, res, next)
{
	for(var i = 0; i < user_data.content.length; i++)
	{
		if(user_data.content[i].name == req.body.name)
		{
			user_data.content.splice(i, 1);
		}
	}
	res.send(200);
}
exports.get_cart = get_cart;
exports.get_address = get_address;
exports.add_to_cart = add_to_cart;
var mysql = require('mysql');

var connection = mysql.createConnection({
  host : process.env.CLEARDB_DATABASE_URL,  //Set up the database connection host
  user : process.env.CLEARDB_DATABASE_USERNAME, //Username
  password : process.env.CLEARDB_DATABASE_PASSWORD,  //Password
  database : process.env.CLEARDB_DATABASE,  //database name
});exports.remove = remove;
