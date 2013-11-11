/*
* ============================================
*	All logic related to the user on the server |
* ============================================
*/

var mysql = require('mysql');

var connection = mysql.createConnection({
  host : process.env.CLEARDB_DATABASE_URL,  //Set up the database connection host
  user : process.env.CLEARDB_DATABASE_USERNAME, //Username
  password : process.env.CLEARDB_DATABASE_PASSWORD,  //Password
  database : process.env.CLEARDB_DATABASE,  //database name
});


// User notifications

/*
*	Check the user credentials for a sign in, no hashing whatsoever so far.
*/
var sign_in = function(req, res, next)
{
	console.log(req.body);
	var query = 'select password, client_id, isAdmin from client where email = ' + connection.escape(req.body.email);

	connection.query(query, function(err, user){
		if (!err)
		{
			console.log(user);
			if(user[0].password == req.body.password)
			{
				var send_data = {
					id : user[0].client_id,
					isAdmin: user[0].isAdmin
				}
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
}

var get_credit_cards = function(req, res, next)
{
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
	})
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

}

var get_bids = function(req, res, err)
{
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

}

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




