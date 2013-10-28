/*
*	Ideally this is how the items will be passed to the client side.
*/
<<<<<<< Updated upstream
=======

var mysql = require('mysql');

var connection = mysql.createConnection({
  host : process.env.CLEARDB_DATABASE_URL,  //Set up the database connection host
  user : process.env.CLEARDB_DATABASE_USERNAME, //Username
  password : process.env.CLEARDB_DATABASE_PASSWORD,  //Password
  database : process.env.CLEARDB_DATABASE,  //database name
});


var items = {
	content : [
	{ id : 0,
	  name : "Sword",
	  description: "An authentic samurai sword, from acient Japan",
	  year : 09,
	  brand : "AJB",
	  general: "Don't know what goes here",
	  category : 7,
	  price : 1.30,
	  image : "http://images4.wikia.nocookie.net/__cb20130105173711/runescape/images/c/cb/Steel_sword_detail.png"
	},
	{ id : 1,
	  name : "Kick Ass Ball",
	  description: "This is one kickass ball",
	  year : 09,
	  brand : "CoolShiii",
	  general: "Don't know what goes here",
	  category : 7,
	  price : 2.35,
	  image : "http://static.giantbomb.com/uploads/scale_small/0/6393/528516-1ball2.jpg"
	},
	{ id : 2,
	  name : "Toy Car",
	  description: "A toy car with some stolen tires",
	  year : 09,
	  brand : "MadFos",
	  general: "Don't know what goes here",
	  category : 7,
	  price : 2.23,
	  image : "http://img.dooyoo.co.uk/GB_EN/orig/0/8/4/4/9/844993.jpg"
	},
	{ id : 3,
	  name : "Nexus 4",
	  description: "Because it's awesome!",
	  year : 09,
	  brand : "Google",
	  general: "Don't know what goes here",
	  category : 1,
	  price : 250.00,
	  image : "http://www.notebookcheck.net/fileadmin/_migrated/pics/nexus4-1_02.png"
	},
	{ id : 4,
	  name : "iPhone 5",
	  description: "Aww yeah, it's an iPhone",
	  year : 09,
	  brand : "Apple",
	  general: "Don't know what goes here",
	  category : 1,
	  price : 570.99,
	  image : "http://cdn.arstechnica.net/wp-content/uploads/2012/09/iphone5-intro.jpg"
	},
	{ id : 5,
	  name : "YouWantIt",
	  description: "You don't know what this is, but you want it.",
	  year : 09,
	  brand : "YouWantIt.Com",
	  general: "Don't know what goes here",
	  category : 5,
	  price : 0.01,
	  image : "http://cdn.bulbagarden.net/upload/thumb/7/7e/006Charizard.png/256px-006Charizard.png"
	},
	{ id : 6,
	  name : "Harry Potter: The Prisoner of Azkaban",
	  description: "Third Harry Potter book.",
	  year : 09,
	  brand : "Schoolastic",
	  general: "Don't know what goes here",
	  category : 9,
	  price : 0.01,
	  image : "http://upload.wikimedia.org/wikipedia/en/a/a0/Harry_Potter_and_the_Prisoner_of_Azkaban.jpg"
	},
	{ id : 7,
	  name : "Enders Game",
	  description: "This is a cool book I guess.",
	  year : 09,
	  brand : "YouWantIt.Com",
	  general: "Don't know what goes here",
	  category : 9,
	  price : 0.01,
	  image : "http://bibliomantics.files.wordpress.com/2012/01/enders-game.jpg"
	},
	{ id : 8,
	  name : "The Kanye Shirt",
	  description: "A white shirt, from the Kanye line of clothing",
	  year : 09,
	  brand : "YouWantIt.Com",
	  general: "Don't know what goes here",
	  category : 23,
	  price : 0.01,
	  image : "http://www.glamour.com/images/fashion/2013/07/kanye-west-white-t-shirt-w724.jpg"
	},
	{ id : 9,
	  name : "Funny Shirt",
	  description: "This is one funny shirt",
	  year : 09,
	  brand : "YouWantIt.Com",
	  general: "Don't know what goes here",
	  category : 23,
	  price : 0.01,
	  image : "http://www.adamedesigns.com/wp-content/uploads/2013/07/poopedtoday.jpg"
	},
	{ id : 10,
	  name : "LG TV",
	  description: "A TV",
	  year : 09,
	  brand : "YouWantIt.Com",
	  general: "Don't know what goes here",
	  category : 12,
	  price : 0.01,
	  image : "http://www.opb-equipment.com/images/categories/lg-tv.jpg"
	},
	{ id : 11,
	  name : "Xerox Printer",
	  description: "This printer, you will love",
	  year : 09,
	  brand : "YouWantIt.Com",
	  general: "Don't know what goes here",
	  category : 20,
	  price : 0.01,
	  image : "http://www.fujixeroxprinters.com.au/downloads/uploaded/DocuPrint%20CM205%20L%20closed_6330.jpg"
	},
	{ id : 12,
	  name : "Apple iPad",
	  description: "You don't know what this is, but you want it.",
	  year : 09,
	  brand : "YouWantIt.Com",
	  general: "Don't know what goes here",
	  category : 19,
	  price : 0.01,
	  image : "http://www.technobuffalo.com/wp-content/uploads/2012/12/ipad-mini-scaled-1.jpg"
	},
	{ id : 13,
	  name : "Windows Surface",
	  description: "Crappy tablet, cause windows 8.",
	  year : 09,
	  brand : "YouWantIt.Com",
	  general: "Don't know what goes here",
	  category : 19,
	  price : 0.01,
	  image : "http://www.xda-developers.com/wp-content/uploads/2013/01/MSSurface.jpg"
	},
	{ id : 14,
	  name : "Schiwm Bike Frame",
	  description: "Original replacement",
	  year : 09,
	  brand : "YouWantIt.Com",
	  general: "Don't know what goes here",
	  category : 34,
	  price : 0.01,
	  image : "http://www.selectism.com/news/wp-content/uploads/2008/11/schwinn-paramount-70-anniversary-frame-front.jpg"
	},
	{ id : 15,
	  name : "Color Socks",
	  description: "For you, you hipster",
	  year : 09,
	  brand : "YouWantIt.Com",
	  general: "Don't know what goes here",
	  category : 25,
	  price : 0.01,
	  image : "http://4.bp.blogspot.com/_KEDScn-6OGA/THe_8MpGhRI/AAAAAAAADTQ/GywfyfoM2e0/s1600/knee_high_striped_socks_bright_colors.jpg"
	},
	{ id : 16,
	  name : "Rebel Shirt",
	  description: "Something goes here",
	  year : 09,
	  brand : "YouWantIt.Com",
	  general: "Don't know what goes here",
	  category : 27,
	  price : 0.01,
	  image : "http://www3.images.coolspotters.com/photos/865160/princess-leia-rebel-t-shirt-profile.jpg"
	},
	{ id : 17,
	  name : "Callaway Golf Set",
	  description: "Signed by yo mama",
	  year : 09,
	  brand : "YouWantIt.Com",
	  general: "Don't know what goes here",
	  category : 41,
	  price : 0.01,
	  image : "http://ecx.images-amazon.com/images/I/51yPsp6e1EL.jpg"
	},
	{ id : 18,
	  name : "Suitcase",
	  description: "You'll get that job, trust us.",
	  year : 09,
	  brand : "YouWantIt.Com",
	  general: "Don't know what goes here",
	  category : 5,
	  price : 0.01,
	  image : "http://1.bp.blogspot.com/_MWG4tkTfz8M/SwvRjlHN66I/AAAAAAAAAVs/nKIUTHnKsFI/s320/Vintage_Suitcase_-_V%26M.jpg"
	},
	{ id : 19,
	  name : "MacBookPro Retina",
	  description: "Yes.",
	  year : 09,
	  brand : "YouWantIt.Com",
	  general: "Don't know what goes here",
	  category : 17,
	  price : 0.01,
	  image : "http://i.zdnet.com/blogs/macbook-pro-retina-display-ogrady.jpg"
	}]
}
>>>>>>> Stashed changes

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

<<<<<<< Updated upstream
connection.query('select * from category', function(err, rows){
	if(!err)
		res.send({content : rows});
	else
		console.log(err);
});
=======
connection.query('SELECT * FROM test', function(err, rows){
  console.log(rows);
  console.log(err);
});
	res.send(categories);
>>>>>>> Stashed changes
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


