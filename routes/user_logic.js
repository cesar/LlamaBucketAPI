/*
* ============================================
*	All logic related to the user on the server |
* ============================================
*/

var database = require('./database.js');


var connection = database.connect_db();
var serverURL = "http://74.213.79.108:5000";



// User notifications

/*
*	Check the user credentials for a sign in, no hashing whatsoever so far.
*/
var sign_in = function(req, res, next)
{
	var query = 'select password, client_id, isAdmin from client where email = ' + connection.escape(req.body.email);

	connection.query(query, function(err, user){
		if (!err)
		{
			if(user[0].password == req.body.password)
			{
				var send_data = {
					id : user[0].client_id,
					isAdmin: user[0].isAdmin
				}
				console.log(send_data);
				res.send(send_data);
			}
			else
				res.send({error : 'Incorrect Password'});
		}
		//User email does not exist on our records as typed.
		else{
			console.log(err);
			res.send({error : 'Not Found'});
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

//Get the user profile
var get_profile = function(req, res, next)
{
	//Get the necesary user information, arrange correctly as a JSON, send to client.
	var query = 'select client_firstname, client_lastname, client_image, email, phone, avg_rank, address_1, address_2, city, zip_code, state, country, cc_number, cc_type from client natural join (select rankee_id, avg(rank) as avg_rank from user_ranking where rankee_id = '
		+connection.escape(req.params.user_id)+') as t1  natural join (select address_1, address_2, city, zip_code, state, country, client_id from address where is_primary = 1 and client_id = '
		+connection.escape(req.params.user_id)+') as t2 natural join (select client_id, cc_number, cc_type from credit_card where client_id = '
		+connection.escape(req.params.user_id)+' and is_primary = 1) as t3 where client_id = '+connection.escape(req.params.user_id);

connection.query(query, function(err, user)
{
	if(!err)
	{
		var send_data = {
			name : user[0].client_firstname + ' ' + user[0].client_lastname,
			email : user[0].email,
			rank : user[0].avg_rank,
			phone : user[0].phone,
			image : user[0].client_image,
			credit_card : user[0].cc_number.substring(12), 
			credit_card_type : user[0].cc_type,
			address_1 : user[0].address_1,
			address_2 : user[0].address_2,
			city : user[0].city,
			state : user[0].state,
			zip_code : user[0].zip_code,
			contry : user[0].country
		};

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
*	Modify the user and send the new user to the client.
*/
var update_user = function(req, res, next)
{
	user.first_name = req.body.first_name;
	user.last_name = req.body.last_name;
	user.email = req.body.email;

	res.send(user);
}

/*
*	Get the addresses for a specific user
*/
var user_addresses = function(req, res, next)
{	
	connection.query('select * from address where client_id = '+connection.escape(req.param('id')), function(err, rows){
		if(!err)
			res.send({ content : rows});
		else
			res.send('Error');
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

var get_credit_cards = function(req, res, next)
{	;
	var query = 'select cc_number, cc_type, cc_exp_date, cc_holder, address_1, address_2, city, state, country, zip_code from credit_card natural join (select address_id as billing_address, address_1, address_2, city, zip_code, country, state from address) as t1 where client_id = '
	+connection.escape(req.params.id)+';'

	connection.query(query, function(err, rows)
	{
		if (!err)
		{
			var send_data = [];
			for(var i = 0; i < rows.length; i++)
			{
				//Don't send the entire credit card number
				send_data.push({
					number : rows[i].cc_number.substring(12),
					type : rows[i].cc_type,
					address_1 : rows[i].address_1,
					address_2 : rows[i].address_2,
					city : rows[i].city,
					state : rows[i].state,
					zip_code : rows[i].zip_code,
					exp_date : rows[i].cc_exp_date,
					holder : rows[i].cc_holder,
					country : rows[i].country
				});
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

var add_mail_address = function(req, res, next)
{
	var new_address = {
		mail_address1 : req.body.address1,
		mail_address2 : req.body.address2,
		mail_city : req.body.city,
		mail_state : req.body.country,
		mail_zip : req.body.zipcode
	};

	addresses.content.push(new_address);

	//Confirm that all is well
	res.send(200);
}

var delete_address = function(req, res, next)
{
	for(var i = 0; i < addresses.content.length; i++)
	{
		if(addresses.content[i].mail_address1 == req.body.address1)
		{
			addresses.content.splice(i, 1);
		}
	}
	res.send(200);
}

var get_notifications = function(req, res,err)
{
	//Get all notifications pertaining to a user.
	var query ='select notification_id, notification_message, title, listing_id from user_notifications where client_id = '+connection.escape(req.params.id)+' and is_read = 0;'

	connection.query(query, function(err, notifications)
	{
		if(!err)
		{
			res.send(notifications);
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

var get_bids = function(req, res, err)
{	;
	console.log(req.param('client_id'));
	connection.query('select * from bidding_history natural join listing natural join item where bidder_id ='+connection.escape(req.param('client_id'))+' group by listing_id ', function(err, rows)
	{
		if (!err){
			res.send({content : rows});
			console.log({content: rows});
		}

		else
			console.log(err);
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

var get_listings = function(req, res, err)
{		var query = 'select *, count(B.listing_id) as bid_count from bidding_history as B RIGHT JOIN (select * from listing natural join item where seller_id ='+ connection.escape(req.param('client_id'))+') as T ON B.listing_id = T.listing_id group by T.listing_id';


connection.query( query,function(err, rows){

	if(!err)
	{
		res.send({content:rows});
		console.log({content:rows});
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

var get_offers = function(req, res, err)
{


	
	var query =' select * from bidding_history natural join listing natural join item natural join client where seller_id =' + connection.escape(req.body.client_id) +' and client_id = bidder_id and item_id =' + connection.escape(req.body.item_id) + ' order by datetime desc'
	console.log(query);
	connection.query(query, function(err, offers)
	{



		if(!err)
		{
			res.send(offers);
		}

		else
		{

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

var get_invoices = function(req, res, err)
{
	var query = 'select * from listing natural join invoice natural join item natural join client where seller_id = client.client_id and invoice.buyer_id = ' + req.params.parameter;
	connection.query(query, function(err, rows){
		if(!err)
		{
			res.send(rows);
			console.log(rows);
		}
		else{

			console.log(err);
		}
	});
}

var get_single_invoice = function(req, res, err)
{
	var query = 'select final_price, item_name, cc_number, invoice_date as date, address_1, address_2, city, state, zip_code, concat(client_firstname, " ", client_lastname) as seller_name from listing natural join invoice natural join item natural join client natural join credit_card natural join address where seller_id = client.client_id and invoice_id = ' + req.params.parameter;
	connection.query(query, function(err, rows){
		if(!err)
		{
			res.send(rows);
			console.log(rows);
		}
		else{

			console.log(err);
		}
	});
}

//User uploads listing into the db
var upload_item = function(req, res, err)
{	

	var dateFormat = require('dateformat');
	var item_time = req.body.item_time;
	var item_time_ms = item_time * 24 * 60 * 60 * 1000;

	var current_date = new Date();
	var current_ms = current_date.getTime();

	var exp_date_ms = item_time_ms + current_ms;

	var exp_date = new Date(exp_date_ms);

	var item_type = req.body.item_type;


	var item_insert_query = 'INSERT INTO item (item_name, item_image, item_description, item_brand, item_year, item_category) VALUES('+
		connection.escape(req.body.item_name) + ',' + connection.escape(serverURL + '/' + req.files.file.ws.path) + ',' 
		+ connection.escape(req.body.item_description) + ','+ connection.escape(req.body.item_brand) + ',' 
		+ connection.escape(req.body.item_year) + ',' + connection.escape(req.body.item_category) + ')';
console.log("INSERT ITEM QUERY: " + item_insert_query);


connection.beginTransaction(function(err) {
	if (err) { console.log(err); }


	connection.query(item_insert_query, function(err, result)
	{	  
		if(!err)
		{	
			var type_query;

			var listing_query = 'INSERT INTO listing (price, start_bid, exp_date, seller_id, item_id, is_active,  is_auction, buyout_price, shipping_price, shipping_service, handle_time) VALUES(';


				var item_id = result.insertId;
				console.log("LOG - Item Inserted: " + item_id);

				if(item_type == "bid")
				{

					type_query =  connection.escape(parseFloat(req.body.start_bid)) + ',' + 
					connection.escape(parseFloat(req.body.start_bid)) + ',' + 
					connection.escape(dateFormat(exp_date, "isoDateTime")) + ',' + 
					connection.escape(parseInt(req.body.user_id))+ ',' + 
					connection.escape(item_id)+ ',' + connection.escape(1) + ','+ 
					connection.escape("bid") +',' + 'NULL' +',';

				}

				else if(item_type == "buy")
				{
					type_query =  connection.escape(parseFloat(req.body.item_price)) + ', NULL ,' + 
					connection.escape(dateFormat(exp_date, "isoDateTime")) + ',' + 
					connection.escape(parseInt(req.body.user_id)) + ',' + 
					connection.escape(item_id)+ ',' + 
					connection.escape(1) + ','+ 
					connection.escape("buy") +',' + connection.escape(parseFloat(req.body.item_price)) + ',';


				}
				else if(item_type =="both")
				{


					type_query =  connection.escape(parseFloat(req.body.start_bid)) + ','+
					connection.escape(parseFloat(req.body.start_bid)) + ','+
					connection.escape(dateFormat(exp_date, "isoDateTime")) + ',' + 
					connection.escape(parseInt(req.body.user_id)) + ',' + 
					connection.escape(item_id)+ ',' + 
					connection.escape(1) + ','+ 
					connection.escape("both") +',' + 	
					connection.escape(parseFloat(req.body.buyout_price)) + ',';



				}

				var shipping_info = connection.escape(parseFloat(req.body.shipping_price)) + ',' + 
				connection.escape(req.body.shipping_service) + ',' + 
				connection.escape(req.body.shipping_time) + ');';


console.log("UPLOAD LISTING QUERY: " + listing_query + type_query + shipping_info);

connection.query(listing_query + type_query + shipping_info, function(error, rows)
{
	if(!error)
	{

		res.send({recent_item_id : item_id})
		console.log(rows);


		connection.commit(function(err) {
			if (err) { 
				connection.rollback(function() {
					throw err;
				});
			}
			console.log('Insert Listing Success!');
		});
	}

	else{
		console.log(error);
	}
});


}


else{

	console.log(err);
}

});
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






exports.upload_item = upload_item;
exports.get_listings = get_listings;
exports.get_bids = get_bids;
exports.get_notifications = get_notifications;
exports.sign_in = sign_in;
exports.update_user = update_user;
exports.user_addresses = user_addresses;
exports.add_mail_address = add_mail_address;
exports.delete_address = delete_address;
exports.get_profile = get_profile;
exports.get_credit_cards = get_credit_cards;
exports.get_offers = get_offers;
exports.get_invoices = get_invoices;
exports.get_single_invoice = get_single_invoice;




