var database = require('./database.js');


var connection = database.connect_db();

var get_item = function(req, res, next){
	

		connection.query('select *, count(B.listing_id) as bid_count from bidding_history as B RIGHT JOIN (select * from listing natural join item natural join client natural join address natural join category where item_id ='
      +connection.escape(req.params.parameter)+' and item_category = cat_id) as T ON address_id = src_address and B.listing_id = T.listing_id group by T.listing_id',function(err, rows){
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

exports.get_item = get_item;