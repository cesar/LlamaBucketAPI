var mysql = require('mysql');

var connection = mysql.createConnection({
	host : process.env.CLEARDB_DATABASE_URL,  //Set up the database connection host
  	user : process.env.CLEARDB_DATABASE_USERNAME, //Username
  	password : process.env.CLEARDB_DATABASE_PASSWORD,  //Password
  	database : process.env.CLEARDB_DATABASE,  //database name
});



/*
 * Basic method to get the users from the database
 */
var get_users = function(req, res, next){
	var datetime = new Date();
	connection.query('SELECT client_id, client_firstname, client_lastname, email, isAdmin FROM client', function(err, rows){
		console.log("Getting users from db...");
		res.send(rows);
		console.log(rows);
	});
}
var get_individual = function(req, res, next){
	var datetime = new Date();
	connection.query('SELECT client_id, client_firstname, client_lastname, email, phone, isAdmin, address_1, address_2, city, country, state, zip_code  FROM client natural join address WHERE address.is_primary = 1 and client.client_id=' + parseInt(req.params.parameter), function(err, rows){
		console.log("Getting user from db...");
		res.send(rows);
		console.log(rows);
	});
}

/*
 * Methods to get from the invoice table to start preparing reports
 */
var get_report_total_sales_day = function(req, res, next){
	var datetime = new Date();
	var thisYear = datetime.getFullYear();
	var thisDay = datetime.getDate();
	var thisMonth = datetime.getMonth() + 1;
	console.log(thisYear + "-" + thisMonth + "-" + thisDay);

	//Gets the invoices for today
	connection.query('select invoice.invoice_date as "Date", invoice.final_price as "Final_Price", client.client_id as "Seller_ID", concat(client.client_firstname, " ", client_lastname) as "Seller_Name", T.Buyer_ID as "Buyer_ID", T.Buyer_Name as "Buyer_Name", credit_card.cc_holder as "Holder", credit_card.cc_number as "Credit_Card_Number", credit_card.cc_type as "Type",  address.address_1 as "Shipping_Address_1", address.address_2 as "Shipping_Address_2", address.city as "City", address.state as "State", address.zip_code as "Zip_Code", address.country as "Country", listing.listing_id as "Listing_ID", item.item_name as "Item_Name", item.item_description as "Description" '+
		' from invoice natural join listing natural join client natural join credit_card natural join address natural join item natural join (select concat(client.client_firstname, " ", client_lastname) as "Buyer_Name", invoice.buyer_id as "Buyer_ID", invoice.invoice_id as "inv_id" from invoice natural join client where client.client_id = invoice.buyer_id) as T ' +
		' where date_month = ' + thisMonth + ' and date_year= ' + thisYear + ' and date_day = ' + thisDay + ' and invoice.seller_id = credit_card.client_id  and credit_card.is_primary = 1 and invoice.seller_id = client.client_id and T.Buyer_ID = invoice.buyer_id and T.inv_id = invoice.invoice_id', 
		function(err, rows){
		console.log("Getting invoices from DB...");
		res.send(rows);
		console.log(rows);
	});
}
var get_report_total_sales_week = function(req, res, next){
	var datetime = new Date();
	var thisYear = datetime.getFullYear();
	var week = Math.ceil(datetime.getDate()/7);
	var thisMonth = datetime.getMonth() + 1;
	console.log(thisYear + "- week " + week);

	connection.query('select invoice.invoice_date as "Date", invoice.final_price as "Final_Price", client.client_id as "Seller_ID", concat(client.client_firstname, " ", client_lastname) as "Seller_Name", T.Buyer_ID as "Buyer_ID", T.Buyer_Name as "Buyer_Name", credit_card.cc_holder as "Holder", credit_card.cc_number as "Credit_Card_Number", credit_card.cc_type as "Type",  address.address_1 as "Shipping_Address_1", address.address_2 as "Shipping_Address_2", address.city as "City", address.state as "State", address.zip_code as "Zip_Code", address.country as "Country", listing.listing_id as "Listing_ID", item.item_name as "Item_Name", item.item_description as "Description" '+
		' from invoice natural join listing natural join client natural join credit_card natural join address natural join item natural join (select concat(client.client_firstname, " ", client_lastname) as "Buyer_Name", invoice.buyer_id as "Buyer_ID", invoice.invoice_id as "inv_id" from invoice natural join client where client.client_id = invoice.buyer_id) as T ' +
		' where date_month = ' + thisMonth + ' and date_year= ' + thisYear + ' and date_week = ' + week + ' and invoice.seller_id = credit_card.client_id  and credit_card.is_primary = 1 and invoice.seller_id = client.client_id and T.Buyer_ID = invoice.buyer_id and T.inv_id = invoice.invoice_id', 
		function(err, rows){
		console.log("Getting invoices from DB...");
		res.send(rows);
		console.log(rows);
	});
}
var get_report_total_sales_month = function(req, res, next){
	var datetime = new Date();
	var thisYear = datetime.getFullYear();
	var month = datetime.getMonth() + 1;
	console.log(thisYear + "-" + month);
	connection.query('select invoice.invoice_date as "Date", invoice.final_price as "Final_Price", client.client_id as "Seller_ID", concat(client.client_firstname, " ", client_lastname) as "Seller_Name", T.Buyer_ID as "Buyer_ID", T.Buyer_Name as "Buyer_Name", credit_card.cc_holder as "Holder", credit_card.cc_number as "Credit_Card_Number", credit_card.cc_type as "Type",  address.address_1 as "Shipping_Address_1", address.address_2 as "Shipping_Address_2", address.city as "City", address.state as "State", address.zip_code as "Zip_Code", address.country as "Country", listing.listing_id as "Listing_ID", item.item_name as "Item_Name", item.item_description as "Description" '+
		' from invoice natural join listing natural join client natural join credit_card natural join address natural join item natural join (select concat(client.client_firstname, " ", client_lastname) as "Buyer_Name", invoice.buyer_id as "Buyer_ID", invoice.invoice_id as "inv_id" from invoice natural join client where client.client_id = invoice.buyer_id) as T ' +
		' where date_month = ' + month + ' and date_year= ' + thisYear + ' and invoice.seller_id = credit_card.client_id  and credit_card.is_primary = 1 and invoice.seller_id = client.client_id and T.Buyer_ID = invoice.buyer_id and T.inv_id = invoice.invoice_id', 
		function(err, rows){
			console.log("Getting invoices from DB...");
			res.send(rows);
			console.log(rows);
	});
}
var get_report_total_sales_day_by_product = function(req, res, next){
	var datetime = new Date();
	var thisYear = datetime.getFullYear();
	var thisDay = datetime.getDate();
	var thisMonth = datetime.getMonth() + 1;
	var product = req.params.parameter;
	console.log(thisYear + "-" + thisMonth + "-" + thisDay);

	//Gets the invoices for today
	connection.query('select invoice.invoice_date as "Date", invoice.final_price as "Final_Price", client.client_id as "Seller_ID", concat(client.client_firstname, " ", client_lastname) as "Seller_Name", T.Buyer_ID as "Buyer_ID", T.Buyer_Name as "Buyer_Name", credit_card.cc_holder as "Holder", credit_card.cc_number as "Credit_Card_Number", credit_card.cc_type as "Type",  address.address_1 as "Shipping_Address_1", address.address_2 as "Shipping_Address_2", address.city as "City", address.state as "State", address.zip_code as "Zip_Code", address.country as "Country", listing.listing_id as "Listing_ID", item.item_name as "Item_Name", item.item_description as "Description" '+
		' from invoice natural join listing natural join client natural join credit_card natural join address natural join item natural join (select concat(client.client_firstname, " ", client_lastname) as "Buyer_Name", invoice.buyer_id as "Buyer_ID", invoice.invoice_id as "inv_id" from invoice natural join client where client.client_id = invoice.buyer_id) as T ' +
		' where date_month = ' + thisMonth + ' and date_year= ' + thisYear + ' and date_day = ' + thisDay + ' and invoice.seller_id = credit_card.client_id  and credit_card.is_primary = 1 and invoice.seller_id = client.client_id and T.Buyer_ID = invoice.buyer_id and T.inv_id = invoice.invoice_id', 
		function(err, rows){
		console.log("Getting invoices from DB...");
		res.send(rows);
		console.log(rows);
	});
}
var get_report_total_sales_week_by_product = function(req, res, next){
	var datetime = new Date();
	var thisYear = datetime.getFullYear();
	var week = Math.ceil(datetime.getDate()/7);
	var thisMonth = datetime.getMonth() + 1;
	var product = req.params.parameter;
	console.log(thisYear + "- week " + week);

	connection.query('select invoice.invoice_date as "Date", invoice.final_price as "Final_Price", client.client_id as "Seller_ID", concat(client.client_firstname, " ", client_lastname) as "Seller_Name", T.Buyer_ID as "Buyer_ID", T.Buyer_Name as "Buyer_Name", credit_card.cc_holder as "Holder", credit_card.cc_number as "Credit_Card_Number", credit_card.cc_type as "Type",  address.address_1 as "Shipping_Address_1", address.address_2 as "Shipping_Address_2", address.city as "City", address.state as "State", address.zip_code as "Zip_Code", address.country as "Country", listing.listing_id as "Listing_ID", item.item_name as "Item_Name", item.item_description as "Description" '+
		' from invoice natural join listing natural join client natural join credit_card natural join address natural join item natural join (select concat(client.client_firstname, " ", client_lastname) as "Buyer_Name", invoice.buyer_id as "Buyer_ID", invoice.invoice_id as "inv_id" from invoice natural join client where client.client_id = invoice.buyer_id) as T ' +
		' where date_month = ' + thisMonth + ' and date_year= ' + thisYear + ' and date_week = ' + week + ' and invoice.seller_id = credit_card.client_id  and credit_card.is_primary = 1 and invoice.seller_id = client.client_id and T.Buyer_ID = invoice.buyer_id and T.inv_id = invoice.invoice_id', 
		function(err, rows){
		console.log("Getting invoices from DB...");
		res.send(rows);
		console.log(rows);
	});
}
var get_report_total_sales_month_by_product = function(req, res, next){
	var datetime = new Date();
	var thisYear = datetime.getFullYear();
	var month = datetime.getMonth() + 1;
	var product = req.params.parameter;
	console.log(thisYear + "-" + month);
	connection.query('select invoice.invoice_date as "Date", invoice.final_price as "Final_Price", client.client_id as "Seller_ID", concat(client.client_firstname, " ", client_lastname) as "Seller_Name", T.Buyer_ID as "Buyer_ID", T.Buyer_Name as "Buyer_Name", credit_card.cc_holder as "Holder", credit_card.cc_number as "Credit_Card_Number", credit_card.cc_type as "Type",  address.address_1 as "Shipping_Address_1", address.address_2 as "Shipping_Address_2", address.city as "City", address.state as "State", address.zip_code as "Zip_Code", address.country as "Country", listing.listing_id as "Listing_ID", item.item_name as "Item_Name", item.item_description as "Description" '+
		' from invoice natural join listing natural join client natural join credit_card natural join address natural join item natural join (select concat(client.client_firstname, " ", client_lastname) as "Buyer_Name", invoice.buyer_id as "Buyer_ID", invoice.invoice_id as "inv_id" from invoice natural join client where client.client_id = invoice.buyer_id) as T ' +
		' where date_month = ' + month + ' and date_year= ' + thisYear + ' and invoice.seller_id = credit_card.client_id  and credit_card.is_primary = 1 and invoice.seller_id = client.client_id and T.Buyer_ID = invoice.buyer_id and T.inv_id = invoice.invoice_id', 
		function(err, rows){
			console.log("Getting invoices from DB...");
			res.send(rows);
			console.log(rows);
	});
}


exports.get_report_total_sales_day = get_report_total_sales_day;
exports.get_report_total_sales_week = get_report_total_sales_week;
exports.get_report_total_sales_month = get_report_total_sales_month;
exports.get_report_total_sales_day_by_product = get_report_total_sales_day_by_product;
exports.get_report_total_sales_week_by_product = get_report_total_sales_week_by_product;
exports.get_report_total_sales_month_by_product = get_report_total_sales_month_by_product;

exports.get_individual = get_individual;
exports.get_users = get_users;