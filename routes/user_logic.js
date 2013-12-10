/*
* ============================================
*	All logic related to the user on the server |
* ============================================
*/

var database = require('./database.js');

var connection = database.connect_db();

/*
*	Check the user credentials for a sign in, no hashing whatsoever so far.
*/
exports.sign_in = function(req, res, next)
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

/**
* GET a user profile
*/
exports.get_profile = function(req, res, next)
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
exports.update_user = function(req, res, next)
{
	user.first_name = req.body.first_name;
	user.last_name = req.body.last_name;
	user.email = req.body.email;

	res.send(user);
}

/*
*	Get the addresses for a specific user
*/
exports.get_address_list = function(req, res, next)
{	
	connection.query('select * from address where is_active = 1 and client_id = '+connection.escape(req.param('id')), function(err, rows){
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

/**
* GET a single address
*/
exports.get_address = function(req, res, next)
{
  var query = "select * from address where is_active = 1 and address_id = " +connection.escape(req.params.id);
  connection.query(query, function(err, rows)
  {
    res.send(rows[0]);
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

exports.get_creditcard = function (req, res, next)
{
  var query = "select * from credit_card natural join (select address_1, address_2, city, state, zip_code, country, address_id as billing_address from address) as t1 where cc_id = "
  + connection.escape(req.params.id);
  connection.query(query, function(err, rows)
  {
          send_data = {
          id : rows[0].cc_id,
          number : rows[0].cc_number.substring(12),
          type : rows[0].cc_type,
          address_1 : rows[0].address_1,
          address_2 : rows[0].address_2,
          city : rows[0].city,
          state : rows[0].state,
          zip_code : rows[0].zip_code,
          exp_date : rows[0].cc_exp_date,
          holder : rows[0].cc_holder,
          country : rows[0].country
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

}

/**
* GET a list of all the users credit cards that are active.
**/
exports.get_creditcard_list = function(req, res, next)
{	;
	var query = 'select cc_id, cc_number, cc_type, cc_exp_date, cc_holder, address_1, address_2, city, state, country, zip_code, is_primary from credit_card natural join (select address_id as billing_address, address_1, address_2, city, zip_code, country, state from address) as t1 where credit_card.is_active = 1 and client_id = '
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
          id : rows[i].cc_id,
					number : rows[i].cc_number.substring(12),
					type : rows[i].cc_type,
					address_1 : rows[i].address_1,
					address_2 : rows[i].address_2,
					city : rows[i].city,
					state : rows[i].state,
					zip_code : rows[i].zip_code,
					exp_date : rows[i].cc_exp_date,
					holder : rows[i].cc_holder,
					country : rows[i].country,
          primary : rows[i].is_primary
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

/**
* POST a new address for a specific user
**/
exports.add_address = function(req, res, next)
{
  var query = 'insert into address (address_1, address_2, city, zip_code, state, country, client_id, is_cc_active, is_active, is_primary) values ('
    + connection.escape(req.body.address1) + ', '
    + connection.escape(req.body.address2) + ', '
    + connection.escape(req.body.city) + ', '
    + connection.escape(req.body.zipcode) + ', '
    + connection.escape(req.body.state) + ', '
    + connection.escape(req.body.country) + ', '
    + connection.escape(parseInt(req.params.id)) + ', 0, 1, 0)';

	connection.beginTransaction( function (err)
  {
    if (err)
      throw err;
    connection.query( query, function (err, results) 
    {
      console.log(results);
      if (err)
      {
        //If the insertion fails, rollback query
        connection.rollback( function () 
        {
          console.log('first rollback')
          throw err;
        });
      }
      //Commit the changes. 
      connection.commit( function (err)
      {
        if (err)
        {
          //If commit fails, rollback insertion
          connection.rollback( function (){
            throw err;
          });
        }
        console.log('Record inserted');
        res.send(200);
      });
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

/**
* DELETE a single address
*/
exports.delete_address = function(req, res, next)
{
	var query = "update address set is_active = 0 where address_id = " + connection.escape(req.params.id);
  connection.query(query, function (err, data)
  {
    if (!err)
    {
      res.send(200);
    }
    else 
      res.send(500);
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
* POST a new credit card for a user.
*/
exports.add_creditcard = function (req, res, next)
{ 
  var address_query = 'insert into address (address_1, address_2, city, zip_code, state, country, client_id, is_primary, is_cc_active, is_active) values ('
    + connection.escape(req.body.billing_address1) + ', '
    + connection.escape(req.body.billing_address2) + ', '
    + connection.escape(req.body.billing_city) + ', '
    + connection.escape(req.body.billing_zipcode) + ', '
    + connection.escape(req.body.billing_state) + ', '
    + connection.escape(req.body.billing_country) + ', '
    + connection.escape(parseInt(req.params.id)) + ', 0, 1, 0)';

  connection.beginTransaction( function(err)
  {
    if (err) { throw err; }

    connection.query(address_query, function (err, result)
    {
      if (err) {
        console.log(err);
        connection.rollback( function() {
          throw err;
        });
      };

      var creditcard_query = 'insert into credit_card (client_id, billing_address, cc_number, cc_type, cc_holder, cc_exp_date, is_primary, is_active) values ('
        + connection.escape(req.params.id) + ', '
        + connection.escape(result.insertId) + ', '
        + connection.escape(req.body.billing_cc_number) + ', '
        + connection.escape(req.body.billing_cc_type) + ', '
        + connection.escape(req.body.billing_cc_card_holder) + ', '
        + connection.escape(req.body.billing_cc_exp_date) + ', 0, 1)'; 

      connection.query(creditcard_query, function(err, result2){
        if (err)
        {
          connection.rollback( function() {
            throw err;
          });
        }

        connection.commit( function (err) {
          if (err) {
            connection.rollback(function() {
              throw err;
            });
          }

          res.send(200);

        });
      });
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

/**
* DELETE a credit card
**/
exports.delete_creditcard = function (req, res, next)
{
  var query = 'update credit_card set is`_active = 0 where cc_id = ' + connection.escape(req.params.id);
  connection.query(query, function (err, rows)
  {
    if (!err)
    {
      res.send(200);
    }
    else
      res.send(500);
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

/**
* GET all notifications belonging to a user
**/
exports.get_notifications = function(req, res,err)
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

/**
* GET all the bids belonging to a single user
**/
exports.get_bids = function(req, res, err)
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

/**
* GET all the listings belonging to a user.
**/
exports.get_listings = function(req, res, err)
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

/**
* GET all offers made on a users listings
**/
exports.get_offers = function(req, res, err)
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

/**
* GET all invoices belonging to a user
**/
exports.get_invoices = function(req, res, err){
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
* GET single invoice information
**/
exports.get_single_invoice = function(req, res, err){
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

exports.address_make_primary = function(req, res, next) {


   var clear_primaries = 'update address set is_primary = 0 where client_id = ' + req.params.id;

   var set_primary = 'update address set is_primary = 1 where address_id = ' + req.body.current_address;

   connection.beginTransaction( function (err) {
    if (err) {
      connection.rollback( function() {
        throw err;
      });
    }

    connection.query(clear_primaries, function (err, first_result) {
      if (err) {
        connection.rollback( function() {
          throw err;
        });
      }

      connection.query(set_primary, function (err, second_result) {
        if (err) {
          connection.rollback( function () {
            throw err;
          });
        }

        connection.commit( function (err) {
          if (err) {
            connection.rollback(function() {
              throw err;
            });
          }; 
          res.send(200);
        });
      });
    });
  });


};

exports.creditcard_make_primary = function (req, res, next) {

  var clear_primaries = 'update credit_card set is_primary = 0 where client_id = ' + req.params.id;

  var set_primary = 'update credit_card set is_primary = 1 where cc_id = ' + req.body.current_creditcard;

  connection.beginTransaction( function (err) {
    if (err) {
      connection.rollback( function() {
        throw err;
      });
    }

    connection.query(clear_primaries, function (err, first_result) {
      if (err) {
        connection.rollback( function() {
          throw err;
        });
      }

      connection.query(set_primary, function (err, second_result) {
        if (err) {
          connection.rollback( function () {
            throw err;
          });
        }

        connection.commit( function (err) {
          if (err) {
            connection.rollback(function() {
              throw err;
            });
          };

          res.send(200);
        });
      });
    });
  });
};




