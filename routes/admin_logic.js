//Some generic user information, loosely based on the information the app would get from the DB.
var users = {
	content : [
		{
		userId : 0,
		firstname : "Cesar",
		lastname : "Cruz",
		email: "cesar.cruz5@upr.edu",
		phone : "1234567890", 
		address : "Somewhere",
		isAdmin : 1
		},
		{
		userId : 1,
		firstname : "Luis",
		lastname : "Medina",
		email: "luis.medina14@upr.edu",
		phone : "1234567890", 
		address : "Over",
		isAdmin : 1
		},
		{
		userId : 2,
		firstname : "Jose",
		lastname : "Martinez",
		email: "jose.martinez60@upr.edu",
		phone : "1234567890", 
		address : "The",
		isAdmin : 1
		},
		{
		userId : 3,
		firstname : "Pepa",
		lastname : "Jimenez",
		email: "locolocalokita@aol.com",
		phone : "1234567890", 
		address : "Rainbow",
		isAdmin : 0
		}]
	}

//Not representative of an official report. Mainly used to show functionality of the report display.
var report = {
	content : [{
	report_name : "Sales from 31/10/2013",
	itemA : "Ipad",
	sellerA : "Pepa",
	buyerA  : "Fernan",
	priceA : "200",
	itemB : "Iphone",
	sellerB : "Pepa",
	buyerB : "Fernan",
	priceB: "200",
	itemC : "Ipad Mini",
	sellerC : "Fernan",
	buyer : "Pepa",
	priceC : "150",
	itemD : "Ipod Touch",
	sellerD : "Luis",
	buyerD : "Jose",
	priceD : "9999.99"

	}]
}

var get_users = function(req, res, next){
	res.send(users.content);
}
var get_individual = function(req, res, next){
	res.send(users.content[req.params.parameter]);
}
var get_report = function(req, res, next){
	res.send(report.content);
}
exports.get_report = get_report;
exports.get_individual = get_individual;
exports.get_users = get_users;