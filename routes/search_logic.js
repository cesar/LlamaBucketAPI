/*
*	Ideally this is how the items will be passed to the client side.
*/
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

/*
* This is what the categories will be once the query is made, each category is a JSON containing an id, the category and it's parent category's id. 
*/
var categories = {
	content : [
	{ id : 1, category : "Books", parent : null},
	{ id : 2, category : "Electronics", parent : null},
	{ id : 3, category : "Computers", parent : null},
	{ id : 4, category : "Clothing", parent : null},
	{ id : 5, category : "Shoes", parent : null},
	{ id : 6, category : "Sports", parent : null},
	{ id : 7, category :  "Toys", parent : null},
	{ id : 8, category : "Children", parent : 1},
	{ id : 9, category : "Fiction", parent : 1},
	{ id : 10, category : "Technology", parent : 1},
	{ id : 11, category : "Business", parent : 1},
	{ id : 12, category : "TV", parent : 2},
	{ id : 13, category : "Audio", parent : 2},
	{ id : 14, category : "Phones", parent : 2},
	{ id : 15, category : "Cameras", parent : 2},
	{ id : 16, category : "Videos", parent : 2},
	{ id : 17, category : "Laptops", parent : 3},
	{ id : 18, category : "Desktops", parent : 3},
	{ id : 19, category : "Tablets", parent : 3},
	{ id : 20, category : "Printers", parent : 3},
	{ id : 21, category : "Children", parent : 4},
	{ id : 22, category : "Men", parent : 4},
	{ id : 23, category : "Shirts", parent : 22},
	{ id : 24, category : "Pants", parent : 22},
	{ id : 25, category : "Socks", parent : 22},
	{ id : 26, category : "Women", parent : 4},
	{ id : 27, category : "Shirts", parent : 26},
	{ id : 28, category : "Pants", parent : 26},
	{ id : 29, category : "Dresses", parent : 26},
	{ id : 30, category : "Children", parent : 5},
	{ id : 31, category : "Men", parent : 5},
	{ id : 32, category : "Women", parent : 5},
	{ id : 33, category : "Bycicles", parent : 6},
	{ id : 34, category : "Frames", parent : 33},
	{ id : 35, category : "Wheels", parent : 33},
	{ id : 36, category : "Helmet", parent : 33},
	{ id : 37, category : "Parts", parent : 33},
	{ id : 38, category : "Children", parent : 4},
	{ id : 39, category : "Fishing", parent : 6},
	{ id : 40, category : "Baseball", parent : 6},
	{ id : 41, category : "Golf", parent : 6},
	{ id : 42, category : "Basketball", parent : 6}
	]
}

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

		var send_data = { content : []};

		//Here is where the DB query should normally go.
		//NOTE: Makes this asynchronous later.
		for (var i = items.content.length - 1; i >= 0; i--) {
			console.log(items.content[i].category);
			if(items.content[i].category == cat)
			{
				//Push the items that belong to the selected category into the array.
				send_data.content.push(items.content[i]);
			}
		};
		res.send(send_data);
	}

	else if(query_parameter.search(re_search_by_name) >= 0)
	{
		var search_terms = query_parameter.split(separator);
		var item_name = new RegExp(search_terms[1]);

		var send_data = { content : []};

		for (var i = items.content.length - 1; i >= 0; i--) {
			if(items.content[i].name.toLowerCase().replace(/\s/g, '').search(item_name) >= 0)
			{
				send_data.content.push(items.content[i]);
			}
		};
		res.send(send_data);
	}
	
}

var get_categories = function(req, res, next)
{
	res.send(categories);
}

//Fetch the subcategories from the categories table
var get_subcategories = function(req, res, next)
{
	var send_data = { content : [], parent_name : null};

	//Choose only the categories that have the current category as a parent.
	for(var i = 0; i < categories.content.length; i++)
	{
		if(categories.content[i].parent == req.param('parent_id'))
		{
			send_data.content.push(categories.content[i]);
		}
		//Send the parent category list to the client.
		if(categories.content[i].id == req.param('parent_id'))
		{
			send_data.parent_name = categories.content[i].category;
		}	
	}

	res.send(send_data);
}

exports.get_results = get_results;
exports.get_categories = get_categories;
exports.get_subcategories = get_subcategories;


