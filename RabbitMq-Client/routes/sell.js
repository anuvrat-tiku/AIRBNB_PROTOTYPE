var ejs = require("ejs");
//var mysql = require('./mysqlpool');  // using pool
var mysql = require('./mongo'); // without using pool
var mq_client = require('../rpc/client');
var win_logger = require('winston');
// to validate  the login user signin function 

exports.listProd = function(req,res){
	var user = req.session.username;
	console.log("username is  "+ user);
	var msg_payload = {"username": user};
	console.log("In POST Request = UserName:" + user);
	mq_client.make_request('product_list_queue', msg_payload, function (err, results) {
		if (results.code == "200") {
			console.log(results);
			//console.log("result");
			res.send({"code": 200, "result": results});
			win_logger.log('info', 'user - ' + username + ' - displayed other users products');

		}
		else{
			console.log("not Successful");
		}
	})
};


//rendering to signin page of ebay 

exports.signin = function(req,res){
	res.render('signin');
};




//HomePage redirection

//Redirects to the homepage
exports.loadSellPage = function(req,res)
{
	console.log(" I m here to Sell");
	
	//Checks before redirecting whether the session is valid
	console.log(req.session.username);
	if(req.session.username)
	{
		//Set these headers to notify the browser not to maintain any cache for the page being loaded
		win_logger.log('info', 'user - '+req.session.username+' - loading the selling page for user');
		res.header('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
		res.render("sell",{username:req.session.username,firstname:req.session.firstname,lastname:req.session.lastname,email:req.session.email});
		
	}
	else
	{
		res.redirect('/signin');
	}
};

//Logout the user - invalidate the session

exports.listPage = function(req,res)
{
	console.log(" I m here");
	
	//Checks before redirecting whether the session is valid
	console.log(req.session.username);
	if(req.session.username)
	{
		//Set these headers to notify the browser not to maintain any cache for the page being loaded
		win_logger.log('info', 'user - '+req.session.username+' - showing the listing to the user');
		res.header('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
		res.render("ProductListing",{username:req.session.username,firstname:req.session.firstname,lastname:req.session.lastname});
		
	}

};

//Signup

exports.signup = function(req,res) {

	ejs.renderFile('./views/signup.ejs', function(err, result) {
	   // render on success
	   if (!err) {
	            res.end(result);
	   }
	   // render or error
	   else {
	            res.end('An error occurred');
	            console.log(err);
	   }
   });
};

// sign up validation
exports.insertProduct = function(req,res)
{
	// check user already exists
	
	var SELLER_FIRSTNAME = req.session.firstname;
	var SELLER_LASTNAME  = req.session.lastname;
	var EMAIL = req.session.email;
	var SELLER_USERNAME = req.session.username;
	var ITEM_NAME = req.param('ITEM_NAME');
	var ITEM_PRICE = req.param('ITEM_PRICE');
	var ITEM_QTY = req.param('ITEM_QTY');
	var ITEM_DESC = req.param('ITEM_DESC');
	var min_price = req.param('min_price');
	var category  = req.param('category');
	var BID   = req.param('BID');
	var Group_Name  = req.param('Group_Name');
	var COND   = req.param('COND');
	var pic = "http://ecx.images-amazon.com/images/I/61xmEUz41TL._SL1000_.jpg";





	console.log("In POST Request = UserName:" + SELLER_FIRSTNAME + " and Password: " + SELLER_LASTNAME+" " + EMAIL+" "+SELLER_USERNAME+ " " + ITEM_NAME + " "+ ITEM_PRICE+ " "+ITEM_QTY + ITEM_DESC + min_price + pic + COND + Group_Name+ BID);
	var msg_payload = {"pic":pic,"ITEM_PRICE":ITEM_PRICE,"ITEM_QTY":ITEM_QTY,"SELLER_USERNAME":SELLER_USERNAME, "SELLER_FIRSTNAME": SELLER_FIRSTNAME,"SELLER_LASTNAME": SELLER_LASTNAME,"EMAIL":EMAIL,"ITEM_NAME": ITEM_NAME,"ITEM_PRICE":ITEM_PRICE,"ITEM_DESC":ITEM_DESC,"category":category,"BID":BID,"Group_Name":Group_Name,"COND":COND};
	//console.log("In POST Request = username:" + username);
	mq_client.make_request('add_prod_queue', msg_payload, function (err, results) {
		console.log(results.QTYC);
		if (err) {
			throw err;
		}
		else {
			if (results.code == "200") {
				//console.log(results);
				console.log(results);
				win_logger.log('info', 'user - ' + req.session.username + ' - Product entered in the database');
				res.send({"results": results, "code" : 200});
			}
			else {
				console.log("Not Added to Cart");
				win_logger.log('info', 'user - ' + req.session.username + ' - Product not entered');

			}
		}
	});
}; // end of the function of signin */
