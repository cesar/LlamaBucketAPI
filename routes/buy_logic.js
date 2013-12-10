var database = require('./database.js');
var connection = database.connect_db();
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

      var insert_notification_query = 'insert into user_notifications (client_id, listing_id, is_read, notification_message, notification_date, title)values ('+ connection.escape(new_cid) + 
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