var mongo = require("./mongo");
var mongoURL = "mongodb://localhost:27017/airbnb";
var dateformat= require('dateformat');

var mysql = require('./mysql');

var encrypt_password = require('crypto'),
	algorithm = 'aes-256-ctr',
	password = 'airbnb';

function encrypt(text){
	var cipher = encrypt_password.createCipher(algorithm,password)
	var crypted = cipher.update(text,'utf8','hex')
	crypted += cipher.final('hex');
	return crypted;
	return crypted;
}

function decrypt(text){
	var decipher = encrypt_password.createDecipher(algorithm,password)
	var dec = decipher.update(text,'hex','utf8')
	dec += decipher.final('utf8');
	return dec;
}

exports.handle_request_saveProperty_review_ab = function(msg,callback) {

	var res = {};
	var hostFeedback = msg.hostFeedback
	var propertyFeedback = msg.propertyFeedback
	var cleanliness = msg.cleanliness
	var communication = msg.communication
	var houserules = msg.houserules
	var recommend = msg.recommend
	var userid = msg.userid
	var propertyid = msg.propertyid
	var tripid = msg.tripid
	var hostid;
	var username = msg.username;

	var fetchHostID =  "select host_id from property where property_id='"+propertyid+"'";
	mysql.fetchData(function(err,hostIDResults){
		if(err){

		}else{
			hostid = hostIDResults[0].host_id

			mongo.connect(mongoURL, function() {

				var coll_propertyReview = mongo.collection('propertyReview');
				var newID
				coll_propertyReview.find().sort({_id: -1}).limit(1).toArray(function (err, maxID) {
					if (maxID.length > 0) {
						var maxID = maxID[0]._id;
						newID = maxID + 1;
					} else {
						newID = 1;
					}


					coll_propertyReview.insert({
						_id: newID,
						userid: userid,
						propertyid: propertyid,
						host_id: hostid,
						tripid: tripid,
						property_review: propertyFeedback,
						host_review: hostFeedback,
						cleanliness: cleanliness,
						communication: communication,
						houserules: houserules,
						recommend: recommend,
						user_name: username,
						images: []
					}, function (err, user) {
						if (err) {
							throw err;
						} else {

							var updateUserReviewed =  "Update trip set user_reviewed = 1 where Trip_id = '"+tripid+"'";
							mysql.fetchData(function(err,updateTrip){
								if(err){

								}else{
									console.log("review added successfully ")
									res.code = 200;
									res.propID = newID;
								}

							}, updateUserReviewed);

						}
						res.code = 200;
						res.propRatingID = newID;
						callback(err,res);
					});

				});

			});
		}
	}, fetchHostID);

}

exports.handle_request_login_ab = function(msg,callback) {

	var res = {};
	var email_ab = msg.email;
	var password_ab = msg.password;

	var encryptPassword = encrypt(password_ab)

	var checkLogin =  "select * from users where email='"+email_ab+"' and password = '"+encryptPassword+"' and active = 1";
	mysql.fetchData(function(err,loginCheckResults){
		if(err){

		}else{
			if(loginCheckResults.length > 0){

				res.code = 200;
				res.firstname = loginCheckResults[0].firstname;
				res.userid = loginCheckResults[0].userid;
				res.user = loginCheckResults[0];

			}else{
				res.code = 201;
			}
		}
		callback(err,res);
	}, checkLogin);
}


exports.handle_request_checkProfile_ab = function(msg,callback) {

	var res = {};
	var userid = msg.userid;

	var checkUser =  "select * from users where userid='"+userid+"'";
	mysql.fetchData(function(err,results){
		if(err){

		}else{
			if(results.length > 0){
				res.code = 200;
				res.user = results[0];
			}else{
				res.code = 201;
			}
		}
		callback(err,res);
	}, checkUser);

}


exports.handle_request_updatePhone_ab = function(msg,callback) {

	var res = {};
	var userid = msg.userid;
	var phone = msg.phone;

	var updatePhone =  "update users set phone='"+phone+"' where userid='"+userid+"'";
	mysql.fetchData(function(err,results){
		if(err){
			 res.code = 201
		}else{

			res.code = 200
		}
		callback(err,res);
	}, updatePhone);
}


exports.handle_request_profileUpdate_ab = function(msg, callback){
	var query = msg.query;
	var res = {};
	console.log("query is ")
	console.log(query)

	mysql.fetchData(function(err,results){
		if(err){
			res.code = 201;
		}else{
			res.code = 200;
		}
		callback(err,res);
	}, query);

}


exports.profileImage_Update_ab = function(msg,callback) {
	var res = {};
	var userid = msg.userid;
	var imageid = msg.imageid;

	var updateImage =  "update users set image='"+imageid+"' where userid='"+userid+"'";
	mysql.fetchData(function(err,results){
		if(err){
			res.code = 201
		}else{
			res.code = 200
		}
		callback(err,res);
	}, updateImage);
}

exports.addProperty_Images_ab = function(msg, callback){
	var res = {};
	var ratingID = msg.ratingID;
	var images = msg.images;

	var finalImages = [];

	mongo.connect(mongoURL, function() {

		var coll_propertyReview = mongo.collection('propertyReview');

		coll_propertyReview.find({_id:ratingID}).toArray(function (err, property) {

			if(property[0].images.length > 0){
				finalImages = property[0].images;
			}
			//finalImages = property[0].images;

			for(i in images){
				finalImages.push(images[i])
			}

			console.log("final images are")
			console.log(finalImages)

			coll_propertyReview.update(
				{
					_id:ratingID
				},
				{
					$set: {
						images : finalImages
					}
				}), function(err, user){
				if(err) {
					throw err;
				} else {
					//console.log("images updated successfully");
				}
			};
			console.log("images updated successfully");
			res.code = 200;
			callback(err,res);
		});
		//callback(err,res);
	});
}

exports.handle_request_signup_ab = function(msg,callback) {

	var res = {};
	var firstname = msg.firstname;
	var lastname = msg.lastname;
	var email = msg.email;
	var password = msg.password;
	var day = msg.day;
	var month = msg.month;
	var year = msg.year;
	var dob = msg.dob;

	var userid =
		Math.floor(Math.random() * 9)+""+Math.floor(Math.random() * 9)+"" + ""+Math.floor(Math.random() * 9)  + "-"
		+""+Math.floor(Math.random() * 9)+""+Math.floor(Math.random() * 9) + "-" +""+Math.floor(Math.random() * 9)
		+""+Math.floor(Math.random() * 9)+""+Math.floor(Math.random() * 9)+""+Math.floor(Math.random() * 9);

	var checkEmail =  "select * from users where email='"+email+"'";
	mysql.fetchData(function(err,results){
		if(err){

		}else{
			if(results.length > 0){
				console.log("email already exists");
				res.code = 201;
				callback(null,res);

			}else{
				var checkUserid =  "select * from users where userid='"+userid+"'";
				mysql.fetchData(function(err,results){
					if(err){

					}else{

						if(results.length > 0){
							console.log("userid exists");
							userid =
								Math.floor(Math.random() * 9)+""+Math.floor(Math.random() * 9)+"" + ""+Math.floor(Math.random() * 9)
								+""+Math.floor(Math.random() * 9)+""+Math.floor(Math.random() * 9)+""+Math.floor(Math.random() * 9)
								+""+Math.floor(Math.random() * 9)+""+Math.floor(Math.random() * 9)+""+Math.floor(Math.random() * 9)
								+""+Math.floor(Math.random() * 9);
						}

						password = encrypt(password);

						var post  = {firstname: firstname, lastname: lastname, password: password, email: email, userid: userid, dob: dob};
						var table = 'users';

						mysql.insertRecord(function(err,results){

							if(err){
								throw err;
							}
							else
							{
								console.log("user added successfully "+userid);
								res.code = 200;
								res.userid = userid;
								callback(null,res);
							}
						},post,table);
						//callback(err,res);

					}
				}, checkUserid);

			}
			// callback(err,res);
		}
	}, checkEmail);
	
}


exports.handle_request_deleteUser_ab = function(msg,callback) {
	var res = {};
	var userid = msg.userid;

	console.log("user id to delete is " + userid)

	var deleteUser =  "Delete from users where userid='"+userid+"'";
	mysql.fetchData(function(err,results){
		if(err){

		}else{
				res.code = 200;
		}
		callback(err,res);
	}, deleteUser);
}


/*exports.handle_request_deleteUser_ab = function(msg,callback) {
	var res = {};
	var userid = msg.userid;

	console.log("user id to delete is " + userid)

	var deleteUser =  "Delete from users where userid='"+userid+"'";
	mysql.fetchData(function(err,results){
		if(err){

		}else{
			var del_booking="delete from bookedprop where user_id ='"+userid+"';";
			mysql.fetchData(function(err,results){
				if(err)
				{

				}
				else{

					res.code = 200;

				}
				callback(err,res);
			},del_booking);
		}
	}, deleteUser);
}*/

exports.handle_request_changePassword_ab = function(msg,callback) {

	var res = {};
	var userid = msg.userid;
	var oldpassword = msg.oldpassword;
	var newpassword = msg.newpassword;

	console.log("reached")
	console.log(oldpassword)
	console.log(newpassword);
	console.log(userid);

	var fetchUser =  "Select * from users where userid='"+userid+"'";
	mysql.fetchData(function(err,results){
		if(err){

		}else{

			if(results.length > 0){

				if(results[0].password == encrypt(oldpassword)){

					var updatePassword =  "Update users set password = '"+encrypt(newpassword)+"' where userid='"+userid+"'";
					mysql.fetchData(function(err,results){
						if(err){

						}else{

						}
					}, updatePassword)
					res.code = 200

				}else{
					console.log("old password wrong")
					res.code = 300;
				}
			}
		}
		callback(err,res);
	}, fetchUser);
}

exports.handle_request_bidDetails_ab = function(msg, callback){

	var res = {};

	var propertyid = msg.propertyid;

	var fetchAllBids =  "Select userfname, userlname, bidPrice, bidTime from bid where property_id = '"+propertyid+"' and user_id !='';";
	mysql.fetchData(function(err,results){
		if(err){

		}else{

			console.log("results="+results);
			for(i in results)
			{

				bid_timeFormat = dateformat(results[i].bidTime, "yyyy-mm-dd HH:MM:ss");
				results[i].bidTime = bid_timeFormat;

			}


			res.code = 200;
			res.bids = results;
			callback(err,res);

		}
	}, fetchAllBids)


}

exports.handle_request_userReviews_ab = function(msg, callback){

	var res = {};

	var userid = msg.userid;

	mongo.connect(mongoURL, function() {

		var coll_userReview = mongo.collection('userReview');

		coll_userReview.find({userid:userid}).toArray(function (err, userReviews) {

			res.code = 200;
			res.userReviews = userReviews;
			callback(err,res);

		});
	});
}

exports.handle_request_userByReviews_ab = function(msg, callback){

	var res = {};

	var userid = msg.userid;

	mongo.connect(mongoURL, function() {

		var coll_propertyReview = mongo.collection('propertyReview');

		coll_propertyReview.find({userid:userid}).toArray(function (err, propReviews) {

			res.code = 200;
			res.propertyReviews = propReviews;
			callback(err,res);

		});
	});

}
