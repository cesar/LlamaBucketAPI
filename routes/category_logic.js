/*
* ============================================
* Server side logic related to the categories |
* ============================================
*/

var database = require('./database.js');


var connection = database.connect_db();
/*
* Get all the categories from the database
* Send them to the client
*/
var get_categories = function(req, res, next)
{
  connection.query('select * from category', function(err, rows){
    if(!err)
      res.send({content : rows});
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

/*
* Get all subcategories from the database.
* Subcategories are required to have a parent_id 
*/
var get_subcategories = function(req, res, next)
{
  var send_data = { content : [], parent_name : null};

  //Get the subcategories
  connection.query('select * from category where parent_id = '+connection.escape(req.param('parent_id')), function(err, rows){
    send_data.content = rows;

    //Get the subcategory parent category
    connection.query('select * from category where cat_id = '+connection.escape(req.param('parent_id')), function(err2, rows2){
      
      send_data.parent_name = rows2[0].category_name;
      
      res.send(send_data);
    })
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

/*
* Get a specific category from the database
*/
var get_category = function(req, res,next)
{
  var id = req.param('id');

  connection.query('select * from category where cat_id = '+connection.escape(id), function(err, row){
    if(!err)
      res.send(row[0]);
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
/*
* =================================================================== Use transactions ?
*
*/

/*
* Add a category to the list of categories.
*/
var add_category = function(req, res, next)
{
  connection.query('insert into category (category_name, parent_id) values('+connection.escape(req.body.category)+', '+connection.escape(req.body.parent)+')', function(err, result){
    console.log(result);
  })

}



exports.add_category = add_category;
exports.get_category = get_category;
exports.get_categories = get_categories;
exports.get_subcategories = get_subcategories;

