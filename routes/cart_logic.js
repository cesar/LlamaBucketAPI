
var cart_items =
{
	content:[
	{

		name: "Baby Sloth",
		description: "Baby sloth up for adoption, sign in your papers today!",
		image: "http://goo.gl/ffICmz",
		price: 40
			},
		{

		name: "iWallet",
		description: "New and improved Apple Leather iWallet",
		image: "http://goo.gl/h6GYBh",
		price: 210
	}



	]
};

var get_cart = function(req, res, err)
{
	res.send(cart_items);
}

exports.get_cart = get_cart;