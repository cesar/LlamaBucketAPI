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

    	var log = 'Post ' + result.insertId + ' added';

    	connection.query('INSERT INTO log SET data=?', log, function(err, result) {
     		if (err) { 
        		connection.rollback(function() {
          			throw err;
        		});
      		}  
      		connection.commit(function(err) {
        		if (err) { 
          			connection.rollback(function() {
		            	throw err;
        				});
        			}
        		console.log('success!');
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

}