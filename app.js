
/**
 * Module dependencies.
 */

var express = require('express');
var routes = require('./routes');
var user = require('./routes/user_logic');
var cart = require('./routes/cart_logic');
var search = require('./routes/search_logic');
var item = require('./routes/item_logic');
var invoice = require('./routes/invoice_logic');
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
app.get('/search/:parameter', search.get_results);
app.get('/categories', search.get_categories);
app.get('/categories/:parent_id', search.get_subcategories);
app.get('/item/:parameter', item.get_item);
app.post('/sign_in', user.sign_in);
app.post('/update_user_info', user.update_user);
app.get('/item', item.get_item);
app.get('/invoice', invoice.get_invoice);
app.get('/cart', cart.get_cart);
app.get('/checkout_address', cart.get_address);
app.get('/invoice/:parameter', invoice.get_inv_from_id);
app.get('/get_addresses', user.user_addresses);
app.post('/add_mail_address', user.add_mail_address);

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});



