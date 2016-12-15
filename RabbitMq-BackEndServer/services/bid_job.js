var mysql= require('./mysql');
var passport= require('passport');
var mongo = require("./mongo");
var mongoURL = "mongodb://localhost:27017/airbnb";


exports.bid_job = {

    after: {
        seconds: 0,
        minutes: 0,
        hours: 0,
        days: 1
    },
    job: function (req, res) {

        var output = '';
        var id = '';
        var bidEndTimeChk = "Select property_id from property where endbid <= NOW() and bidstate = '1';";

        mysql.fetchData(function (err, results) {
            if (err) {
                throw err;
            }
            else {
                if (results.length > 0) {
                    console.log("Bid Complete 4 days time met for following jobs." + "\n");
                    console.log(results);
                    for (var i in results) {
                        var output = results[i];
                        var id = output.property_id;
                        console.log("Updating the Query" + id);

                        var insMaxBid = "INSERT INTO bill (from_date,to_date,prop_type,price,total,host_id,user_id,no_guest,user_fname,accom_type,city,state,apartment,zip,country,street) Select checkin,checkout,type,max(bidPrice),total,host_id,user_id,guests,UserFname,guest_place,city,state,apt,zip,country,Street from bid where property_id = '" + id +"' group by checkin,checkout,type,total,host_id,user_id,guests,UserFname,guest_place,city,state,apt,zip,country,Street;";
                        mysql.fetchData(function (err, results) {
                            if (err) {
                                throw err;
                            }
                            else {
                                //changes
                                var findMaxBid = "select max(bill_id) as maxBid from bill";
                                mysql.fetchData(function (err, maxBidResult) {
                                    if (err) {
                                        throw err;
                                    }
                                    else {

                                        var maxBid = maxBidResult[0].maxBid;
                                        console.log(maxBid);

                                      //  for (var x in results) {
                                            var insMess = "INSERT INTO host_message (host_id,checkin,checkout,UserName,user_id,bill_id,guest, total,price) Select host_id,from_date,to_date ,user_fname,user_id,bill_id,no_guest,total,price from bill where bill_id = " + maxBid +";";

                                            mysql.fetchData(function (err, results) {
                                                if (err) {
                                                    throw err;
                                                }
                                                else {
                                                    console.log("bidding done");
                                                }
                                            },insMess);
                                       // }

                                    }
                                },findMaxBid);


                                //changes
                            }
                        },insMaxBid);
                        //
                    }
                }
                else {
                }
            }
        }, bidEndTimeChk);
    }
}