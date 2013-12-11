3var database = require('./database.js');


var connection = database.connect_db();
//var serverURL = "http://localhost:5000";

var insert_invoice = function(req, res, next){

	var datetime = new Date();
	var insert_year = datetime.getFullYear();
	var insert_date = datetime.toUTCString();
	var insert_month = datetime.getMonth() + 1;
	var insert_week = Math.ceil(datetime.getDate()/7);
	var insert_day = datetime.getDate();

	var insert_buyer = "";
	var insert_credit_card;
	var insert_address;
	var insert_price;
	var insert_seller;
	var insert_listing_id;	


	//Get the buyer, l id, cc, and address from the parameter and a select *
	var client_item_id_string = req.params.parameter;
	var stop;

	for(var i = 0; client_item_id_string.substring(i, i+1) != "_"; i++){
		insert_buyer = insert_buyer + client_item_id_string.substring(i, i+1);
		stop = i +2;
	}
	var item_id = client_item_id_string.substring(stop, client_item_id_string.length);



	var temp_select_query = "select * from listing natural join item where item_id = " + item_id;
	connection.query(temp_select_query, function(err, rows){
		insert_listing_id = rows.listing_id;
		insert_price = rows.price;
		insert_seller = rows.seller_id;

	});

	temp_select_query = "select * from client natural join address natural join credit_card where client_id = " + insert_buyer;
	connection.query(temp_select_query, function(err, rows){
		insert_credit_card = rows.cc_id;
		insert_address = rows.address_id;

	});


	var insert_invoice_query = "insert into invoice (invoice_date, final_price, seller_id, buyer_id, listing_id, credit_card, shipping_address, date_month, date_week, date_day, date_year) values (now()," + connection.escape(insert_price) + "," + connection.escape(insert_seller) + "," + connection.escape(insert_buyer) + "," + connection.escape(insert_listing_id) + "," + connection.escape(insert_credit_card) + "," + connection.escape(insert_address) + "," + connection.escape(insert_month) + "," + connection.escape(insert_week) + "," + connection.escape(insert_day) + "," + connection.escape(insert_year) +")";

	//transaction goes here

	connection.beginTransaction(function(err) {
	  	if (err) { 
	  		throw err; 
	  	}
  		
  		connection.query(insert_invoice_query, function(err, result) {
	    
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

exports.insert_invoice = insert_invoice;