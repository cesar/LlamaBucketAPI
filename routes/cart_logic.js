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

			var total_price = 0;

			for(var i = 0; i < items.length; i++)
			{
				total_price = total_price + items[i].price_buy;
			}

			var send_data = {
				items : items,
				sum_price : total_price
			}

			res.send(send_data);
		}
		else
			throw err
	});
}
/**
*	GET items from the bucket to process the checkout
*
*/
var bucket_checkout  = function(req, res, next)
{
	var query = 'select * from item natural join (select item_id, listing_id, price_buy from listing where is_active = 1) as t1 natural join (select listing_id, client_id from bucket where client_id = '
		+connection.escape(req.params.id)+') as t2 natural join (select client_id, address_1, address_2, city, state, country, zip_code from address where is_primary = 1) as t3 natural join (select client_id, cc_number, cc_type, billing_address from credit_card where is_primary = 1) as t4;'
	
	connection.query(query, function(err, info)
	{
		if (!err)
		{
			var send_data = {
				items : [],
				primary_address : {},
				primary_credit_card : {},
				order_amount : 0,
			}

			//Get all the infor from the items in the bucket
			for(var i = 0; i < info.length; i++)
			{
				send_data.items.push(
					{
						name : info[i].item_name,
						description : info[i].item_description,
						image : info[i].item_image,
						price : info[i].price_buy
					});
				send_data.order_amount = send_data.order_amount + info[i].price_buy
			}

			//Set the users primary shipping address
			send_data.primary_address = {
				address_1 : info[0].address_1,
				address_2 : info[0].address_2,
				city : info[0].city,
				state : info[0].state,
				country : info[0].country,
				zip_code : info[0].zip_code
			}

			//Set the user primary credit card information
			send_data.primary_credit_card = {
				number : info[0].cc_number.substring(12),
				type : info[0].cc_type 
			}

			res.send(send_data);


		}
		else
			throw err;
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
exports.bucket_checkout = bucket_checkout;
exports.get_address = get_address;
exports.add_to_cart = add_to_cart;
exports.remove = remove;
