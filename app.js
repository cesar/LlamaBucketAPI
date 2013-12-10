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


var express = require('express');
// var routes = require('./routes');
var user = require('./routes/user_logic');
var cart = require('./routes/cart_logic');
var search = require('./routes/search_logic');
var category = require('./routes/category_logic');
var item = require('./routes/item_logic');
var invoice = require('./routes/invoice_logic');
var admin = require('./routes/admin_logic');
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
app.use(express.bodyParser());
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

/*
* =============================
*              Items           |
* =============================
*/
app.get('/item', item.get_item);
app.get('/item/:parameter', item.get_item);
app.get('/invoice', invoice.get_invoice);
app.get('/order/bucket/:parameter', cart.place_order_bucket);
app.get('/order/item/:parameter', cart.place_order_item);

app.get('/cart/:id', cart.get_cart);
app.get('/checkout/bucket/:id', cart.bucket_checkout);
app.get('/checkout/item/:parameter', cart.item_checkout);
app.get('/invoice/:parameter', invoice.get_inv_from_id);
app.post('/add_cart', cart.add_to_cart);
app.post('/remove_from_cart', cart.remove);
app.get('/checkout_address', cart.get_address);
app.get('/search/:parameter', search.get_results);
app.post('/filter_results', search.get_filtered_results);
app.post('/filter_category_results', search.get_filtered_category_results);




/*
* =============================
*               User           |
* =============================
*/

app.post('/sign_in', user.sign_in);
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