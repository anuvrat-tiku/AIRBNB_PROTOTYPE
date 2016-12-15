var mysql = require('./mysql');
var mongo = require("./mongo");
var mongoURL = "mongodb://localhost:27017/airbnb";

exports.handle_request_getAdminHomepage_ab = function(msg, callback){

    var res = {};

    var findInactiveHosts = "select * from host where active = 'pending'";
    mysql.fetchData(function (err, hostResults) {
        if (err) {

        } else {
                res.code = 200;
                res.hostResults = hostResults;
                callback(err,res);

        }
    }, findInactiveHosts);

}


exports.handle_request_getHosts_ab = function(msg,callback) {

    var res = {};

    var cities = [];

    console.log("1")

    var findArea = "select distinct city from host";
    mysql.fetchData(function (err, areaResults) {
        if (err) {

        } else {
            if (areaResults.length > 0) {

                for (i in areaResults) {
                    cities.push(areaResults[i].city)
                }

                console.log("2")

                var findHosts = "select *, city from host";
                mysql.fetchData(function (err, hostResults) {
                    if (err) {

                    } else {
                        if (hostResults.length > 0) {

                            res.code = 200;
                            res.hostResults = hostResults;
                            res.cities = cities;

                        console.log("4")

                            callback(err,res);

                        } else {
                        }
                    }
                }, findHosts);
            } else {
            }
        }
    }, findArea);
}

exports.handle_request_getBills_ab = function(msg, callback){

    var res = {};
    var searchCriteria = msg.searchString;
    console.log("in server search is "+searchCriteria)

    var getBill = "Select * from bill where bill_date like '"+searchCriteria+"'";

    mysql.fetchData(function (err, billResults) {
        if (err) {

        } else {

                res.code = 200;
                res.billResults = billResults;
                callback(err,res);


        }
    }, getBill);


}

exports.handle_request_getUsers_ab = function(msg,callback) {

    var res = {};

    var getUser = "Select * from users";

    mysql.fetchData(function (err, userResults) {
        if (err) {

        } else {

            res.code = 200;
            res.users = userResults;
            callback(err,res);


        }
    }, getUser);

}


exports.handle_request_getUserTrack_ab = function(msg, callback){

    var res = {};

    var userid = msg.userid;


    mongo.connect(mongoURL, function() {

        var coll_userTracking_ab = mongo.collection('userTracking');

        coll_userTracking_ab.find({userid: userid}).toArray(function (err, tracking) {

            res.code = 200;
            res.tracking = tracking;
            callback(err, res);
        });
    });
}


exports.handle_request_declineHost_ab  = function(msg,callback) {

    var res = {};
    var hostid = msg.hostid;

    var declineHost = "Update host set active = 'rejected' where hostid = '"+hostid+"'";

    mysql.fetchData(function (err, billResults) {
        if (err) {

        } else {

            
            var fetchHostEmail = "select email from host where hostid = '"+hostid+"'";

            mysql.fetchData(function (err, email) {
                if (err) {

                } else {

                    res.email = email[0].email
                    res.code = 200;
                    callback(err,res);
                }
            }, fetchHostEmail);
        }
    }, declineHost);


}

exports.handle_request_acceptHost_ab  = function(msg,callback) {

   var res = {};
    var hostid = msg.hostid;

    var acceptHost = "Update host set active = 'accepted' where hostid = '"+hostid+"'";

    mysql.fetchData(function (err, billResults) {
        if (err) {

        } else {

            var fetchHostEmail = "select email from host where hostid = '"+hostid+"'";

            mysql.fetchData(function (err, email) {
                if (err) {

                } else {

                    res.email = email[0].email
                    res.code = 200;
                    callback(err,res);
                }
            }, fetchHostEmail);

        }
    }, acceptHost);

}

exports.handle_request_biddingProperties_ab = function(msg,callback) {

    var res = {};

    var fetchProperties = "Select distinct property_id from bid";

    mysql.fetchData(function (err, bidProperties) {
        if (err) {

        } else {
           var properties = [];
           for(i in bidProperties){
               properties.push(bidProperties[i].property_id)
           }

            res.code = 200;
            res.properties = properties;
            callback(err,res);
        }
    }, fetchProperties);
}

exports.handle_request_biddingAnalytics_ab = function(msg, callback){

    var res = {};

    var propertyid = msg.propertyID;

    var getBidding = "select user_id, userfname, bidPrice, bidTime from bid where property_id = '"+propertyid+"'";

    mysql.fetchData(function (err, bidDetails) {
        if (err) {

        } else {
            res.code = 200;
            res.bidDetails = bidDetails;
            callback(err,res);
        }
    }, getBidding);

}


exports.handle_request_getGraphs_ab = function(msg,callback) {

    var res = {};

    var getCityWiseGraph =  "select sum(trip.price) as price, property.city from property inner join trip where property.property_id = trip.propertyid group by property.city";


    console.log("here sending")
    mysql.fetchData(function(err,graphResults){
        if(err){

        }else{
            if(graphResults.length > 0){

                var city_price = [];
                var city_city = [];

                for(i in graphResults){
                    city_price.push(graphResults[i].price)
                    city_city.push(graphResults[i].city)
                }

                var getPropertyWiseGraph = "select sum(trip.price) as price, property.property_id from property inner join trip where property.property_id = trip.propertyid group by property.property_id";

                mysql.fetchData(function(err,graphPropertyResults) {
                    if (err) {

                    } else {
                        if (graphPropertyResults.length > 0) {

                            var property_price = [];
                            var property_city = [];


                            for(i in graphPropertyResults){
                                property_price.push(graphPropertyResults[i].price)
                                property_city.push(graphPropertyResults[i].property_id)
                            }

                            var fetchMaxHost = "select hostid as host, count(propertyid) as propertyid, sum(price) as total from trip group by hostid order by 2 desc";

                            mysql.fetchData(function (err, maxHosts) {
                                if (err) {

                                } else {
                                    var maxHosts_host = [];
                                    var maxHosts_property = [];
                                    var maxHosts_price = [];

                                    for(i in maxHosts){
                                        maxHosts_host.push(maxHosts[i].host)
                                        maxHosts_property.push(maxHosts[i].propertyid)
                                        maxHosts_price.push(maxHosts[i].total)
                                    }

                                    res.code = 200;
                                    res.city_price = city_price;
                                    res.city_city = city_city;
                                    res.property_price = property_price;
                                    res.property_city = property_city;
                                    res.maxHosts_hostid = maxHosts_host;
                                    res.maxHosts_property = maxHosts_property;
                                    res.maxHosts_price = maxHosts_price;
                                    callback(err,res);


                                }
                            }, fetchMaxHost);



                        }

                    }
                },getPropertyWiseGraph);



            }else{
            }
        }
    }, getCityWiseGraph);

}

exports.handle_request_fetchHostDetails_ab = function(msg, callback){

    var res={};
    var hostid = msg.hostid

    var fetchHost =  "select * from host where hostid = '"+hostid+"'";

    mysql.fetchData(function(err,hostResults){
        if(err){

        }else{
            if(hostResults.length > 0){

                currentHost_ab = hostResults[0];

                res.code = 200;
                res.currentHost_ab = currentHost_ab;
                callback(err,res);

            }else{
            }
        }
    }, fetchHost);
}

