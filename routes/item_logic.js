var database = require('./database.js');

var path = require('path');

var connection = database.connect_db();

var get_item = function(req, res, next){
  console.log(req.params);
  var get_item_query = 'SELECT *, count(listing_id) as bid_count FROM bidding_history natural join (SELECT * FROM listing natural join  category natural join item natural join address natural join client where item_id='+connection.escape(req.params.parameter) +' and cat_id = item_category and is_primary = 1 and seller_id = client_id) as Q';
console.log(get_item_query);
connection.query(get_item_query,function(err, rows){
  res.send(rows[0]);
});

connection.on('error', function(err)
{
  if(err.code == 'PROTOCOL_CONNECTION_LOST')
  {
    console.log('reconnected');
    connection =  database.connect_db();
  }
  else
  {
    throw err;
  }
});


}

var get_item_picture = function (req, res, next) {
  res.sendfile(path.resolve('./uploads/' + req.params.parameter));
}; 



var submit_bid = function(req, res, next)
{

  var bid_amount = req.body.bid_amount;
  var user_id = req.body.user_id;
  var item_id = req.body.item_id;
  var item_name = req.body.item_name;


  //Begin transaction
  connection.beginTransaction(function(err)
  {
    if(err) console.log(err);

    else{


      //Get current bid value need to make a query that gets seller_id, price and the highest bidder
      var get_current_bid_query = 'SELECT *, count(listing_id) as bid_count, max(bid_amount) as max_bid FROM bidding_history natural join ( SELECT * FROM listing WHERE item_id ='+connection.escape(item_id)+') as T';

      //Get bank account balance query
      var get_bank_account_balance_query = 'SELECT account_total FROM bank_account WHERE account_owner=' + connection.escape(user_id);

      console.log(get_current_bid_query);
      console.log(get_bank_account_balance_query);
      var current_bid, bank_balance;

      //Query the DB for current bid price
      connection.query(get_current_bid_query, function(err,rows)
      {
        if(err)
        {
          console.log(err);


        }


       
      

        else if(rows[0].seller_id == user_id)
        {

          res.send({message: "You're the owner of this item", issue: "owner"});
        }



        
      

        else 
        {


         console.log("GET CURRENT BID RESPONSE:");
         console.log( rows);
         current_bid = rows[0].price;
         console.log("PRICE: " + current_bid);


         var find_highest_bidder = 'SELECT bidder_id FROM bidding_history natural join listing WHERE item_id='+connection.escape(item_id) + 'and price = bid_amount'
         connection.query(find_highest_bidder, function(err, rows)
         {

          if(err) throw err;
          else if(rows[0].bidder_id == user_id)
          {
            console.log("USER IS THE HIGHEST BIDDER");
                        res.send({message: "You're currently the highest bidder", issue: "highest_bidder"});

          }
          else{
            console.log("QUERING THE DB");
            console.log(get_bank_account_balance_query);








         
      //Query the DB for the users bank account balance
      connection.query(get_bank_account_balance_query, function(err, rows)
      {
        if(err)
        {
          console.log(err);

        }

        else
        {


         //Check if the user isn't the highest bidder or the owner of the item
    


         console.log("GET BANK ACCOUNT RESPONSE: ");
         console.log(rows);

         bank_balance = rows[0].account_total;
         console.log("BALANCE" + bank_balance);



         var bid_amount_bool = false,
         balance_boolean = false;
         console.log("PROCESSING BOOLEANS");

         //Check if the bid amount is higher than the current bid
         if(bid_amount > current_bid)
         {
          bid_amount_bool = true;



        }
        else
        {


          res.send({ message : "You need to bid higher", price : current_bid, issue: "current price"});
        }

        //Check if the bid amount can be substracted from the bank account
        if(bid_amount < bank_balance)
        {

          balance_boolean = true;
        }
        else
        {


          res.send({ message : "Insufficient Funds", issue: "bank"});;
        }

        console.log("PRICE: " + bid_amount_bool);
        console.log("Balance: " + balance_boolean);

      //INSERT BID INTO THE DB
      if(balance_boolean && bid_amount_bool)
      {
        var find_listing_query = 'SELECT listing_id FROM listing WHERE item_id =' + connection.escape(item_id);
        console.log("FIND LISTING QUERY: " + find_listing_query);


        connection.query(find_listing_query, function(err, rows)
        {
          if(err)
          {
            console.log(err);



          }
          else
          {
            var bid_listing_id = rows[0].listing_id;
            var dateFormat = require('dateFormat');

            var bid_insert_query = 'INSERT INTO bidding_history(bidder_id, listing_id, bid_amount, datetime) VALUES('+
             connection.escape(user_id)+ ',' + 
             connection.escape(rows[0].listing_id) + ',' + 
             connection.escape(bid_amount)+',"' + 
             dateFormat(new Date(), "isoDateTime") + '");';

        console.log("INSERT BID QUERY: "  + bid_insert_query);

        connection.query(bid_insert_query, function(err,rows)
        {
          if(err) console.log(err);

          else{



            console.log("BID INSERTED");
          }
        });

                //Notify the person who bidded
        var notify_bidder = 'INSERT INTO user_notifications (client_id, listing_id, is_read, notification_message, notification_date, title)' +
        'VALUES (' + connection.escape(user_id) + ',' + item_id + ',' + 0 + ', "Your bid on ' + item_name + ' has been accepted","' + 
          dateFormat(new Date(), "isoDateTime") + '", "Bidded")';
        console.log(notify_bidder);

        connection.query(notify_bidder, function(err, rows){
            if(err)
            {
              console.log(err);
            }
            else
            {

              console.log("USER NOTIFIED ABOUT BID");
            }



        });



        var find_highest_bid = 'SELECT bid_id, bidder_id FROM bidding_history WHERE listing_id=' + rows[0].listing_id +' and bid_amount=' + current_bid;
        console.log(find_highest_bid);
        //Notify the losing person
        connection.query(find_highest_bid, function(err, rows)
        {
          if(err)
          {

            console.log(err);
          }
          else if(rows.length == 0)
          {

            console.log("NO OLDER BIDS EXIST");
          }
          else
          {

            var notification_loser_query = 'INSERT INTO user_notifications (client_id, listing_id, is_read, notification_message, notification_date, title)'
            + 'VALUES(' + connection.escape(rows[0].bidder_id) + ',' + item_id + ',' + 0 + ', "Your bid on ' + item_name + ' has been outbidded","'+
              dateFormat(new Date(), "isoDateTime") + '", "Outbidded")';
            console.log(notification_loser_query);

            connection.query(notification_loser_query, function(err, rows)
            {


              if(err)
              {

                console.log(err);
              }
              else
              {
                console.log("USER LOST NOTIFIED");
                console.log(rows);
              }
            });


          }});

      

        var update_item_price = 'UPDATE listing set price =' + connection.escape(bid_amount) + 'WHERE item_id =' + connection.escape(item_id);
        
        connection.query(update_item_price, function(err, rows)
        {

          if(err) console.log(err);


          else
          {
            console.log("UPDATED PRICE");
            
  connection.commit(function(err)
            {
              if (err) { 
                connection.rollback(function()
                {
                  throw err;
                });
              }
              
              res.send({issue: "NO ISSUE"});
            });

          }
        });







      }
    });




}
}

});

   }


         });

}


});








}

});



}
exports.submit_bid = submit_bid;
exports.get_item = get_item;
exports.get_item_picture = get_item_picture;