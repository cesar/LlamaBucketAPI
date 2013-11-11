var database = require('./database.js');


var connection = database.connect_db();

var get_address = function(req,res, err)
{
	res.send(user_data);
}

/**
*	GET the contents of the users bucket. 
*/
var get_cart = function(req, res, err)
{
	var query = 'select * from item natural join (select item_id, price, listing_id from listing where is_active = 1 and is_auction = "buy" or is_auction = "both") as t1 natural join (select listing_id, client_id from bucket where client_id = '
		+connection.escape(req.params.id)+') as t2';

	connection.query(query, function(err, items)
	{
		if (!err)
		{

			var total_price = 0;

			for(var i = 0; i < items.length; i++)
			{
				total_price = total_price + items[i].price;
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
/**
*	GET items from the bucket to process the checkout
*
*/
var bucket_checkout  = function(req, res, next)
{
	var query = 'select * from item natural join (select item_id, listing_id, price from listing where is_active = 1) as t1 natural join (select listing_id, client_id from bucket where client_id = '
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

			//Get all the info from the items in the bucket
			for(var i = 0; i < info.length; i++)
			{
				send_data.items.push(
					{
						id : info[i].item_id,
						name : info[i].item_name,
						description : info[i].item_description,
						image : info[i].item_image,
						price : info[i].price
					});
				send_data.order_amount = send_data.order_amount + info[i].price
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

/**
*	GET item for checkout
*/
var item_checkout  = function(req, res, next)
{	
	var parameters = req.params.parameter.split('-');

	//Second item in the array represents the client_id
	var client_id = connection.escape(parseInt(parameters[1]));

	//First item in the array represents the item_id
	var item_id = connection.escape(parseInt(parameters[0]));

	var query_1 = 'select address_1, address_2, city, zip_code, state, country, cc_number, cc_type from address natural join credit_card where client_id = '
	+client_id+' and is_primary = 1';

	var query_2 = 'select item_id, item_name, item_image, item_description, price from item natural join listing where item_id = '+ item_id;
	;

	async.parallel([
		function(callback){
			connection.query(query_1, function(err, info)
				{
					if (!err)
					{
						//Everything went smoothly. 
						callback(null, info);
					}
					else
					{
						//There was an error
						callback(err, null);
					}
				});
		}, 
		function(callback){
			connection.query(query_2, function(err, item)
			{
				if (!err)
				{
					callback(null, item)
				}
				else
				{
					callback(err, null);
				}
			});
		}],
		//Callback
		function(err, results){
			if (!err)
			{
				var send_data = {
					primary_credit_card  : {
						number : results[0][0].cc_number.substring(12),
						type : results[0][0].cc_type
					},
					primary_address : {
						address_1 : results[0][0].address_1,
						address_2 : results[0][0].address_2,
						city : results[0][0].city,
						state : results[0][0].state,
						zip_code : results[0][0].zip_code,
						country : results[0][0].country
					},
					item : {
						id : results[1][0].item_id,
						name : results[1][0].item_name,
						image : results[1][0].item_image,
						description : results[1][0].item_description,
						price : results[1][0].price
					}
				};
				res.send(send_data);
			}
			else
			{
				throw err;
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

var place_order_bucket = function(req, res, next)
{
	var today = new Date();

	var query_1 = 'select * from item natural join (select item_id, listing_id, seller_id, price from listing where is_active = 1) as t1 natural join (select listing_id from bucket where client_id = '
		+connection.escape(req.params.parameter)+') as t2 natural join (select client_firstname, client_lastname, client_id as seller_id from client) as t3;'

	var query_2 = 'select * from address natural join (select client_id, cc_number, cc_type from credit_card) as t1 where client_id = '
	+connection.escape(req.params.parameter)+' and is_primary = 1; '
	
	async.parallel([
		function(callback)
		{
			connection.query(query_1, function(err, items)
			{
				if (!err)
				{
					callback(null, items);
				}
				else
				{
					callback(err, null);
				}
			})
		},
		function(callback)
		{
			connection.query(query_2, function(err, user_info)
			{
				if (!err)
				{
					callback(null, user_info);
				}

				else
				{
					callback(err, null);
				}
			})

		}],
		function(err, results)
		{

			var send_data = {
				items : [],
				primary_address : {},
				primary_credit_card : {},
				order_amount : 0,
				time : today.getDate() + '/' + (today.getMonth() + 1) + '/' + today.getFullYear(),
			}

			//Get all the info from the items in the bucket
			for(var i = 0; i < results[0].length; i++)
			{
				send_data.items.push(
					{
						id : results[0][i].item_id,
						name : results[0][i].item_name,
						description : results[0][i].item_description,
						image : results[0][i].item_image,
						price : results[0][i].price,
						seller : results[0][i].client_firstname + ' ' +results[0][i].client_lastname
					});
				send_data.order_amount = send_data.order_amount + results[0][i].price
			}

			//Set the users primary shipping address
			send_data.primary_address = {
				address_1 : results[1][0].address_1,
				address_2 : results[1][0].address_2,
				city : results[1][0].city,
				state : results[1][0].state,
				country : results[1][0].country,
				zip_code : results[1][0].zip_code
			}

			//Set the user primary credit card information
			send_data.primary_credit_card = {
				number : results[1][0].cc_number.substring(12),
				type : results[1][0].cc_type 
			}
			res.send(send_data);
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
};

var place_order_item = function(req, res, next)
{
	var parameters = req.params.parameter.split('-');

	//Parameter 0 is the item id
	var query_1 = 'select * from item natural join (select seller_id as client_id, item_id, price, src_address from listing) as t1 natural join (select client_firstname, client_lastname, client_id from client) as t2 where item_id = '
	+connection.escape(parameters[0]);

	//Patameter 1 is the client id
	var query_2 = 'select address_1, address_2, city, zip_code, state, country, cc_number, cc_type from address natural join credit_card where client_id = '
	+connection.escape(parameters[1])+' and is_primary = 1';

	async.parallel([
		function(callback)
		{
			connection.query(query_1, function(err, item)
			{
				if(!err)
				{
					callback(null, item);
				}
				else
				{
					callback(err, null);
				}
			});
		},
		function(callback)
		{
			connection.query(query_2, function(err, info)
			{
				if (!err)
				{
					callback(null, info);
				}
				else
				{
					callback(err, null);
				}
			});
		}],
		function(err, results)
		{

			var today = new Date();

			var send_data = {
					primary_credit_card  : {
						number : results[1][0].cc_number.substring(12),
						type : results[1][0].cc_type
					},
					primary_address : {
						address_1 : results[1][0].address_1,
						address_2 : results[1][0].address_2,
						city : results[1][0].city,
						state : results[1][0].state,
						zip_code : results[1][0].zip_code,
						country : results[1][0].country
					},
					item : {
						id : results[0][0].item_id,
						name : results[0][0].item_name,
						image : results[0][0].item_image,
						description : results[0][0].item_description,
						price : results[0][0].price,
						seller : results[0][0].client_firstname + ' ' +results[0][0].client_lastname
					},
					time : today.getDate() + '/' + (today.getMonth() + 1) + '/' + today.getFullYear()
				};
				res.send(send_data);
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
};

exports.place_order_bucket = place_order_bucket;
exports.place_order_item = place_order_item;
exports.get_cart = get_cart;
exports.bucket_checkout = bucket_checkout;
exports.item_checkout = item_checkout;
exports.get_address = get_address;
exports.add_to_cart = add_to_cart;
exports.remove = remove;

