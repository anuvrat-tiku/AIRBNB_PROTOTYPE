var mysql= require('./mysql');
var passport= require('passport');
var LocalStrategy= require('passport-local');
var bCrypt= require('bcrypt');
var mongo = require("./mongo");
var mongoURL = "mongodb://localhost:27017/airbnb";
var mongodb= require('./mongodb_ng');



exports.handle_prop_detail__sk = function(msg,callback) {

	var res = {};
	var destination = msg.destination;
	var checkin = msg.checkin;
	var checkout = msg.checkout;
	var guest = msg.guest;
	res.hostimg=[];

	var checkLogin =  "select * from property where guest >= '"+guest+"'  and (city='"+destination+"' OR address = '"+destination+"' OR state = '"+destination+"' OR zip = '"+destination+"' OR street = '"+destination+"');";
	mysql.fetchData(function(err,loginCheckResults){
		if(err){

		}else{

			if(loginCheckResults.length > 0){

			var str="";
			var host_prop_rel=[];
			for(var i=0;i<loginCheckResults.length;i++){
				str=str+"'"+loginCheckResults[i].host_id+"',";
				host_prop_rel[i]={
					property_id:loginCheckResults[i].property_id,
					host_id: loginCheckResults[i].host_id
				};
			}
			console.log("host prop relation=");
			console.dir(host_prop_rel);

			res.host_prop_rel= host_prop_rel;
			console.log("str="+str);
			var str1=str.substring(0,str.length-1);
			console.log("str1="+str1);

			var gethostimg= "select profileimg,hostid from host where hostid IN ("+str1+");";
			mysql.fetchData(function (err,result) {
				if(err){
					throw err;
				}
				else{
					console.log("result="+result.length);
					res.hostimg=result;
					callback(err,res);
				}
			},gethostimg);

				//nayan end
				res.code = 200;
				res.result = loginCheckResults;
				//res.userid = loginCheckResults[0].userid;

			}else{
				res.code = 401;
				callback(err,res);
			}
		}
		// callback(err,res);
	}, checkLogin);
}

exports.handle_prop_desc__sk = function(msg,callback) {

	var res = {};
	var propertyId = msg.propertyId;
	var checkin = msg.checkin;
	var checkout = msg.checkout;
	var total_average = 0;
	var total_cleanliness_avg = 0;
	var total_communication_avg = 0;
	var total_house_rules_avg = 0;
	var total_recommend = 0;

	//var getData =  "select B.placename,B.nearbyloc,B.love,B.extrafeatures,B.phone,B.children,B.infants,B.smoking,B.events,B.pets,B.advance,B.notice,B.from_date,B.to_date,B.min_value,B.max_value,B.currency,B.price,B.host_id,B.place,B.address,B.guestnum,B.guest_place,B.type,B.bed,B.guest,B.bathroomcountry,B.city,B.state,B.street,B.apt,B.zip,B.amenities,B.space,B.description, B.property_id,B.place,(B.bed - sum(A.Qty)) as QTY_A from bookedprop A, property B where (A.checkin > '"+checkin+"' and A.checkin <'"+checkout+"') and B.property_id ='" +propertyId+"';";
	//var getData = "select sum(Qty) as Qty_sum from bookedprop where checkin > '"+checkin +"' and checkin <'"+checkout +"' and property_id ='"+propertyId+"';";
	// var getData = "select distinct(Qty) as Qty_sum from bookedprop where checkin between '"+checkin +"' and '"+checkout +"' and property_id ='"+propertyId+"';";
	// var getData = "select Qty as Qty_sum from bookedprop where checkin between '"+checkin +"' and '"+checkout +"' and property_id ='"+propertyId+"';";
	var getData = "select distinct(Qty) as Qty_sum from bookedprop where (checkin between '"+checkin +"' and '"+checkout +"') OR (checkout between '"+checkin +"' and '"+checkout +"') OR ('"+checkin +"' between checkin and checkout) and (property_id ='"+propertyId+"');";
	mysql.fetchData(function(err,loginCheckResults){
		if(err){

		}else{
			if(loginCheckResults.length >= 0){
				console.log("before");
					console.log("Sum_Qty" + typeof(loginCheckResults[0]));
				console.dir(loginCheckResults);
				console.log("after");
				var check_str= typeof(loginCheckResults[0]);
				console.log("check_str" + check_str);
				console.log("check_str" + typeof(check_str));
				var str_undefined="undefined";

				if (check_str == str_undefined) {
					console.log("in if");
					var sum_qty = 0;
				}
				else{
					console.log("in else");

					var sum_qty = loginCheckResults[0].Qty_sum;
				}
				// console.log("Sum_Qty" + loginCheckResults[0].Qty_sum);
				//if (sum_qty == null){
				//	var sum_qty = 0;
				//	console.log("sum" + sum_qty);
				//}
				var getResult = "select * from property where property_id ='"+propertyId+"';";
				mysql.fetchData(function(err,CheckResults) {
					if (err) {

					} else{
						if (CheckResults.length > 0){
							//var visit_count= CheckResults[0].visit_count;
							//visit_count=visit_count+1;
							if ((CheckResults[0].guest_place =='Entire place')||(CheckResults[0].guest_place =='Private Room')) {
								console.log("Qty" + typeof(CheckResults[0].Qty));
								console.log(typeof(sum_qty));
								var minus= CheckResults[0].Qty - sum_qty;
								console.log("No of Qty" + minus);
								console.log("Entire Place or Private Room");
								res.Qty_available = CheckResults[0].Qty - sum_qty;
							}else if(CheckResults[0].guest_place =='Shared Room') {
								console.log("No of bed" + CheckResults[0].bed - sum_qty);
								console.log("Shared Room");
								res.Qty_available = CheckResults[0].bed - sum_qty;
							}
							else{
								console.log("No Room");
							}

					//console.log("Qty avail" + Qty_available);
					//res.code = 200;
					res.prop_result = CheckResults;
					var host = CheckResults[0].host_id;
					console.log(CheckResults);
					console.log(host);
					//res.userid = loginCheckResults[0].userid;

					var getHost = "select * from host where hostid ='" + host + "';";
					mysql.fetchData(function (err, loginCheckResults1) {
						if (err) {

						} else {
							if (loginCheckResults1.length > 0) {
								res.host_res = loginCheckResults1;


								mongo.connect(mongoURL, function () {

									var coll_propertyReview = mongo.collection('propertyReview');
									coll_propertyReview.find({propertyid: propertyId}).toArray(function (err, property) {
										if (err) {
											throw err;
										} else {
											console.log(property);

											res.review_result = property;
											var coll_propertyReview = mongo.collection('propertyReview');
											coll_propertyReview.count({propertyid: propertyId}, function (err, cntt) {
												if (err) {
													throw err;
												} else {
													console.log("count" + cntt);
													res.code = 200;
													for (i = 0; i < cntt; i++) {
														total_average = total_average + property[i].property_review;
														total_cleanliness_avg = total_cleanliness_avg + property[i].cleanliness;
														total_communication_avg = total_communication_avg + property[i].communication;
														total_house_rules_avg = total_house_rules_avg + property[i].houserules;
														total_recommend = total_recommend + property[i].recommend;
													}

													var total1 = cntt;
													var average1 = total_average / cntt;
													var cleanliness_avg1 = total_cleanliness_avg / cntt;
													var communication_avg1 = total_communication_avg / cntt;
													var house_rules_avg1 = total_house_rules_avg / cntt;
													var recommend1 = total_recommend / cntt;
													var rating1 = {
																total : total1,
														average: average1,
														cleanliness_avg : cleanliness_avg1,
														communication_avg:communication_avg1,
														house_rules_avg: house_rules_avg1,
														recommend:recommend1

													}

													res.rating = rating1;

													//update query
													var updateCnt = "update property set visit_count = visit_count + 1 where property_id ='"+propertyId+"';";
													mysql.fetchData(function(err,Results9) {
														if (err) {

														} else {
															console.log("Updated visit count");

															//nayan start

															mongodb.propertyModel.find({ propertyid: propertyId }).lean().exec(function (err,mongoresult) {
																if(err){
																	throw err;
																}
																else{
																	console.log("in mongo else of prop image");
	
																	res.mongoresult=mongoresult;
																	res.code="200";
																	res.status="property fetched";
																	console.log("before callback");
																	callback(err,res);
																	console.log("after callback");
																}
															});

															//nayan end

														}
													},updateCnt);


													//

												}
												// callback(err, res);
											});
										}

									});


								})
							}
						}
					}, getHost);
				}
				}
			},getResult);
			}
			else{
				res.code = 401;
			}
		}

	}, getData);
}

//
exports.handle_confirm_book__sk = function(msg,callback) {

	var res = {};
	var propertyId = msg.propertyId;
	var checkin = msg.checkin;
	var checkout = msg.checkout;
	var total_average = 0;
	var total_cleanliness_avg = 0;
	var total_communication_avg = 0;
	var total_house_rules_avg = 0;
	var total_recommend = 0;

	//var getData =  "select B.placename,B.nearbyloc,B.love,B.extrafeatures,B.phone,B.children,B.infants,B.smoking,B.events,B.pets,B.advance,B.notice,B.from_date,B.to_date,B.min_value,B.max_value,B.currency,B.price,B.host_id,B.place,B.address,B.guestnum,B.guest_place,B.type,B.bed,B.guest,B.bathroomcountry,B.city,B.state,B.street,B.apt,B.zip,B.amenities,B.space,B.description, B.property_id,B.place,(B.bed - sum(A.Qty)) as QTY_A from bookedprop A, property B where (A.checkin > '"+checkin+"' and A.checkin <'"+checkout+"') and B.property_id ='" +propertyId+"';";
	//var getData = "select sum(Qty) as Qty_sum from bookedprop where checkin > '"+checkin +"' and checkin <'"+checkout +"' and property_id ='"+propertyId+"';";
	var getData =  "select distinct(Qty) as Qty_sum from bookedprop where (checkin between '"+checkin +"' and '"+checkout +"') OR (checkout between '"+checkin +"' and '"+checkout +"') OR ('"+checkin +"' between checkin and checkout) and (property_id ='"+propertyId+"');";
	mysql.fetchData(function(err,loginCheckResults){
		if(err){

		}else{
			/*if(loginCheckResults.length >= 0){
				console.log("main yahan");
				var sum_qty = loginCheckResults[0].Qty_sum;
				console.log(loginCheckResults[0].Qty_sum); */
			if(loginCheckResults.length >= 0){
				console.log("before");
				console.log("Sum_Qty" + typeof(loginCheckResults[0]));
				console.dir(loginCheckResults);
				console.log("after");
				var check_str= typeof(loginCheckResults[0]);
				console.log("check_str" + check_str);
				console.log("check_str" + typeof(check_str));
				var str_undefined="undefined";

				if (check_str == str_undefined) {
					console.log("in if");
					var sum_qty = 0;
				}
				else{
					console.log("in else");

					var sum_qty = loginCheckResults[0].Qty_sum;
				}
				var getResult = "select * from property where property_id ='"+propertyId+"';";
				mysql.fetchData(function(err,CheckResults) {
					if (err) {

					} else{
						if (CheckResults.length > 0){
							console.log("No of bede" + CheckResults[0].bed);
							res.Qty_available = CheckResults[0].bed - sum_qty;
							//console.log("Qty avail" + Qty_available);
							//res.code = 200;
							res.prop_result = CheckResults;
							var host = CheckResults[0].host_id;
							console.log(CheckResults);
							console.log(host);
							//res.userid = loginCheckResults[0].userid;

							var getHost = "select * from host where hostid ='" + host + "';";
							mysql.fetchData(function (err, loginCheckResults1) {
								if (err) {

								} else {
									if (loginCheckResults1.length > 0) {
										res.host_res = loginCheckResults1;
										mongo.connect(mongoURL, function () {

											var coll_propertyReview = mongo.collection('propertyReview');
											coll_propertyReview.find({propertyid: propertyId}).toArray(function (err, property) {
												if (err) {
													throw err;
												} else {
													console.log(property);

													res.review_result = property;
													var coll_propertyReview = mongo.collection('propertyReview');
													coll_propertyReview.count({propertyid: propertyId}, function (err, cntt) {
														if (err) {
															throw err;
														} else {
															console.log("count" + cntt);
															res.code = 200;
															for (i = 0; i < cntt; i++) {
																total_average = total_average + property[i].property_review;
																total_cleanliness_avg = total_cleanliness_avg + property[i].cleanliness;
																total_communication_avg = total_communication_avg + property[i].communication;
																total_house_rules_avg = total_house_rules_avg + property[i].houserules;
																total_recommend = total_recommend + property[i].recommend;
															}

															var total1 = cntt;
															var average1 = total_average / cntt;
															var cleanliness_avg1 = total_cleanliness_avg / cntt;
															var communication_avg1 = total_communication_avg / cntt;
															var house_rules_avg1 = total_house_rules_avg / cntt;
															var recommend1 = total_recommend / cntt;
															var rating1 = {
																total : total1,
																average: average1,
																cleanliness_avg : cleanliness_avg1,
																communication_avg:communication_avg1,
																house_rules_avg: house_rules_avg1,
																recommend:recommend1

															}

															res.rating = rating1;

														}
														callback(err, res);
													});
												}

											});


										})
									}
								}
							}, getHost);
						}}
				},getResult);
			}else{
				res.code = 401;
			}
		}

	}, getData);
}

//




exports.handle_propnew_detail__sk = function(msg,callback) {

	var res = {};
	var destination = msg.destination;
	var checkin = msg.checkin;
	var checkout = msg.checkout;
	var guest = msg.guest;
	var room1 = msg.room1;
	var room2 = msg.room2;
	var room3 = msg.room3;

	console.log("room1,room2,room3="+room1+","+room2+","+typeof(room3));

	if ((typeof(room1) == "undefined") && ((typeof(room2) == "undefined") && ((typeof(room3) == "undefined")))) {
		console.log("Sahil");

		var checkLogin =  "select * from property where guest >= '"+guest+"'  and (city='"+destination+"' OR address = '"+destination+"' OR state = '"+destination+"' OR zip = '"+destination+"' OR street = '"+destination+"');";
		 mysql.fetchData(function(err,loginCheckResults){
		 if(err){

		 }else{
		 if(loginCheckResults.length > 0){

		 res.code = 200;
		 res.result = loginCheckResults;
		 //res.userid = loginCheckResults[0].userid;

		 }else{
		 res.code = 401;
		 }
		 }
		 callback(err,res);
		 }, checkLogin);
		 }

	else if ((typeof(room1) == "undefined") && (typeof(room2) == "undefined") && (typeof(room3) != "undefined")) {

		console.log("guest_place");
		var checkLogin =  "select * from property where guest >= '"+guest+"'and guest_place = '"+room3+"'  and (city='"+destination+"' OR address = '"+destination+"' OR state = '"+destination+"' OR zip = '"+destination+"' OR street = '"+destination+"');";
		mysql.fetchData(function(err,loginCheckResults){
			if(err){

			}else{
				if(loginCheckResults.length > 0){

					res.code = 200;
					res.result = loginCheckResults;
					//res.userid = loginCheckResults[0].userid;

				}else{
					res.code = 401;
				}
			}
			callback(err,res);
		}, checkLogin);

	}
	else if ((typeof(room1) == "undefined") && (typeof(room2) != "undefined") && (typeof(room3) == "undefined")) {
		console.log("FFFFF");
		console.log("guest_place");
		var checkLogin =  "select * from property where guest >= '"+guest+"'and guest_place='"+room2+"'  and (city='"+destination+"' OR address = '"+destination+"' OR state = '"+destination+"' OR zip = '"+destination+"' OR street = '"+destination+"');";
		mysql.fetchData(function(err,loginCheckResults){
			if(err){

			}else{
				if(loginCheckResults.length > 0){

					res.code = 200;
					res.result = loginCheckResults;
					//res.userid = loginCheckResults[0].userid;

				}else{
					res.code = 401;
				}
			}
			callback(err,res);
		}, checkLogin);

	}

	else if ((typeof(room1) != "undefined") && (typeof(room2) == "undefined") && (typeof(room3) == "undefined")) {
		console.log("GGGGGG");
		console.log("guest_place");
		var checkLogin =  "select * from property where guest >= '"+guest+"'and guest_place='"+room1+"'  and (city='"+destination+"' OR address = '"+destination+"' OR state = '"+destination+"' OR zip = '"+destination+"' OR street = '"+destination+"');";
		mysql.fetchData(function(err,loginCheckResults){
			if(err){

			}else{
				if(loginCheckResults.length > 0){

					res.code = 200;
					res.result = loginCheckResults;
					//res.userid = loginCheckResults[0].userid;

				}else{
					res.code = 401;
				}
			}
			callback(err,res);
		}, checkLogin);

	}
	else if ((typeof(room1) != "undefined") && (typeof(room2) != "undefined") && (typeof(room3) == "undefined")) {
		console.log("AAAAA");
		console.log("guest_place");
		var checkLogin =  "select * from property where guest >= '"+guest+"'and guest_place IN ('"+room1+"','"+room2+"')  and (city='"+destination+"' OR address = '"+destination+"' OR state = '"+destination+"' OR zip = '"+destination+"' OR street = '"+destination+"');";
		mysql.fetchData(function(err,loginCheckResults){
			if(err){

			}else{
				if(loginCheckResults.length > 0){

					res.code = 200;
					res.result = loginCheckResults;
					//res.userid = loginCheckResults[0].userid;

				}else{
					res.code = 401;
				}
			}
			callback(err,res);
		}, checkLogin);

	}

	else if ((typeof(room1) != "undefined") && (typeof(room2) == "undefined") && (typeof(room3) != "undefined")) {
		console.log("RRRRRRR");
		console.log("guest_place");
		var checkLogin =  "select * from property where guest >= '"+guest+"'and guest_place IN ('"+room1+"','"+room3+"')  and (city='"+destination+"' OR address = '"+destination+"' OR state = '"+destination+"' OR zip = '"+destination+"' OR street = '"+destination+"');";
		mysql.fetchData(function(err,loginCheckResults){
			if(err){

			}else{
				if(loginCheckResults.length > 0){

					res.code = 200;
					res.result = loginCheckResults;
					//res.userid = loginCheckResults[0].userid;

				}else{
					res.code = 401;
				}
			}
			callback(err,res);
		}, checkLogin);

	}

	else if ((typeof(room1) == "undefined") && (typeof(room2) != "undefined") && (typeof(room3) != "undefined")) {
		console.log("WWWWWW");
		console.log("guest_place");
		var checkLogin =  "select * from property where guest >= '"+guest+"'and guest_place IN ('"+room3+"','"+room2+"')  and (city='"+destination+"' OR address = '"+destination+"' OR state = '"+destination+"' OR zip = '"+destination+"' OR street = '"+destination+"');";
		mysql.fetchData(function(err,loginCheckResults){
			if(err){

			}else{
				if(loginCheckResults.length > 0){

					res.code = 200;
					res.result = loginCheckResults;
					//res.userid = loginCheckResults[0].userid;

				}else{
					res.code = 401;
				}
			}
			callback(err,res);
		}, checkLogin);

	}
	else if ((typeof(room1) != "undefined") && (typeof(room2) != "undefined") && (typeof(room3) != "undefined")) {
		console.log("WWWWWW");
		console.log("guest_place");
		var checkLogin =  "select * from property where guest >= '"+guest+"'and guest_place IN ('"+room3+"','"+room2+"','"+room1+"')  and (city='"+destination+"' OR address = '"+destination+"' OR state = '"+destination+"' OR zip = '"+destination+"' OR street = '"+destination+"');";
		mysql.fetchData(function(err,loginCheckResults){
			if(err){

			}else{
				if(loginCheckResults.length > 0){

					res.code = 200;
					res.result = loginCheckResults;
					//res.userid = loginCheckResults[0].userid;

				}else{
					res.code = 401;
				}
			}
			callback(err,res);
		}, checkLogin);

	}

}


//bidding Tuesday
exports.handle_bid_desc__sk = function(msg,callback){
var res = {};
var propertyId = msg.propertyId;
var checkin = msg.checkin;
var checkout = msg.checkout;
var total_average = 0;
var total_cleanliness_avg = 0;
var total_communication_avg = 0;
var total_house_rules_avg = 0;
var total_recommend = 0;

//var getData =  "select B.placename,B.nearbyloc,B.love,B.extrafeatures,B.phone,B.children,B.infants,B.smoking,B.events,B.pets,B.advance,B.notice,B.from_date,B.to_date,B.min_value,B.max_value,B.currency,B.price,B.host_id,B.place,B.address,B.guestnum,B.guest_place,B.type,B.bed,B.guest,B.bathroomcountry,B.city,B.state,B.street,B.apt,B.zip,B.amenities,B.space,B.description, B.property_id,B.place,(B.bed - sum(A.Qty)) as QTY_A from bookedprop A, property B where (A.checkin > '"+checkin+"' and A.checkin <'"+checkout+"') and B.property_id ='" +propertyId+"';";
var getData = "select max(bidPrice) as bidPrice from bid where Property_id='"+propertyId+"';";
mysql.fetchData(function(err,loginCheckResults){
    if(err){

    }else{
        if(loginCheckResults.length > 0){

            var bidPrice = loginCheckResults[0].bidPrice;
            res.bidPrice = bidPrice;
            console.log(loginCheckResults[0].bidPrice);
            var getResult = "select * from property where property_id ='"+propertyId+"';";
            mysql.fetchData(function(err,CheckResults) {
                if (err) {

                } else{
                    if (CheckResults.length > 0){
                        console.log("No of bede" + CheckResults[0].bed);
                        //res.Qty_available = CheckResults[0].bed - sum_qty;
                        //console.log("Qty avail" + Qty_available);
                        //res.code = 200;
                        res.prop_result = CheckResults;
                        var host = CheckResults[0].host_id;
                        console.log(CheckResults);
                        console.log(host);
                        //res.userid = loginCheckResults[0].userid;

                        var getHost = "select * from host where hostid ='" + host + "';";
                        mysql.fetchData(function (err, loginCheckResults1) {
                            if (err) {

                            } else {
                                if (loginCheckResults1.length > 0) {
                                    res.host_res = loginCheckResults1;
                                    mongo.connect(mongoURL, function () {

                                        var coll_propertyReview = mongo.collection('propertyReview');
                                        coll_propertyReview.find({propertyid: propertyId}).toArray(function (err, property) {
                                            if (err) {
                                                throw err;
                                            } else {
                                                console.log(property);

                                                res.review_result = property;
                                                var coll_propertyReview = mongo.collection('propertyReview');
                                                coll_propertyReview.count({propertyid: propertyId}, function (err, cntt) {
                                                    if (err) {
                                                        throw err;
                                                    } else {
                                                        console.log("count" + cntt);
                                                        res.code = 200;
                                                        for (i = 0; i < cntt; i++) {
                                                            total_average = total_average + property[i].property_review;
                                                            total_cleanliness_avg = total_cleanliness_avg + property[i].cleanliness;
                                                            total_communication_avg = total_communication_avg + property[i].communication;
                                                            total_house_rules_avg = total_house_rules_avg + property[i].houserules;
                                                            total_recommend = total_recommend + property[i].recommend;
                                                        }

                                                        var total1 = cntt;
                                                        var average1 = total_average / cntt;
                                                        var cleanliness_avg1 = total_cleanliness_avg / cntt;
                                                        var communication_avg1 = total_communication_avg / cntt;
                                                        var house_rules_avg1 = total_house_rules_avg / cntt;
                                                        var recommend1 = total_recommend / cntt;
                                                        var rating1 = {
                                                            total : total1,
                                                            average: average1,
                                                            cleanliness_avg : cleanliness_avg1,
                                                            communication_avg:communication_avg1,
                                                            house_rules_avg: house_rules_avg1,
                                                            recommend:recommend1

                                                        }

                                                        res.rating = rating1;
														//update query
														var updateCnt1 = "update property set visit_count = visit_count + 1 where property_id ='"+propertyId+"';";
														mysql.fetchData(function(err,Results9) {
															if (err) {

															} else {
																console.log("Updated visit count");
																//nayan start

															mongodb.propertyModel.find({ propertyid: propertyId }).lean().exec(function (err,mongoresult) {
																if(err){
																	throw err;
																}
																else{
																	console.log("in mongo else of prop image");
	
																	res.mongoresult=mongoresult;
																	res.code="200";
																	res.status="property fetched";
																	console.log("before callback");
																	callback(err,res);
																	console.log("after callback");
																}
															});

															//nayan end

															}
														},updateCnt1);


														//
                                                    }
                                                    // callback(err, res);
                                                });
                                            }

                                        });


                                    })
                                }
                            }
                        }, getHost);
                    }}
            },getResult);
        }else{
            res.code = 401;
        }
    }

}, getData);
}

exports.handle_placebid_desc__sk= function(msg,callback) {
    var res = {};
    var propertyId = msg.propertyId;
    var checkin = msg.checkin;
    //var guest = msg.guest;
    var bidPrice = msg.bidPrice;
    var hostfname = msg.hostfname;
    var hostlname = msg.hostlname;
    var hostId =  msg.hostId;
	var userFname = msg.userFname;
	var user_id = msg.user_id;
	var userLname = msg.userLname;
	var email = msg.email;
	var total = bidPrice+356;
	console.log("dfdfdfd"+ email);

    var post = {Property_id: propertyId,  bidPrice:bidPrice, UserFname:userFname, UserLname:userLname,HostFname: hostfname, HostLname: hostlname, host_id: hostId, user_id: user_id, bid:1, User_email: email,guests:msg.guests,checkin:msg.checkin,checkout:msg.checkout,type:msg.type,city:msg.city,state:msg.state,apt:msg.apt,zip:msg.zip,Street:msg.street,guest_place:msg.guest_place,place:msg.place,total :total,country:msg.country };
    var table = 'bid';

    mysql.insertRecord(function (err, results) {

        if (err) {
            throw err;
        }
        else {
            res.code = 200;
            console.log("bid added successfully ");

            //res.userid = userid;
        }
        callback(err, res);
    }, post, table);
}
//put dynamic pricing
exports.inserthostMessage_av = function(msg,callback) {
	var res = {};
	var propertyId = msg.property_id;
	var checkin = msg.checkin;
	var checkout = msg.checkout;
	var guests = msg.guests;
	var userName = msg.userName;
	var hostid = msg.hostid;
	var message_read = "no";
	var property_name =  msg.proplace;
	var prop_type = msg.prop_type;
	var prop_price1 = msg.prop_price;
	var prop_place = msg.prop_place;
	var prop_city = msg.prop_city;
	var prop_apt = msg.prop_apt;
	var user_id = msg.user_id;
	var prop_zip = msg.prop_zip;
	var prop_country = msg.prop_country;
	var prop_street = msg.prop_street;
	var user_name = msg.user_name;
	var prop_state = msg.prop_state;
	var duration = msg.duration;
	var bid = 0;

	//dynamic pricing
	var d = new Date();
	var y = d.getFullYear();
	var m = d.getMonth();
	m = Number(m) + 1;
	var dt = d.getDate();
	var currentDate = y + "-" + m + "-" + dt ;
	console.log("current date="+currentDate);
	var cin1 = "\"" + currentDate + "\"";
	var cout1 = "\"" + checkin + "\"";

	var date11 = new Date(cin1);
	var date12 = new Date(cout1);
	var timeDiff1 = Math.abs(date12.getTime() - date11.getTime());
	var dyndiff = Math.ceil(timeDiff1 / (1000 * 3600 * 24));
	console.log("difference="+dyndiff);
	if(dyndiff<=7){
		prop_price=Number(prop_price1)*2;
	}
	else if(dyndiff>7&&dyndiff<=14){
		prop_price=Number(prop_price1)*1.75;
	}
	else if(dyndiff>14&&dyndiff<=21){
		prop_price=Number(prop_price1)*1.5;
	}
	else if(dyndiff>21&&dyndiff<=30){
		prop_price=Number(prop_price1)*1.25;
	}
	else{
		prop_price=prop_price1;
	}


	//dynamic Pricing


	var total = prop_price * duration+356;

	var status = "Pending";
	if ((prop_place =="Entire Place")||(prop_place=="Private Room")){
		var Qty = msg.prop_qty;
		console.log("I am in Entire Property" + msg.prop_qty);

	}
	else {
		var Qty = msg.guests;
		console.log("I am in not Property" + msg.guests);
	}



	console.log(total);
	var bill1 = {from_date:checkin,to_date:checkout,prop_type:prop_type,price:prop_price,total:total,duration:duration,host_id:hostid,user_id:user_id,no_guest:guests,user_fname:user_name,accom_type:prop_place,city:prop_city,state:prop_state,apartment:prop_apt,zip:prop_zip,country:prop_country,street:prop_street}
	//var post = {property_id: propertyId,  checkin:checkin, checkout:checkout, Qty:guests,UserName: userName, user_id: user_id, host_id:hostid, message_read:message_read, property_name: property_name};
	var table = 'bill';

	mysql.insertRecord(function (err, results) {

		if (err) {
			throw err;
		}
		else {
			//res.code = 200;
			var billmax = "select max(bill_id) as bill_id from bill;";
			mysql.fetchData(function (err, Results1) {
				if (err) {

				} else {
					if (Results1.length > 0) {
						var bill = Results1[0].bill_id;
						var post = {property_id: propertyId,  checkin:checkin, checkout:checkout, Qty:Qty,UserName:user_name , user_id: user_id, host_id:hostid, message_read:message_read, property_name: property_name,bill_id:bill,status:status,guest:guests,price:prop_price,total:total,bid:bid};
						var table2 = 'host_message';
						mysql.insertRecord(function (err, Results2) {
							if (err) {
								console.log("insert not into message");
							} else {

									res.code = 200;
								console.log("insert into message");

							}
							callback(err, res);
						},post,table2);
					}
				}
			},billmax);

			//res.userid = userid;
		}
		//callback(err, res);
	}, bill1, table);
}

exports.getuserMessage_sk = function (msg,callback) {
	console.log("in host message");

	var response={};
	var query= "SELECT * FROM user_message WHERE user_id= '"+msg.user_id+"';";
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

exports.gettrips_sk = function (msg,callback) {
	console.log("in host message");

	var response={};
	var query= "SELECT * FROM Trip WHERE Checkout < Current_Timestamp and user_id= '"+msg.user_id+"';";
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

exports.getfuturetrips_sk = function (msg,callback) {
	console.log("in trips message");

	var response={};
	var query= "SELECT * FROM Trip WHERE Checkout > Current_Timestamp and user_id= '"+msg.user_id+"';";
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

exports.futureeditTrips_sk = function(msg,callback) {
    var checkin = msg.checkin;
    var checkout = msg.checkout;
    var duration = msg.duration;
    var property = msg.property;
    var bill = msg.bill;
    var trip = msg.trip;
    console.log("in trips message");

    var res={};
    var query3= "select price from bill where bill_id = '"+msg.bill+"';";

    mysql.fetchData(function (err,result) {
        if(err){
            throw err;
        }
        else {
            var price  = result[0].price;
            var total = result[0].price * duration + 356;

            var query4= "update bill set total = '"+total+"', from_date = '"+checkin+"',to_date ='"+checkout+"',price ='"+price+"',duration ='"+duration+"' where bill_id = '"+msg.bill+"';";
            mysql.fetchData(function (err,result) {
                if (err) {
                    throw err;
                }
                else {

                    var query5= "update host_message set message_read = 'no' , checkin = '"+checkin+"',checkout ='"+checkout+"',status = 'pending'  where bill_id = '"+msg.bill+"';";
                    mysql.fetchData(function (err,result2) {
                        if (err) {
                            throw err;
                        }
                        else {
                            console.log("done");
							res.code =200;
							callback(err, res);
                        }

                    },query5);


                }
            },query4);
        }
        },query3);
};



exports.delfuturetrips_sk = function (msg,callback) {
	console.log("in trips message");

	var response={};
	var query= "Delete FROM bill WHERE bill_id= '"+msg.bill+"'and user_id= '"+msg.user_id+"';";
	mysql.fetchData(function (err,result) {
		if(err){
			throw err;
		}
		else{
			console.log('message fetched='+result.length);
			var query2 = "Delete FROM Trip WHERE Trip_id= '"+msg.trip+"'and user_id= '"+msg.user_id+"';";
			mysql.fetchData(function (err,result1) {
				if (err) {
					throw err;
				}
				else {
					var query3 = "Delete FROM bookedprop WHERE Trip_id= '"+msg.trip+"'and user_id= '"+msg.user_id+"';";
					mysql.fetchData(function (err,result2) {
						if (err) {
							throw err;
						}
						else {
							response.code = "200";
							response.status = "messages deleted";
							callback(null, response);
						}
					},query3);

				}
			},query2);
		}
		console.log("outside2");

	},query);
};

exports.user_transaction_history = function (msg,callback) {
    var response={};
    var query= "SELECT * FROM bill WHERE user_id='"+msg.userid+"';";
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

exports.handle_request_getUserBills_ab = function(msg, callback){

    var res = {};
    var searchCriteria = msg.searchString;
    var user_id = msg.user_id;
    console.log("in server search is "+searchCriteria)

    var getBill = "Select * from bill where bill_date like '"+searchCriteria+"' and user_id ='"+ user_id+"';";

    mysql.fetchData(function (err, billResults) {
        if (err) {

        } else {

            res.code = 200;
            res.billResults = billResults;
            callback(err,res);


        }
    }, getBill);


}