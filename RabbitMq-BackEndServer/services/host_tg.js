var mysql= require('./mysql');
var passport= require('passport');
var LocalStrategy= require('passport-local');
var bCrypt= require('bcrypt');
var mongodb= require('./mongodb_ng');
var NodeGeocoder = require('node-geocoder');
var mongo= require('./mongo');
var mongoURL = "mongodb://localhost:27017/airbnb";
var dateformat= require('dateformat');
//var fs = require('fs');


function idGen_ng () {
	console.log("in id gen");
	count_ng=0;
	var userid_ng="";
	while(count_ng != 9){
		console.log("count="+count_ng);
		var rand_ng = Math.random() * (9 - 0) + 0;
		rand_ng= parseInt(rand_ng);
		var strRand_ng= rand_ng.toString();
		userid_ng=userid_ng+strRand_ng;
		if(count_ng==2 || count_ng==4 ){
			userid_ng= userid_ng+'-';
		}
		count_ng++;
	}
	console.log("id="+userid_ng);
	return userid_ng;
};


function base64_encode_ng(file) {
	var bitmap = fs.readFileSync(file);
	return new Buffer(bitmap).toString('base64');
}

function base64_decode_ng(name,image) {
	console.log("in decode="+__dirname);
	var finalname= __dirname + "/../public/"+name+".jpg";
	console.log("file="+finalname);
	fs.writeFile(finalname, new Buffer(image, "base64"), function(err) {});
}


function checkhost_ng (hostid) {
	var query= "SELECT * FROM host WHERE hostid ='"+hostid+"';";
	console.log("before query");
	mysql.fetchData(function (err,res) {
		console.log("result='"+res.length+"'");
		if(err){
			throw err;
		}
		else{
			console.log("result='"+res.length+"'");
			if(res.length!=0){
				return 0;
			}
			else{
				return 1;
			}
		}
	},query);
};

var passport= require('passport');
var LocalStrategy= require('passport-local');
var bCrypt= require('bcrypt');

passport.serializeUser(function(user, done) {

	done(null, user._id);

});


passport.deserializeUser(function(id, done) {

	mongodb.userModel.findById(id, function(err, user) {

		done(err, user);

	});

});

exports.signuphost_ng= function (msg,callback) {
	console.log("inside host signup server");
	var response={};

	var query1= "SELECT * FROM host WHERE email ='"+msg.email+"';";
	mysql.fetchData(function (err,res) {
		if(err){
			throw err;
		}
		else{

			if(res.length!=0){
				console.log("exists");
				response.code="401";
				response.status="Host already exists";
				callback(null,response);
			}

			else{

				var flag=0;

				var hostid= idGen_ng();
				flag= checkhost_ng(hostid);

				query2= "INSERT INTO host (hostid,fname,lname,email,profileimg,password,active) VALUES ('"+hostid+"','"+msg.fname+"','"+msg.lname+"','"+msg.email+"','"+msg.profileimg+"',AES_ENCRYPT('"+msg.password+"', 'guessme'),'pending');";
				mysql.pushData(function (err,result) {

					if(err){
						throw err;
					}
					else{
						var hostmod= new mongodb.hostModel();
						hostmod.hostid=hostid;
						hostmod.hostvideo=msg.hostvideo;
						hostmod.save(function(err, result) {
							if(err)
							{
								throw err;
							}
							else
							{
								var query3= "insert into host_page_click(host_id,home,profile,trips,messages,preview,add_property,transaction,reviews) VALUES ('"+hostid+"','0','0','0','0','0','0','0','0');"
								mysql.pushData(function (err,result) {
									if(err){
										throw err;
									}
									else{
										response.code="200";
										response.status="Host inserted";
										callback(null,response);
									}
								},query3);

							}
						});
					}
				},query2);

			}
		}
	},query1);


};

exports.signinhost_ng= function (msg,callback) {
	var response={};
	var key="guessme";
	var extra="AES_ENCRYPT('"+msg.password+"','"+key+"')";
	var query1= "SELECT * FROM host WHERE email ='"+msg.email+"' AND password="+extra+" AND active='accepted';";
	mysql.fetchData(function (err,res) {
		if(err){
			throw err;
		}
		else{
			if(res.length!=0){

				mongodb.hostModel.find({ hostid: res[0].hostid }, function (err,mongoresult) {
					if(err){
						throw err;
					}
					else{

						var query2= "SELECT * FROM host_page_click WHERE host_id ='"+res[0].hostid+"';";
						mysql.fetchData(function (err,result2) {
							if(err){
								throw err;
							}
							else{
								console.log("in mongo else of prop image");
								response.hostvideo=mongoresult[0].hostvideo;
								response.email=msg.email;
								response.hostid= res[0].hostid;
								response.fname=res[0].fname;
								response.profileimg= res[0].profileimg;
								response.host_pageclick= result2;
								console.log("res video=");
								response.code="200";
								response.status="Valid Host";
								callback(null,response);
							}
						},query2);
					}
				});
			}
			else{
				response.code="401";
				response.status="Invalid Host";
				callback(null,response);
			}
		}
	},query1);



};

exports.allsteps_ng= function (msg,callback) {
	var response={};
	var propertyid= idGen_ng();
	propertyimg= msg.propertyimg.split(',');
	var qty=1;
	var a = new Date();


	var current = new Date();
	var bid_startTime = dateformat(current, "yyyy-mm-dd HH:MM:ss");
	var bid_endtime1 =  new Date(current.setTime(current.getTime() + 4 * 86400000 ));
	var bid_endtime = dateformat(bid_endtime1, "yyyy-mm-dd HH:MM:ss");



	var currDate = new Date(a.setDate(a.getDate()));
	var bidDate = new Date(a.setDate(a.getDate() + 4));  // bid end date
	console.log("propertyimg length="+propertyimg.length);
	console.log("place="+msg.guest_room);




	if(msg.guest_place=="Shared Room"){
		console.log("in Shared");
		qty= parseInt(msg.bed);
	}

	var xcoord="";
	var ycoord="";
	var options = {
		provider: 'google',

		// Optional depending on the providers
		httpAdapter: 'https', // Default
		apiKey: 'AIzaSyB-7U6qTUfJE-_NBItfrn81VTRM3ZPrLKA', // for Mapquest, OpenCage, Google Premier
		formatter: null         // 'gpx', 'string', ...
	};

	var geocoder = NodeGeocoder(options);

	// Using callback
	console.log("before googlemaps");
	geocoder.geocode(msg.street, function(err, res) {
		if(err){
			console.log("in error googlemaps");
			throw err;
		}
		else{
			console.log("in googlemaps");
			console.log("res"+res[0]);
			xcoord= res[0].latitude;
			ycoord= res[0].longitude;
			console.log("xcoord="+xcoord);
			var price= msg.price.substring(1,msg.price.length);
			var total_bid= parseInt(price)+ 356;
			console.log("total bid aaj ka="+total_bid);
			var query1= "INSERT INTO bid (property_id, UserFname, UserLname, HostFname, HostLname, bidPrice, bidTime, bid, User_email, user_id, host_id,guests,checkin,checkout,type,city,state,apt,zip,Street, guest_place, place, total, country) VALUES ( '"+propertyid+"','Nayan','Goel','Nayan','Goel','"+price+"','"+bid_endtime+"','"+msg.bid+"','nayangoel@gmail.com','','"+msg.hostid+"','"+msg.guestnum+"','1998-12-10','1998-12-10','"+msg.type+"','"+msg.city+"','"+msg.state+"','"+msg.apt+"','"+msg.zip+"','"+msg.street+"','"+msg.guest_place+"','"+msg.place+"','"+total_bid+"','"+msg.country+"');";
			mysql.pushData(function (err,result1) {
				if(err){
					throw err;
				}
				else{
					var query2= "INSERT INTO bookedprop(property_id, UserName, Qty, checkin, checkout) VALUES ('"+propertyid+"','Nayan','"+qty+"','1998-12-10','1998-12-10');";
					mysql.pushData(function (err,result2) {
						if(err){
							throw err;
						}
						else{
							var query3= "INSERT INTO property (property_id,place,address,guestnum,guest_place,type,bed,guest,bathroom,country,city,state,street,apt,zip,amenities,space,description,placename,nearbyloc,love," +
								"extrafeatures,phone,children,infants,smoking,events,pets,advance,notice,from_date,to_date,min_value,max_value,currency,price,host_id,bid,propcoverimg,Qty,bidstate,startbid,endbid,xcoord,ycoord,visit_count) VALUES ('"+propertyid+"','"+msg.place+"','"+msg.address+"','"+msg.guestnum+"','"+msg.guest_place+"','"+msg.type+"','"+msg.bed+"','"+msg.guest+"','"+msg.bathroom+"','"+msg.country+"','"+msg.city+"','"+msg.state+"','"+msg.street+"','"+msg.apt+"','"+msg.zip+"','"+msg.amenities+"','"+msg.spaces+"','"+msg.description+"','"+msg.placename+"','"+msg.nearbyloc+"','"+msg.love+"','"+msg.extrafeatures+"','"+msg.phone+"','"+msg.children+"','"+msg.infants+"','"+msg.smoking+"','"+msg.events+"','"+msg.pets+"','"+msg.advance+"','"+msg.notice+"','"+msg.from+"','"+msg.to+"','"+msg.min+"','"+msg.max+"','"+msg.currency+"','"+price+"','"+msg.hostid+"','"+msg.bid+"','"+propertyimg[0]+"','"+qty+"','"+msg.bid+"','"+bid_startTime+"','"+bid_endtime+"','"+xcoord+"','"+ycoord+"','0');";
							mysql.pushData(function (err,result) {
								console.log("inside insert callback");
								if(err){
									throw err;
								}
								else{
									console.log("in here");

									var propertymod= new mongodb.propertyModel();
									propertymod.propertyid=propertyid;
									propertymod.propertyimg= msg.propertyimg;
									console.log("propertyid="+propertymod.propertyid);
									propertymod.save(function(err, result) {
										if(err)
										{
											throw err;
										}
										else
										{
											response.code="200";
											response.status="Property inserted";
											console.log("inserted in mongo");
											callback(null,response);
										}
									});
								}
							},query3);
						}
					},query2);
				}
			},query1);
		}
	});
	console.log("after googlemaps");

};

exports.propertylist_ng= function (msg,callback) {
	var response={};
	console.log("hostid="+msg.hostid);
	var query1= "SELECT * FROM host_message WHERE host_id='"+msg.hostid+"' AND message_read='no';";
	mysql.fetchData(function (err,result1) {
		if(err){
			throw err;
		}
		else{
			console.log("message length"+result1.length);
			var query2= "SELECT * from property WHERE host_id='"+msg.hostid+"';";
			mysql.fetchData(function (err,result) {
				if(err){
					throw err;
				}
				else{
					response.message_num= result1.length;
					response.result=result;
					response.code="200";
					response.status="Data Fetched";
					callback(null,response);
				}
			},query2);
		}
	},query1);
};

exports.propertydelete_ng= function (msg,callback) {
	var response={};
	// var query= "DELETE FROM property WHERE property_id='"+msg.property_id+"';";
	// mysql.pushData(function (err,result) {
	// 	if(err){
	// 		throw err;
	// 	}
	// 	else{
	// 		console.log("deleted");
	// 		var query1= "SELECT * from property WHERE host_id='"+msg.host_id+"';";
	// mysql.fetchData(function (err,result) {
	// 	if(err){
	// 		throw err;
	// 	}
	// 	else{
	// 		console.log("result=");
	// 		console.dir(result);
	// 		response.result=result;
	// 		response.code="200";
	// 		response.status="Data Fetched";
	// 		callback(null,response);
	// 	}
	// },query1);

	// 	}
	// },query);



	// sahil start



	var biddel = "Delete from bid where Property_id ='"+ msg.property_id +"'and checkin > NOW();";
	mysql.fetchData(function (err, Results1) {
		if (err) {

		} else {
			console.log("delete from bid");
			var billdel = "delete  from bill where bill_id IN (select bill_id from trip where propertyID ='"+ msg.property_id +"')and from_date > NOW();";
			mysql.fetchData(function (err, Results2) {
				if (err) {

				} else {
					console.log("delete from bill");
					var tripdel = "Delete from trip where PropertyId  ='"+ msg.property_id +"'and Checkin > NOW();";
					mysql.fetchData(function (err, Results2) {
						if (err) {

						}else {
							console.log("delete from trip");
							var propdel = "Delete from property where property_id   ='"+ msg.property_id +"';";
							mysql.fetchData(function (err, Results2) {
								console.log(" into message");
								if (err) {

								}else {
									console.log("delete from host");
									//	var hostdel = "Delete from host where hostid   ='"+ host_id +"';";
									//	mysql.fetchData(function (err, Results2) {

									//		if (err) {

									//	}else {
									console.log("delete from bookedprop");
									var bookdel = "Delete from bookedprop where property_id   ='"+ msg.property_id +"'and checkin  > NOW();";
									mysql.fetchData(function (err, Results2) {
										if (err) {

										}else {

											console.log("Deletion done");
											//nayan start



											var query1= "SELECT * from property WHERE host_id='"+msg.host_id+"';";
											mysql.fetchData(function (err,result) {
												if(err){
													throw err;
												}
												else{
													console.log("result=");
													console.dir(result);
													response.result=result;
													response.code="200";
													response.status="Data Fetched";
													callback(null,response);
												}
											},query1);


											//nayan end

										}
									},bookdel);
									//	}
									//	},hostdel);
								}
							},propdel)
						}
					},tripdel);
				}

			},billdel);

		}
	},biddel);




// sahil end
};


exports.loadprofile_ng = function (msg,callback) {
	var response={};
	var query= "SELECT * FROM host WHERE hostid='"+msg.host_id+"';";
	mysql.fetchData(function (err,result) {
		if(err){
			throw err;
		}
		else{

			response.result=result;
			response.code="200";
			response.status="Valid Host";
			callback(null,response);

		}
	},query);
};

exports.updatehostprofile_ng = function (msg,callback) {
	var response={};
	console.dir(msg);
	var query= "UPDATE host SET fname='"+msg.fname+"', lname='"+msg.lname+"', dob='"+msg.dob+"', gender='"+msg.gender+"', email='"+msg.email+"', phone='"+msg.phone+"' WHERE hostid='"+msg.hostid+"';";
	mysql.pushData(function (err,result) {
		if(err){
			throw err;
		}
		else{

			response.result=result;
			response.code="200";
			response.status="Valid Host";
			callback(null,response);

		}
	},query);
};

exports.uploadhostprofileimg_ng= function (msg,callback) {
	var response={};
	console.dir(msg);
	var query= "UPDATE host SET profileimg='"+msg.img+"' WHERE hostid='"+msg.hostid+"';";
	mysql.pushData(function (err,result) {
		if(err){
			throw err;
		}
		else{

			response.result=result;
			response.code="200";
			response.status="Valid Host";
			callback(null,response);

		}
	},query);
};

exports.loadhostmedia_ng= function (msg,callback) {
	var response={};
	console.log(msg);
	var query= "SELECT * from host WHERE hostid='"+msg.hostid+"';";
	mysql.fetchData(function (err,result) {
		if(err){
			throw err;
		}
		else{
			console.log("sent profile image");
			response.result= result;
			response.code="200";
			response.status="Data fetched";
			callback(null,response);
		}
	},query);
};

exports.uploadhostvideo_ng= function (msg,callback) {
	var response={};
	console.log("in upload host video");

	// var hostmod= new mongodb.hostModel();
	// 			hostmod.hostid=msg.hostid;
	// 			hostmod.hostvideo=msg.hostvideo;
	// 			hostmod.save(function(err, result) {
	// 				if(err)
	// 					{
	// 					throw err;
	// 					}
	// 				else
	// 					{
	// 					response.code="200";
	// 					callback(null,response);
	// 					}
	// 			});

	var conditions = { hostid: msg.hostid };
	var update = { hostvideo: msg.hostvideo };

	mongodb.hostModel.update(conditions, update, function (err, result) {
		if(err){
			throw err;
		}
		else{
			response.code="200";
			callback(null,response);
		}
	});

};

exports.preview_ng= function (msg,callback) {
	console.log("in preview function");
	var response={};
	var query= "SELECT * FROM property WHERE property_id='"+msg.property_id+"';";
	mysql.fetchData(function (err,result) {
		if(err){
			throw err;
		}
		else{

			mongodb.propertyModel.find({ propertyid: msg.property_id }, function (err,mongoresult) {
				if(err){
					throw err;
				}
				else{
					console.log("in mongo else of prop image");
					response.result=result;
					response.mongoresult=mongoresult;
					response.code="200";
					response.status="property fetched";
					callback(null,response);
				}
			});
		}
	},query);
};

exports.gethostmessage_ng= function (msg,callback) {
	console.log("in host message");

	var response={};
	var query= "SELECT * FROM host_message WHERE host_id= '"+msg.host_id+"';";
	mysql.fetchData(function (err,result) {
		if(err){
			throw err;
		}
		else{
			response.result=result;
			response.code="200";
			response.status="messages fetched";
			callback(null,response);
		}
	},query);
};

exports.sethostmessagedenied_ng= function (msg,callback) {
	console.log("in denied host message");
	var response={};
	var query1= "SELECT * FROM host_message WHERE message_id= '"+msg.message_id+"';";
	mysql.fetchData(function (err,result1) {
		if(err){
			throw err;
		}
		else{
			var query2= "INSERT INTO user_message(property_id, HostName, Qty, checkin, checkout, user_id,status,message_read,bill_link,property_name) VALUES ('"+result1[0].property_id+"','"+msg.host_fname+"','"+result1[0].Qty+"','"+result1[0].checkin+"','"+result1[0].checkout+"','"+result1[0].user_id+"','Denied','no','Denied','"+result1[0].property_name+"');";
			mysql.pushData(function (err,result2) {
				if(err){
					throw err;
				}
				else{
					var query3= "UPDATE host_message SET message_read='yes', status= 'Denied' WHERE message_id='"+msg.message_id+"';";
					mysql.pushData(function (err,result) {
						if(err){
							throw err;
						}
						else{

							response.result=result;
							response.code="200";
							response.status="set to read";
							callback(null,response);

						}
					},query3);
				}
			},query2);
		}
	},query1);

};

// exports.sethostmessageaccept_ng= function (msg,callback) {
// 	console.log("in accept host message");
// 	console.log("msg hostname="+ msg.hostname);
// 	var response={};
// 	var query1= "SELECT * FROM host_message WHERE message_id= '"+msg.message_id+"';";
// 	mysql.fetchData(function (err,result1) {
// 		if(err){
// 			throw err;
// 		}
// 		else{
// 			console.dir(result1);
// 			console.log("result=");
// 			var query2= "INSERT INTO Trip(Checkin, Checkout, UserFName, UserLName, PropertyId, HostId, Price, HostFName, Property_Name, bill_id, User_Id, guest, total, bid, host_reviewed, user_reviewed) VALUES ('"+result1[0].checkin+"','"+result1[0].checkout+"','"+result1[0].UserName+"','Smith','"+result1[0].property_id+"','"+result1[0].host_id+"','"+result1[0].price+"','"+msg.hostname+"','"+result1[0].property_name+"','"+result1[0].bill_id+"','"+result1[0].user_id+"','"+result1[0].guest+"','"+result1[0].total+"','"+result1[0].bid+"',0,0);";
// 			mysql.pushData(function (err,result4) {
// 				if(err){
// 					throw err;
// 				}
// 				else{
// 					var select_query= "SELECT max(Trip_id) as gottrip_id FROM Trip;";
// 					mysql.fetchData(function (err, tripdata) {
// 						if(err){
// 							throw err;
// 						}
// 						else{
// 							var gottrip_id= tripdata[0].gottrip_id;
// 							console.log("trip id in accept="+gottrip_id);

// 							var query3= "INSERT INTO bookedprop(property_id, UserName, Qty, checkin, checkout,Trip_id,user_id) VALUES ('"+result1[0].property_id+"','"+result1[0].UserName+"','"+result1[0].Qty+"','"+result1[0].checkin+"','"+result1[0].checkout+"','"+gottrip_id+"','"+result1[0].user_id+"');";
// 							mysql.pushData(function (err,result2) {
// 								if(err){
// 									throw err;
// 								}
// 								else{
// 										var query4= "INSERT INTO user_message(property_id, HostName, Qty, checkin, checkout, user_id,status,message_read,bill_link,property_name) VALUES ('"+result1[0].property_id+"','"+msg.hostname+"','"+result1[0].Qty+"','"+result1[0].checkin+"','"+result1[0].checkout+"','"+result1[0].user_id+"','Accepted','no','/bill?bill_id="+result1[0].bill_id+"','"+result1[0].property_name+"');";
// 										mysql.pushData(function (err,result3) {
// 											if(err){
// 												throw err;
// 											}
// 											else{
// 													var query5= "UPDATE host_message SET message_read='yes', status= 'Accepted' WHERE message_id='"+msg.message_id+"';";
// 													mysql.pushData(function (err,result) {
// 														if(err){
// 															throw err;
// 														}
// 														else{

// 																response.result=result;
// 																response.code="200";
// 																response.status="set to read";
// 																callback(null,response);

// 														}
// 													},query5);
// 											}
// 										},query4);
// 								}
// 							},query3);

// 						}
// 					},select_query);
// 				}
// 			},query2);
// 		}
// 	},query1);

// };





exports.sethostmessageaccept_ng= function (msg,callback) {
	console.log("in accept host message");
	console.log("msg hostname="+ msg.hostname);
	var response={};
	var user_check=0;
	var query1= "SELECT * FROM host_message WHERE message_id= '"+msg.message_id+"';";
	var quer4="";
	mysql.fetchData(function (err,result1) {
		if(err){
			throw err;
		}
		else{
			console.dir(result1);
			console.log("result=");


			var check_bill_id= result1[0].bill_id;
			var edit_query= "Select Trip_id from Trip where bill_id='"+check_bill_id+"';";
			mysql.fetchData(function (err,edit_query_result) {
				if(err){
					throw err;
				}
				else{
					var query2="";
					if(typeof(edit_query_result[0])=="undefined"){
						console.log("in if of edit_query");
						query2= "INSERT INTO Trip(Checkin, Checkout, UserFName, UserLName, PropertyId, HostId, Price, HostFName, Property_Name, bill_id, User_Id, guest, total, bid, host_reviewed, user_reviewed) VALUES ('"+result1[0].checkin+"','"+result1[0].checkout+"','"+result1[0].UserName+"','Smith','"+result1[0].property_id+"','"+result1[0].host_id+"','"+result1[0].price+"','"+msg.hostname+"','"+result1[0].property_name+"','"+result1[0].bill_id+"','"+result1[0].user_id+"','"+result1[0].guest+"','"+result1[0].total+"','"+result1[0].bid+"',0,0);";
						user_check=0;
					}
					else{
						console.log("in else of edit_query");
						user_check=1;
						query2= "UPDATE Trip SET Checkin='"+result1[0].checkin+"',Checkout='"+result1[0].checkout+"',UserFname='"+result1[0].UserName+"',UserLName='Smith',PropertyId='"+result1[0].property_id+"',HostId='"+result1[0].host_id+"',Price='"+result1[0].price+"',HostFName='"+msg.hostname+"',Property_Name='"+result1[0].property_name+"',bill_id='"+result1[0].bill_id+"',User_Id='"+result1[0].user_id+"',guest='"+result1[0].guest+"',total='"+result1[0].total+"',bid='"+result1[0].bid+"',host_reviewed=0,user_reviewed=0 WHERE Trip_id='"+edit_query_result[0].Trip_id+"';";
					}

					mysql.pushData(function (err,result4) {
						if(err){
							throw err;
						}
						else{
							var select_query= "SELECT max(Trip_id) as gottrip_id FROM Trip;";
							mysql.fetchData(function (err, tripdata) {
								if(err){
									throw err;
								}
								else{

									var query3="";
									var gottrip_id= tripdata[0].gottrip_id;
									console.log("trip id in accept="+gottrip_id);
									if(user_check==0){
										query3= "INSERT INTO bookedprop(property_id, UserName, Qty, checkin, checkout,Trip_id,user_id) VALUES ('"+result1[0].property_id+"','"+result1[0].UserName+"','"+result1[0].Qty+"','"+result1[0].checkin+"','"+result1[0].checkout+"','"+gottrip_id+"','"+result1[0].user_id+"');";
									}
									else{
										query3= "update bookedprop SET checkin ='"+result1[0].checkin+"',checkout='"+result1[0].checkout+"' where Trip_id ='"+gottrip_id+"';";
									}
									mysql.pushData(function (err,result2) {
										if(err){
											throw err;
										}
										else{
											if(user_check==0){
												query4= "INSERT INTO user_message(property_id, HostName, Qty, checkin, checkout, user_id,status,message_read,bill_link,property_name,trip_id) VALUES ('"+result1[0].property_id+"','"+msg.hostname+"','"+result1[0].Qty+"','"+result1[0].checkin+"','"+result1[0].checkout+"','"+result1[0].user_id+"','Accepted','no','/bill?bill_id="+result1[0].bill_id+"','"+result1[0].property_name+"','"+gottrip_id+"');";
											}
											else{

												query4= "UPDATE user_message SET property_id='"+result1[0].property_id+"',HostName='"+msg.hostname+"',Qty='"+result1[0].Qty+"',checkin='"+result1[0].checkin+"',checkout='"+result1[0].checkout+"',user_id='"+result1[0].user_id+"',status='Accepted',message_read='no',bill_link='/bill?bill_id="+result1[0].bill_id+"',property_name='"+result1[0].property_name+"' WHERE Trip_id='"+gottrip_id+"';";
											}
											mysql.pushData(function (err,result3) {
												if(err){
													throw err;
												}
												else{
													var query5= "UPDATE host_message SET message_read='yes', status= 'Accepted' WHERE message_id='"+msg.message_id+"';";
													mysql.pushData(function (err,result) {
														if(err){
															throw err;
														}
														else{

															response.result=result;
															response.code="200";
															response.status="set to read";
															callback(null,response);

														}
													},query5);
												}
											},query4);
										}
									},query3);

								}
							},select_query);
						}
					},query2);
				}

			},edit_query);
		}
	},query1);

};










exports.host_delete_profile= function (msg,callback) {
	var response={};
	// var query= "DELETE FROM host WHERE hostid='"+msg.hostid+"';";
	// mysql.pushData(function (err,result) {
	// 	if(err){
	// 		throw err;
	// 	}
	// 	else{
	// 			var query= "DELETE FROM property WHERE host_id='"+msg.hostid+"';";
	// 				mysql.pushData(function (err,result) {
	// 					if(err){
	// 						throw err;
	// 					}
	// 					else{
	// 						console.log("deleted");
	// 						response.code="200";
	// 						response.status="Host Deleted";
	// 						callback(null,response);
	// 					}
	// 				},query);
	// 	}
	// },query);



	// sahil start


	var biddel = "Delete from bid where host_id ='"+ msg.hostid +"'and checkin > NOW();";
	mysql.fetchData(function (err, Results1) {
		if (err) {

		} else {
			console.log("delete from bid");
			var billdel = "Delete from bill where host_id ='"+ msg.hostid +"'and from_date > NOW();";
			mysql.fetchData(function (err, Results2) {
				if (err) {

				} else {
					console.log("delete from bill");
					var tripdel = "Delete from trip where HostId  ='"+ msg.hostid +"'and Checkin > NOW();";
					mysql.fetchData(function (err, Results2) {
						if (err) {

						}else {
							console.log("delete from trip");
							var propdel = "Delete from property where host_id   ='"+ msg.hostid +"';";
							mysql.fetchData(function (err, Results2) {
								console.log(" into message");
								if (err) {

								}else {
									console.log("delete from host");
									var hostdel = "Delete from host where hostid   ='"+ msg.hostid +"';";
									mysql.fetchData(function (err, Results2) {

										if (err) {

										}else {
											console.log("delete from bookedprop");
											var bookdel = "Delete from bookedprop where host_id ='"+ msg.hostid +"'and checkin  > NOW();";
											mysql.fetchData(function (err, Results2) {
												if (err) {

												}else {

													console.log("Deletion done");
													console.log("deleted");
													response.code="200";
													response.status="Host Deleted";
													callback(null,response);
												}
											},bookdel);
										}
									},hostdel);
								}
							},propdel)
						}
					},tripdel);
				}

			},billdel);

		}
	},biddel);


// sahil end


};


exports.host_transaction_history = function (msg,callback) {
	var response={};
	var query= "SELECT * FROM bill WHERE host_id='"+msg.hostid+"';";
	mysql.fetchData(function (err,result) {
		if(err){
			throw err;
		}
		else{

			response.result=result;
			response.code="200";
			response.status="Valid Host";
			callback(null,response);

		}
	},query);
};

exports.gethostdash_ng = function (msg,callback) {
	var response={};

	var query1= "SELECT * FROM property WHERE host_id='"+msg.hostid+"';";
	mysql.fetchData(function (err,result1) {
		if(err){
			throw err;
		}
		else{

			var query2= "SELECT * FROM bid WHERE host_id='"+msg.hostid+"';";
			mysql.fetchData(function (err,result2) {
				if(err){
					throw err;
				}
				else{
					var selectcity="select count(city) as count_city,city from users group by city;"
					mysql.fetchData(function (err,result3) {
						if(err){
							throw err;
						}
						else{

							var areacountquery= "select city,sum(visit_count) as sum_count from property group by city;";
							mysql.fetchData(function (err,result4) {
								if(err){
									throw err;
								}
								else{
									response.areacount_result= result4;
									response.citycount_result=result3;
									response.property_result=result1;
									response.bid_result=result2;
									response.code="200";
									response.status="Dash data fetched";
									callback(null,response);
								}
							}, areacountquery);

						}
					},selectcity);

				}
			},query2);

		}
	},query1);


};


exports.gethosttrip_ng = function (msg,callback) {
	console.log("in host message");

	var response={};
	var query= "SELECT * FROM Trip WHERE Checkout < Current_Timestamp and HostId= '"+msg.hostid+"';";
	mysql.fetchData(function (err,result) {
		if(err){
			throw err;
		}
		else{
			console.log('message fetched='+result.length);
			response.result=result;
			response.code="200";
			response.status="messages fetched";
			callback(null,response);
		}
		console.log("outside");

	},query);
};

exports.gethostfuturetrip_ng = function (msg,callback) {
	console.log("in trips message");

	var response={};
	var query= "SELECT * FROM Trip WHERE Checkout > Current_Timestamp and HostId= '"+msg.hostid+"';";
	mysql.fetchData(function (err,result) {
		if(err){
			throw err;
		}
		else{
			console.log('message fetched='+result.length);
			response.result=result;
			response.code="200";
			response.status="messages fetched";
			callback(null,response);
		}
		console.log("outside1");

	},query);
};

exports.saveguestRating_ng = function(msg,callback) {

	var res = {};
	var hostFeedback = msg.hostFeedback;
	var propertyFeedback = msg.propertyFeedback;
	var cleanliness = msg.cleanliness;
	var communication = msg.communication;
	var houserules = msg.houserules;
	var recommend = msg.recommend;
	var hostid = msg.hostid;
	var user_id= msg.user_id;
	var trip_id= msg.trip_id;
	var host_name= msg.host_name;

	mongo.connect(mongoURL, function() {

		var query1="SELECT * FROM users WHERE userid='"+user_id+"';";
		mysql.fetchData(function (err,result) {
			if(err){
				throw err;
			}
			else{
				var coll_userReview = mongo.collection('userReview');
				var newID;
				coll_userReview .find().sort({_id: -1}).limit(1).toArray(function (err, maxID) {
					if (maxID.length > 0) {
						var maxID = maxID[0]._id;
						newID = maxID + 1;
					} else {
						newID = 1;
					}

					coll_userReview .insert({
						_id: newID,
						hostid: hostid,
						userid: user_id,
						user_review: propertyFeedback,
						user_feedback: hostFeedback,
						cleanliness: cleanliness,
						communication: communication,
						houserules: houserules,
						recommend: recommend,
						tripid: trip_id,
						host_name: host_name,
						user_name: result[0].firstname
					}, function (err, user) {
						if (err) {
							throw err;
						} else {

							var updateUserReviewed =  "Update Trip set host_reviewed = 1 where Trip_id = '"+trip_id+"'";
							mysql.fetchData(function(err,updateTrip){
								if(err){

								}else{
									console.log("review added successfully ")
									res.code = 200;
								}

							}, updateUserReviewed);
						}
						res.code = 200;
						callback(err,res);
					});

				});
			}
		},query1);


	});

};

exports.gethostreviewsforyou_ng = function (msg,callback) {
	console.log("in trips message");

	var response={};
	var hostid=msg.hostid;
	mongo.connect(mongoURL, function() {
		var coll_propertyReview = mongo.collection('propertyReview');
		coll_propertyReview.find({ host_id:hostid }).toArray(function (err,records) {
			if(err){
				response.code = "401";
				response.value = "Failed";
				throw err;
			}
			else{
				response.code = "200";
				response.value = "Sucess";
				response.records=records;
				console.dir(response.records);
				console.log("response records");
				callback(null,response);
			}
		});
	});
};

exports.gethostreviewsbyyou_ng = function(msg, callback){

	var response={};
	var hostid=msg.hostid;

	mongo.connect(mongoURL, function() {
		var coll_userReview = mongo.collection('userReview');
		coll_userReview.find({ hostid:hostid }).toArray(function (err,records) {
			if(err){
				response.code = "401";
				response.value = "Failed";
				throw err;
			}
			else{
				response.code = "200";
				response.value = "Sucess";
				response.records=records;
				console.dir(response.records);
				console.log("response records");
				callback(null,response);
			}
		});
	});
};

exports.signouthost_ng= function (msg,callback) {
	var response={};
	var query= "UPDATE host_page_click SET home='"+msg.home+"',profile='"+msg.profile+"',trips='"+msg.trips+"',messages='"+msg.messages+"',preview='"+msg.preview+"',add_property='"+msg.add_property+"',transaction='"+msg.transaction+"',reviews='"+msg.reviews+"' where host_id='"+msg.hostid+"';";
	mysql.pushData(function (err,result) {
		response.code="200";
		callback(null,response);
	},query);
};