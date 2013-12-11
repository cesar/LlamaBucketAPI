/**
 * Module dependencies.
 */


 var mysql = require('mysql');

var db_config = {
  host : process.env.CLEARDB_DATABASE_URL,  //Set up the database connection host
  user : process.env.CLEARDB_DATABASE_USERNAME, //Username
  password : process.env.CLEARDB_DATABASE_PASSWORD,  //Password
  database : process.env.CLEARDB_DATABASE,  //database name
}

var serverURL = "http://74.213.79.108:5000";

var express = require('express');
// var routes = require('./routes');
var user = require('./routes/user_logic');
var cart = require('./routes/cart_logic');
var search = require('./routes/search_logic');
var category = require('./routes/category_logic');
var item = require('./routes/item_logic');
var invoice = require('./routes/invoice_logic');
var admin = require('./routes/admin_logic');
var buy = require('./routes/buy_logic');
var http = require('http');
var path = require('path');

var allowCrossDomain = function(req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With');

    // intercept OPTIONS method
    if ('OPTIONS' == req.method) {
      res.send(200);
    }
    else {
      next();
    }
};

var app = express();

//Configuration
app.use(allowCrossDomain);
app.set('port', process.env.PORT || 3000);
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser({
    uploadDir:  './uploads',
    keepExtensions: true
}));
app.use(express.methodOverride());
app.use(express.cookieParser('your secret here'));
app.use(express.session());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));


// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}


//Routes

/*
* =============================
*           Categories         |
* =============================
*/

app.post('/add_category', category.add_category);
app.get('/categories', category.get_categories);
app.get('/category/:id', category.get_category);
app.get('/categories/:parent_id', category.get_subcategories);
app.get('/category_options/:parent_id', category.get_recursive_options);

/*
* =============================
*              Items           |
* =============================
*/
app.get('/item', item.get_item);
app.get('/item/:parameter', item.get_item);
app.get('/order/bucket/:parameter', cart.place_order_bucket);
app.get('/order/item/:parameter', cart.place_order_item);
app.get('/uploads/:parameter', item.get_item_picture);
app.get('/cart/:id', cart.get_cart);
app.get('/checkout/bucket/:id', cart.bucket_checkout);
app.get('/checkout/item/:parameter', cart.item_checkout);
app.post('/add_cart', cart.add_to_cart);
app.post('/remove_from_cart', cart.remove);
app.get('/checkout_address', cart.get_address);
app.get('/search/:parameter', search.get_results);
app.post('/filter_results', search.get_filtered_results);
app.post('/filter_category_results', search.get_filtered_category_results);
app.post('/purchase_item/:id', buy.purchase_item);
app.post('/purchase_bucket/:id', buy.purchase_bucket);
app.get('/get_item_by_listing/:listing_id', item.get_item_id);



/*
* =============================
*               User           |
* =============================
*/
app.get('/get_category_options', category.get_category_options);
app.post('/sign_in', user.sign_in);
app.post('/upload_item', user.upload_item);
app.post('/register_user', user.register_user);
app.get('/profile/:user_id', user.get_profile);
app.get('/get_address/:id', user.get_address);
app.get('/get_creditcard/:id', user.get_creditcard);
app.post('/update_user_info', user.update_user);
app.get('/get_addresses/:id', user.get_address_list);
app.get('/get_credit_cards/:id', user.get_creditcard_list);
app.post('/add_mail_address/:id', user.add_address);
app.post('/add_new_creditcard/:id', user.add_creditcard);
app.del('/delete_address/:id', user.delete_address);
app.get('/userinvoice/:parameter', user.get_invoices);
app.get('/singleinvoice/:parameter', user.get_single_invoice);
app.get('/get_notifications/:id', user.get_notifications);
app.get('/get_bids/:client_id', user.get_bids);
app.get('/get_listings/:client_id', user.get_listings);
app.post('/get_offers', user.get_offers);
app.del('/delete_creditcard/:id', user.delete_creditcard);

app.del('/delete_creditcard/:id', user.delete_creditcard)
app.put('/make_primary_address/:id', user.address_make_primary);
app.put('/make_primary_creditcard/:id', user.creditcard_make_primary);


/*
* =============================
*              Admin           |
* =============================
*/

app.get('/users', admin.get_users);
app.get('/users/:parameter', admin.get_individual);
app.get('/reportday', admin.get_report_total_sales_day);
app.get('/reportweek', admin.get_report_total_sales_week);
app.get('/reportmonth', admin.get_report_total_sales_month);
app.get('/reportday/:parameter', admin.get_report_total_sales_day_by_product);
app.get('/reportweek/:parameter', admin.get_report_total_sales_week_by_product);
app.get('/reportmonth/:parameter', admin.get_report_total_sales_month_by_product);

/*
* =============================
*    Listing BUY, BID          |
* =============================
*/

app.post('/submit_bid', item.submit_bid);
/* ============================
*              Buy             |
* =============================
*/
app.get('/get_balance/:parameter', buy.get_balance);
//Pass in the format xxx_yyy where xxx is the CLIENT ID and yyy is the ITEM ID
app.post('/insert_invoice/:parameter', invoice.insert_invoice);
//Pass the listing_id
app.post('/deactivate_listing/:parameter', buy.deactivate_listing);
//Pass in the format xxx_yyy where xxx is the CLIENT ID and yyy is the LISTING ID
app.post('/drop_from_bucket/:parameter', buy.drop_from_bucket);
//Pass in the format xxx_yyy where xxx is the CLIENT ID and yyy is the LISTING ID
app.post('/insert_notification/:parameter', buy.insert_notification);
//Pass in the format xxx_yyy where xxx is the CLIENT ID and yyy is the LISTING ID
app.post('/insert_to_bucket/:parameter', buy.insert_to_bucket);
//Pass in the format xxx_yyy_zzz, x is the ranker, y is the rankee, z is the rank
app.post('/insert_ranking/:parameter', buy.insert_ranking);
//Pass in the format xxx_yyy, where x is the CLIENT ID and yyy is the balance to ADD
//Can use a negative number to remove as in 101_-17.99
//101 is the client id, -17.99 is the amount to add
//Also increments the client's total sales.
app.post('/update_balance/:parameter', buy.update_balance);
//Pass the item id
app.get('/get_listing_from_item/:parameter', buy.get_listing_from_item);

/*
* =============================
*       Create the server      |
* =============================
*/
http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});


var dns = require('dns');

dns.resolve4('llamabucket.herokuapp.com', function (err, addresses) {
  if (err) throw err;

  console.log('addresses: ' + JSON.stringify(addresses));

  addresses.forEach(function (a) {
    dns.reverse(a, function (err, domains) {
      if (err) {
        throw err;
      }

      console.log('reverse for ' + a + ': ' + JSON.stringify(domains));
    });
  });
});
