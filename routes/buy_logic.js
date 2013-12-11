var database = require('./database.js');
var connection = database.connect_db();
var async = require('async');

//var serverURL = "http://localhost:5000";


/*
 * Gets the remaining balance of an user. Parameter to be passed is the client_id
 */
exports.get_balance = function(req, res, next){
	connection.query('select * from bank_account where account_owner = ' + connection.escape(req.params.parameter), function(err, rows){
		if(!err){
			console.log('Getting the balance from db...');
			res.send(rows);
			console.log(rows);
		}
		else{
			console.log(err);
			res.send({error : 'Not found'});
		}
	});

	connection.on('error', function(err){
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

/*
 * Deactivates a listing so that it cannot be shown in a search and be buyable. It can still be viewed.
 * Parameter to be passed is the listing_id.
 */
exports.deactivate_listing = function(req, res, next){
	
	var update_listing_query = 'update listing set listing_is_active = 0 where listing_id = ' + connection.escape(req.params.parameter);


	connection.beginTransaction(function(err) {
			if (err) { 
				throw err; 
			}
			
			connection.query(update_listing_query, function(err, result) {
			
			if (err) { 
					connection.rollback(function() {
						throw err;
					});
			}

			connection.commit(function(err){
				if(err){
					connection.rollback(function(){
						throw err;
					});
				}

				res.send(200);
			});

			
			});
	});


	connection.on('error', function(err){
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

exports.insert_to_bucket = function(req, res, next){
	var client_listing_id_string = req.params.parameter;
	var client_id = '';
	var listing_id = '';
	var stop;
	for(var i = 0; client_listing_id_string.substring(i, i+1) != "_"; i++){
		client_id = client_id + client_listing_id_string.substring(i, i+1);
		stop = i+2;
	}
	listing_id = client_listing_id_string.substring(stop, client_listing_id_string.length);

	var insert_to_bucket_query = 'insert into bucket (listing_id, client_id) values (' + connection.escape(listing_id) + ', ' + connection.escape(client_id) + ')';
	connection.beginTransaction(function(err) {
			if (err) { 
				throw err; 
			}
			
			connection.query(insert_to_bucket_query, function(err, result) {
			
			if (err) { 
					connection.rollback(function() {
						throw err;
					});
			}

			connection.commit(function(err){
				if(err){
					connection.rollback(function(){
						throw err;
					});
				}

				res.send(200);
			});
			
			});
	});

	connection.on('error', function(err){
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


exports.drop_from_bucket = function(req, res, next){
	var client_listing_id_string = req.params.parameter;
	var client_id = '';
	var listing_id = '';
	var stop;
	for(var i = 0; client_listing_id_string.substring(i, i+1) != "_"; i++){
		client_id = client_id + client_listing_id_string.substring(i, i+1);
		stop = i+2;
	}
	listing_id = client_listing_id_string.substring(stop, client_listing_id_string.length);


	var delete_entry_from_bucket = 'delete from bucket where listing_id = ' + connection.escape(listing_id) + ' and client_id = ' + connection.escape(client_id);
	connection.beginTransaction(function(err) {
			if (err) { 
				throw err; 
			}
			
			connection.query(delete_entry_from_bucket, function(err, result) {
			
			if (err) { 
					connection.rollback(function() {
						throw err;
					});
			}

			connection.commit(function(err){
				if(err){
					connection.rollback(function(){
						throw err;
					});
				}

				res.send(200);
			});
			
			});
	});


	connection.on('error', function(err){
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


exports.insert_notification = function(req, res, next){

  var new_cid = '';
  var new_lid = '';


  var client_listing_id_string = req.params.parameter;
  var stop;
  for(var i = 0; client_listing_id_string.substring(i, i+1) != "_"; i++){
    new_cid = new_cid + client_listing_id_string.substring(i, i+1);
    stop = i +2;
  }
  var new_lid = client_listing_id_string.substring(stop, client_listing_id_string.length);


  var new_message = "You have sold ";
  
  
 


  connection.beginTransaction(function(err) {
     
      if (err) { 
        throw err; 
      }
      
       connection.query('select * from listing natural join item where listing_id = ' + new_lid, function(err, rows){

    if(!err){
      console.log(rows);
      new_message = new_message + rows[0].item_name;

      var insert_notification_query = 'insert into user_notifications (client_id, listing_id, is_read, notification_message, notification_date, title) values ('+ connection.escape(new_cid) + 
       ', '+ connection.escape(new_lid) + ', 0, "' + connection.escape(new_message) + '", now(), "Sold")';

      console.log(insert_notification_query);

      connection.query(insert_notification_query, function(err, result) {
      
      if (err) { 
          connection.rollback(function() {
            throw err;
          });
      }
      
      connection.commit(function(err){
        if(err){
          connection.rollback(function(){
            throw err;
          });
        }

        res.send(200);
      });
      
      });

    }
    else{
      console.log(err);
      res.send({error : 'Not found'});
    }
  });
  

        });


  connection.on('error', function(err){
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


exports.purchase_bucket = function (req, res, next) {

  var listings = 'select listing_id, seller_id, price from listing natural join (select listing_id from bucket where client_id = ' + connection.escape(req.params.id) + ') as t1';
  
  var purchased_items = 'update listing set listing_is_active = 0 where listing_id in (select listing_id from bucket where client_id = ' + connection.escape(req.params.id) + ')';

  var get_client = 'select * from address natural join credit_card where is_primary = 1 and client_id = ' + connection.escape(req.params.id);

  var remove_from_bucket = 'update bucket set is_active = 0 where client_id = ' + connection.escape(req.params.id);

  connection.beginTransaction( function (err) {
    if (err) {
      connection.rollback( function () {
        throw err;
      });
    };

    //Get from the bucket, which items we are going to be purchasing 
    connection.query(listings, function (err, first_result) {

      if (err) {
        connection.rollback( function () {
          throw err;
        });
      }

      //console.log(first_result);
      
      var values = '';
      var final_query;

      for(var i = 0; i < first_result.length; i++) {

          values = values + '(' + first_result[i].seller_id + ', ' + first_result[i].listing_id + ', 0, "Item sold", now() , "Sold"), ';
      }

      final_query = 'insert into user_notifications (client_id, listing_id, is_read, notification_message, notification_date, title) values ' + values.slice(0, values.length - 2);

      //Marked items as purchased in the listings table
      connection.query(purchased_items, function (err, second_result) {
        if (err) {
          connection.rollback( function () {
            throw err;
          });
        }

        //Insert the notifications
        connection.query(final_query, function (err, third_result) {
          if (err) {
            connection.rollback( function () {
              throw err;
            });
          }

          //Get some of the client information
          connection.query(get_client, function (err, fourth_result) {

            if (err) {
              connection.rollback( function () {
                throw err;
              });
            }

            var values2 = '';
          
            for(var k = 0; k < first_result.length; k++) {
    
              values2 = values2 + '(now(), ' + first_result[k].price + ', ' + connection.escape(req.params.id) + ', ' 
                + first_result[k].listing_id + ', ' + fourth_result[0].cc_id + ', ' + fourth_result[0].address_id + '), ';
            }
    
             var invoices = 'insert into invoice (invoice_date, final_price, buyer_id, listing_id, credit_card, shipping_address) values ' + values2.slice(0, values2.length - 2);
            
            //Add invoices for each of the purchased items.
            connection.query(invoices, function (err, fifth_result) {
              if (err) {
                connection.rollback( function () {
                  throw err;
                });
              }

              //Remove the items from the DB bucket
              connection.query(remove_from_bucket, function (err, sixth_result) {
                if (err) {
                  connection.rollback( function () {
                    throw err;
                  })
                }

                connection.commit( function (err) {
                if (err) {
                  connection.rollback( function () {
                    throw err;
                  });
                }

                res.send(200);
              });
              });
            });
          });

          });
        });
      });
    });
  
  connection.on('error', function(err){
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

exports.purchase_item = function (req, res, next) {

  var update_listing = 'update listing set listing_is_active = 0 where item_id = ' + connection.escape(req.params.id);

  var get_user_information = 'select * from address natural join credit_card where is_primary = 1 and client_id = ' + connection.escape(req.body.id);

  var get_listing_information = 'select seller_id, listing_id, price from listing where item_id = ' + connection.escape(req.params.id);

  connection.beginTransaction( function (err) {

    if (err) {
      connection.rollback( function () {
        throw err;
      });
    }

    //Update listing so that it's longer active.
    connection.query(update_listing, function (err, first_result) {

      if (err) {
        connection.rollback( function () {
          throw err;
        });
      }

      //Get the users information, credit card and address
      connection.query(get_user_information, function (err, second_result) {


        if (err) {
          connection.rollback( function () {
            throw err;
          });
        }

        connection.query(get_listing_information, function (err, third_result) {

          if (err) {
            connection.rollback( function() {
              throw err;
            });
          }

          var invoice = 'insert into invoice (invoice_date, final_price, buyer_id, listing_id, credit_card, shipping_address) values (now(), ' +third_result[0].price + ', '
            + connection.escape(req.body.id) + ', ' + third_result[0].listing_id + ', ' + second_result[0].cc_id + ', ' + second_result[0].address_id + ')';

          var notification = 'insert into user_notifications (client_id, listing_id, is_read, notification_message, notification_date, title) values (' 
            + third_result[0].seller_id + ', ' + third_result[0].listing_id + ', 0, "Item sold", now(), "Sold")';

          connection.query(invoice, function (err, fourth_result) {

            if (err) {
              connection.rollback( function() {
                throw err;
              });
            }

            connection.query(notification, function (err, fifth_result) {

              if (err) {
                connection.rollback( function () {
                  throw err;
                });
              }

              connection.commit( function (err) {

                if (err) {
                  connection.rollback( function () {
                    throw err; 
                  });
                }
                res.send(200);
              });
            });
          });
        });

      });

    });
  });

connection.on('error', function(err){
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

exports.insert_ranking = function(req, res, next){
	var ranker_rakee_rank_string = req.params.parameter;

	var ranker_id = ranker_rakee_rank_string.split('_')[0];
	var rankee_id = ranker_rakee_rank_string.split('_')[1];
	var rank = ranker_rakee_rank_string.split('_')[2];

	var insert_ranking_query = 'insert into user_ranking (ranker_id, rankee_id, rank) values (' + connection.escape(ranker_id) + ', ' + connection.escape(rankee_id) + ', ' + connection.escape(rank) + ')';

	connection.beginTransaction(function(err) {
			if (err) { 
				throw err; 
			}
			
			connection.query(insert_ranking_query, function(err, result) {
			
			if (err) { 
					connection.rollback(function() {
						throw err;
					});
			}

			connection.commit(function(err){
				if(err){
					connection.rollback(function(){
						throw err;
					});
				}

				res.send(200);
			});
			
			});
	});
	connection.on('error', function(err){
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

exports.update_balance = function(req, res, next){
	var client_balance_string = req.params.parameter;
	var client_id = "" + client_balance_string.split("_")[0];
	var amount = "" + client_balance_string.split("_")[1];
	var sales;

	connection.beginTransaction(function(err) {
		if (err) throw err;

		connection.query('select account_total as amount, total_sales from bank_account where account_owner = ' + connection.escape(client_id), function(err, rows){
			if(!err){
				amount = +(rows[0].amount) + +(amount);
				sales = rows[0].total_sales + 1;

				var update_balance_query = 'update bank_account set account_total = ' + connection.escape(amount) + ', total_sales = ' + connection.escape(sales) + ' where account_owner = '+ connection.escape(client_id);
				connection.query(update_balance_query, function(err, result) {

					if (err) { 
						connection.rollback(function() {
							throw err;
						});
					}

					connection.commit(function(err){
						if(err){
							connection.rollback(function(){
								throw err;
							});
						}

						res.send(200);
					}); 
				});

			}

		});




		connection.on('error', function(err){
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
	});
}


exports.rank_single_purchase = function (req, res, next) {

  var get_listing_information = 'select * from listing where item_id = ' + connection.escape(req.params.id);

  connection.beginTransaction( function (err) {

    if (err) {
      connection.rollback( function () {
        throw err;
      });
    }

    connection.query(get_listing_information, function (err, first_result) {

      if (err) {
        connection.rollback( function () {
          throw err;
        });
      }

      var rank = 'insert into user_ranking (ranker_id, rankee_id, rank) values (' + connection.escape(req.body.user_id) + ', ' + first_result[0].seller_id + ', ' +connection.escape(req.body.rating) + ')';

      connection.query(rank, function (err, second_result) {

        if (err) {
          connection.rollback( function () {
            throw err;
          });
        }

        connection.commit( function (err) {

          if (err) {
            connection.rollback( function () {
              throw err;
            });
          }

          res.send(200)
        });
      });
    });
  });

};

exports.rank_bucket_purchase = function (req, res, next) {

  var get_listing_information = 'select * from listing where item_id = ' + connection.escape(req.body.item_id);

  connection.beginTransaction( function (err) {

    if (err) {
      connection.rollback( function () {
        throw err;
      });
    }

    connection.query(get_listing_information, function (err, first_result) {

      if (err) {
        connection.rollback( function () {
          throw err;
        });
      }

      var rank = 'insert into user_ranking (ranker_id, rankee_id, rank) values (' + connection.escape(req.params.id) + ', ' + first_result[0].seller_id + ', ' +connection.escape(req.body.rating) + ')';

      connection.query(rank, function (err, second_result) {

        if (err) {
          connection.rollback( function () {
            throw err;
          });
        }

        connection.commit( function (err) {

          if (err) {
            connection.rollback( function () {
              throw err;
            });
          }

          res.send(200)
        });
      });
    });
  });
};


