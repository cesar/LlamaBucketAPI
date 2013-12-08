var database = require('./database.js');

var path = require('path');

var connection = database.connect_db();

var get_item = function(req, res, next){
  console.log(req.params);
  var get_item_query = 'select *, count(B.listing_id) as bid_count from bidding_history as B RIGHT JOIN (select * from listing natural join item natural join client natural join address natural join category where item_id ='
    +connection.escape(req.params.parameter)+' and item_category = cat_id) as T ON  B.listing_id = T.listing_id group by T.listing_id';
console.log(get_item_query);
connection.query(get_item_query,function(err, rows){
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

var get_item_picture = function (req, res, next) {
  res.sendfile(path.resolve('./uploads/' + req.params.parameter));
}; 

exports.get_item = get_item;
exports.get_item_picture = get_item_picture;