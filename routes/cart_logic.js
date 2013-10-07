
var user_data =
{
	content:[
	{

		name: "Baby Sloth",
		description: "Baby sloth, only 3 months old!",
		image: "http://goo.gl/ffICmz",
		price: 40
	},
		{

		name: "iWallet",
		description: "New and improved Apple Leather iWallet",
		image: "http://goo.gl/uMaaZq",
		price: 210
	}
	],
	address:
	[
	{
		address_one: "Calle Reina Maria 139",
		address_two: "Urb. La Villa de Torrimar",
		city: "Guaynabo",
		zipcode: "00969",
		country: "Puerto Rico"
	}

	],
	credit_cards:
	[
		{
			credit_card_number: 1234565687871929,
			cardholder: "John Smith",
			expiration_date: "08/16",
			type: "Visa"

		}
	]
};


var get_address = function(req,res, err)
{
	res.send(user_data);
}
var get_cart = function(req, res, err)
{
	res.send(user_data);
}

var add_to_cart = function(req, res, next)
{
	req.body.price = parseFloat(req.body.price);
	user_data.content.push(req.body);
	res.send(200);
}

var remove = function(req, res, next)
{
	for(var i = 0; i < user_data.content.length; i++)
	{
		if(user_data.content[i].name == req.body.name)
		{
			user_data.content.splice(i, 1);
		}
	}
	res.send(200);
}
exports.get_cart = get_cart;
exports.get_address = get_address;
exports.add_to_cart = add_to_cart;
exports.remove = remove;
