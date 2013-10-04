var invoices = {
	content : [
	{
		invoiceId : 0,
		buyer : "Jose Martinez",
		seller : "Cesar Cruz",
		item : "Macbook Case: Crimson Red",
		price : "25.99",
		date : "October 3, 2013",
		time : "14:25"
	},
	{
		invoiceId : 1,
		buyer : "Luis Medina",
		seller : "Cesar Cruz",
		item : "Monster Energy Drink: Case of 24",
		price : "19.99",
		date : "October 2, 2013",
		time : "10:49"
	},
	{
		invoiceId : 2,
		buyer : "Jose Martinez",
		seller : "Luis Medina",
		item : "Toy Dinosaur",
		price : "5.55",
		date : "October 1, 2013",
		time : "08:59"
	},
	{
		invoiceId : 3,
		buyer : "Jose Martinez",
		seller : "Luis Medina",
		item : "Google Glass",
		price : "999.98",
		date : "September 11, 2013",
		time : "09:11"
	}]
}

var get_invoice = function(req, res, next){
	res.send(invoices.content);
}

exports.get_invoice = get_invoice;