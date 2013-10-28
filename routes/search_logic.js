/*
*	Ideally this is how the items will be passed to the client side.
*/

var mysql = require('mysql');

var connection = mysql.createConnection({
  host : process.env.CLEARDB_DATABASE_URL,  //Set up the database connection host
  user : process.env.CLEARDB_DATABASE_USERNAME, //Username
  password : process.env.CLEARDB_DATABASE_PASSWORD,  //Password
  database : process.env.CLEARDB_DATABASE,  //database name
});




var get_results = function(req, res, next)
{
	//Regular expression for matching a category
	var re_category = /category/;
	var re_search_by_name = /item_name/;

	//Regular expression to separate the category number.
	var separator = /=/;

	//Determine if its a category or a name
	var query_parameter = req.params.parameter;

	if(query_parameter.search(re_category) >= 0)
	{

		//Get the actual category.
		var category_id = query_parameter.split(separator);
		var cat = parseInt(category_id[1]);

		//Here is where the DB query should normally go.
		//NOTE: Makes this asynchronous later.
		connection.query('select * from item where item_category = '+connection.escape(cat), function(err, rows){
				res.send({content : rows});
		});
	}

	else if(query_parameter.search(re_search_by_name) >= 0)
	{
		var search_terms = query_parameter.split(separator);

		search_terms = '%' + search_terms[1] + '%'
		
		connection.query('select * from item where item_name like '+connection.escape(search_terms), function(err, rows){
			if(!err)
				res.send({content : rows});
			else
				console.log(err);
		});
	}
	
}

//Get all the categories from the database and send them to the server.
var get_categories = function(req, res, next)
{
	connection.query('select * from category', function(err, rows){
		if(!err)
			res.send({content : rows});
		else
			console.log(err);
	});
}


//Fetch the subcategories from the categories table
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
}

var get_category = function(req, res,next)
{
	var id = req.param('id');

	connection.query('select * from category where cat_id = '+connection.escape(id), function(err, row){
		if(!err)
			res.send(row[0]);
		else
			console.log(err);
	});
}

var add_category = function(req, res, next)
{
	connection.query('insert into category (category_name, parent_id) values('+connection.escape(req.body.category)+', '+connection.escape(req.body.parent)+')', function(err, result){
		console.log(result);
	})

	res.send(200);

}

//Export functions
exports.add_category = add_category;
exports.get_category = get_category;
exports.get_results = get_results;
exports.get_categories = get_categories;
exports.get_subcategories = get_subcategories;


