var mq_client = require('../rpc/client');
var ejs = require('ejs');
var nodemailer = require("nodemailer");
var winston=require('winston');
var fs = require('fs');

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

function base64_decodevideo_ng(name,video) {
    console.log("in decode="+__dirname);
        var finalname= __dirname + "/../public/"+name+".mp4";
    console.log("file="+finalname);
  fs.writeFile(finalname, new Buffer(video, "base64"), function(err) {});
}

var smtpTransport = nodemailer.createTransport("SMTP",{
   service: "Gmail",  // sets automatically host, port and connection security settings
   auth: {
       user: "nayalgoel@gmail.com",
       pass: "shimisawesome"
   }
});

// var mysql = require('./mysql');

exports.login_ab = function(req,res){
    winston.log('info','admin is the user.',new Date(), 'Admin has clicked on login.');
    ejs.renderFile('./views/admin_Login_ab.ejs', { title: 'Admin Portal' } , function(err, result) {
        if (!err) {
            res.end(result);
        }
        else {
            res.end('An error occurred');
            console.log(err);
        }
    });
}

exports.getHosts = function(req, res){
     winston.log('info','admin is the user.',new Date(), 'Admin has clicked on get hosts.');

    if(!req.session.filtercities_ab) {

        var msg_payload = {};

        mq_client.make_request('getHosts_queue_ab', msg_payload, function (err, results) {
            if (err) {
                throw err;
            }
            else {
                if (results.code == 200) {
                    console.log("back in client");
                    req.session.hostResults_ab = results.hostResults;
                    req.session.cities_ab = results.cities;

                    ejs.renderFile('./views/hosts_ab.ejs', {
                        title: 'Welcome to Airbnb',
                        cities: req.session.cities_ab,
                        checkcities: req.session.cities_ab,
                        hosts: req.session.hostResults_ab
                    }, function (err, result) {
                        if (!err) {
                            res.end(result);
                        }
                        else {
                            res.end('An error occurred');
                            console.log(err);
                        }
                    });

                }else if (results.code == 201) {
                    console.log("phone not updated")
                }

            }
        });


    }else{

        ejs.renderFile('./views/hosts_ab.ejs', {
            title: 'Welcome to Airbnb',
            cities: req.session.cities_ab,
            checkcities:req.session.filtercities_ab,
            hosts:  req.session.hostResults_ab
        }, function (err, result) {
            if (!err) {
                res.end(result);
            }
            else {
                res.end('An error occurred');
                console.log(err);
            }
        });
    }
}


exports.checkInactiveHosts_ab = function(req,res){
 winston.log('info','admin is the user.',new Date(), 'Admin has clicked on get messages.');
    var msg_payload = {};

    mq_client.make_request('getAdminPage_queue_ab', msg_payload, function (err, results) {
        if (err) {
            throw err;
        }
        else {
            if (results.code == 200) {

                ejs.renderFile('./views/host_messages_ab.ejs', { title: 'Welcome to Admin Portal', inactive: results.hostResults.length, inactiveHosts: results.hostResults } , function(err, result) {
                    if (!err) {
                        res.end(result);
                    }
                    else {
                        res.end('An error occurred');
                        console.log(err);
                    }
                });

            }else if (results.code == 201) {
                console.log("users not found")
            }

        }
    });


}


exports.search_Users_ab = function(req,res){
     winston.log('info','admin is the user.',new Date(), 'Admin has clicked on search users.');

    var msg_payload = {};

    mq_client.make_request('getUsers_queue_ab', msg_payload, function (err, results) {
        if (err) {
            throw err;
        }
        else {
            if (results.code == 200) {

            req.session.allUsers_ab = results.users;

                ejs.renderFile('./views/allUsers_ab.ejs', { title: 'Welcome to Airbnb', users: req.session.allUsers_ab } , function(err, result) {
                    if (!err) {
                        res.end(result);
                    }
                    else {
                        res.end('An error occurred');
                        console.log(err);
                    }
                });

            }else if (results.code == 201) {
                console.log("users not found")
            }

        }
    });
}

exports.fetchUser_ab = function(req,res){
     winston.log('info','admin is the user.',new Date(), 'Admin has clicked on fetch users.');

    var userid = req.param("userid")

    var msg_payload = {"userid": userid};

    mq_client.make_request('getUserTrack_queue_ab', msg_payload, function (err, results) {
        if (err) {
            throw err;
        }
        else {

            if (results.code == 200) {

                for(i in req.session.allUsers_ab){
                    if(req.session.allUsers_ab[i].userid == userid){
                        req.session.currentUser_ab = req.session.allUsers_ab[i];
                    }
                }

                if(results.tracking.length > 0){

                    var tracks = results.tracking[0].track;

                    var activities_ab = [];
                    var timestamps_ab = [];

                    for(i in tracks){
                        activities_ab.push(tracks[i].activity)
                        tp = new Date(tracks[i].timestamp)
                        timestamps_ab.push(tp)
                    }

                    var time_diff = [];

                    for(i in timestamps_ab){
                        if(i > 0){
                            diff = (timestamps_ab[i] - timestamps_ab[i-1])/1000
                            time_diff.push(diff)
                        }else{
                            time_diff.push(0)
                        }
                    }

                    req.session.currentUser_ab.graph = 1
                    req.session.currentUser_ab.activities = activities_ab
                    req.session.currentUser_ab.time_diff = time_diff


                }else{
                    req.session.currentUser_ab.graph = 0
                }

                res.send({"statuscode": 200});


            }else if (results.code == 201) {
                console.log("users not found")
            }
        }
    });

}

exports.viewUserDetails_ab = function(req,res){
     winston.log('info','admin is the user.',new Date(), 'Admin has clicked on view user details.');

    ejs.renderFile('./views/viewUser_ab.ejs', { title: 'Welcome to Airbnb', user: req.session.currentUser_ab } , function(err, result) {
        if (!err) {
            res.end(result);
        }
        else {
            res.end('An error occurred');
            console.log(err);
        }
    });

}


exports.searchBills_ab = function(req,res){
     winston.log('info','admin is the user.',new Date(), 'Admin has clicked on search bills.');

    var value = req.param("value")
    var criteria = req.param("criteria")

    console.log(value)
    console.log(criteria)

    var searchString = '';

    if(criteria == 'Date'){
        searchString = '%-'+value+'%'
    }

    if(criteria == 'Month'){
        searchString = '%-'+value+'-%'
    }

    if(criteria == 'Year'){
        searchString = ''+value+'-%'
    }

    var msg_payload = {"searchString": searchString};

    mq_client.make_request('getBills_queue_ab', msg_payload, function (err, results) {
        if (err) {
            throw err;
        }
        else {
            if (results.code == 200) {


            if(results.billResults.length > 0){
                req.session.allbills_ab = results.billResults;
            }else if(results.billResults.length == 0){
                console.log("no ")
                req.session.allbills_ab = null;
            }

                res.send({"statuscode": 200});


            }else if (results.code == 201) {
                console.log("phone not updated")
            }

        }
    });
}



exports.fetchHostDetails_ab = function(req, res){
     winston.log('info','admin is the user.',new Date(), 'Admin has clicked on get host details.');

    console.log("checking hrere")

    var hostid = req.param("hostid");

    var msg_payload = {"hostid": hostid};

    mq_client.make_request('fetchHostDetails_queue_ab', msg_payload, function (err, results) {
        if (err) {
            throw err;
        }
        else {
            if (results.code == 200) {

                console.log("host details required")

                req.session.currentHost_ab = results.currentHost_ab;

            console.log("reached back in host fetch")

                res.send({"statuscode": 200});

            }else if (results.code == 201) {
                console.log("phone not updated")
            }

        }
    });
}

exports.filterHostCity_ab = function(req,res){
     winston.log('info','admin is the user.',new Date(), 'Admin has clicked on filter');

    var newcities = req.param('cities')
    req.session.filtercities_ab = newcities;

    res.send({"statuscode": 200});
}

exports.displayHostDetails_ab = function(req,res){
     winston.log('info','admin is the user.',new Date(), 'Admin has clicked on get host details.');
     console.dir(req.session.currentHost_ab);
                    console.log("img length");
                    base64_decode_ng("admin_hostimg",req.session.currentHost_ab.profileimg);
    ejs.renderFile('./views/viewHost_ab.ejs', { title: 'Welcome to Airbnb', host: req.session.currentHost_ab } , function(err, result) {
        if (!err) {
            res.end(result);
        }
        else {
            res.end('An error occurred');
            console.log(err);
        }
    });
}


exports.viewGraph_ab = function(req,res) {
     winston.log('info','admin is the user.',new Date(), 'Admin has clicked on dashboard.');

    var msg_payload = {};

    mq_client.make_request('getGraphs_queue_ab', msg_payload, function (err, results) {
        if (err) {
            throw err;
        }
        else {
            if (results.code == 200) {

                ejs.renderFile('./views/viewGraph_ab.ejs', { title: 'Welcome to Airbnb',
                        property_city: results.property_city, property_price: results.property_price, city_city: results.city_city, city_price: results.city_price,
                        maxHosts_hostid : results.maxHosts_hostid, maxHosts_property : results.maxHosts_property, maxHosts_price : results.maxHosts_price
                    } ,
                    function(err, result) {
                        if (!err) {
                            res.end(result);
                        }
                        else {
                            res.end('An error occurred');
                            console.log(err);
                        }
                    });

            }else if (results.code == 201) {
                console.log("phone not updated")
            }

        }
    });

}

exports.search_BillsPage_ab = function(req,res) {
     winston.log('info','admin is the user.',new Date(), 'Admin has clicked on search bills.');

    ejs.renderFile('./views/searchBill_ab.ejs', { title: 'Welcome to Airbnb'} ,
        function(err, result) {
            if (!err) {
                res.end(result);
            }
            else {
                res.end('An error occurred');
                console.log(err);
            }
        });
}

exports.bills_Page_ab = function(req,res){
     winston.log('info','admin is the user.',new Date(), ' On Bill page .');
console.log("here")

    var len;

    if(req.session.allbills_ab != null){
        len = req.session.allbills_ab.length
    }else{
        len = 0
    }

    ejs.renderFile('./views/bills_ab.ejs', { title: 'Welcome to Airbnb', bills: req.session.allbills_ab, length: len} ,
        function(err, result) {
            if (!err) {
                res.end(result);
            }
            else {
                res.end('An error occurred');
                console.log(err);
            }
        });

}

exports.openBill_ab = function(req,res){
     winston.log('info','admin is the user.',new Date(), 'Bill page opens up.');
    var bill_id = req.param("bill_id")

    req.session.currentBillId_ab = bill_id;

    res.send({"statuscode": 200});
}



exports.billDetails_ab = function(req,res){
     winston.log('info','admin is the user.',new Date(), 'Admin has see the bill details.');

    var currentBill;
    for(i in req.session.allbills_ab){

        if(req.session.allbills_ab[i].bill_id == req.session.currentBillId_ab){
            currentBill = req.session.allbills_ab[i]
        }
    }

    ejs.renderFile('./views/bill_ab.ejs', { title: 'Welcome to Airbnb', bill: currentBill } ,
                    function(err, result) {
                        if (!err) {
                            res.end(result);
                        }
                        else {
                            res.end('An error occurred');
                            console.log(err);
                        }
                    });
    
}


exports.acceptHost_ab = function(req,res){
     winston.log('info','admin is the user.',new Date(), 'Admin has clicked on accept to accept host.');

    var hostid = req.param("hostid")

    var msg_payload = {"hostid": hostid};

    mq_client.make_request('acceptHost_queue_ab', msg_payload, function (err, results) {
        if (err) {
            throw err;
        }
        else {
            if (results.code == 200) {

                smtpTransport.sendMail({  //email options
                   from: "Airbnb <nayangoel@gmail.com>", // sender address.  Must be the same as authenticated user if using Gmail.
                   to: "Receiver Name <"+results.email+">", // receiver
                   subject: "Welcome To Airbnb", // subject
                   text: "Your request to become a host has been approved by the admin. Kindly visit the link (http://localhost:3000) to start using Airbnb." // body
                }, function(error, response){  //callback
                   if(error){
                       console.log(error);
                   }else{
                       console.log("Message sent: " + response.message);
                   }
                   
                   smtpTransport.close(); // shut down the connection pool, no more messages.  Comment this line out to continue sending emails.
                });

                res.send({"statuscode": 200});


            }else if (results.code == 201) {
                console.log("phone not updated")
            }

        }
    });
}


exports.declineHost_ab = function(req,res){
     winston.log('info','admin is the user.',new Date(), 'Admin has clicked on decline to decline hosts.');

    var hostid = req.param("hostid")

    var msg_payload = {"hostid": hostid};

    mq_client.make_request('declineHost_queue_ab', msg_payload, function (err, results) {
        if (err) {
            throw err;
        }
        else {
            if (results.code == 200) {

                smtpTransport.sendMail({  //email options
                   from: "Airbnb <nayangoel@gmail.com>", // sender address.  Must be the same as authenticated user if using Gmail.
                    to: "Receiver Name <"+results.email+">", // receiver
                   subject: "Welcome To Airbnb", // subject
                   text: "Your request to become a host has been denied by the admin. We're extremely apologetic." // body
                }, function(error, response){  //callback
                   if(error){
                       console.log(error);
                   }else{
                       console.log("Message sent: " + response.message);
                   }
                   
                   smtpTransport.close(); // shut down the connection pool, no more messages.  Comment this line out to continue sending emails.
                });

                res.send({"statuscode": 200});

            }else if (results.code == 201) {
                console.log("phone not updated")
            }

        }
    });

}

exports.index = function(req, res){
     winston.log('info','admin is the user.',new Date(), 'Admin is logged in.');

    req.session.filtercities_ab = null;

    var msg_payload = {};

    mq_client.make_request('getAdminPage_queue_ab', msg_payload, function (err, results) {
        if (err) {
            throw err;
        }
        else {
            if (results.code == 200) {

                ejs.renderFile('./views/index_admin_ab.ejs', { title: 'Welcome to Admin Portal', inactive: results.hostResults.length } , function(err, result) {
                    if (!err) {
                        res.end(result);
                    }
                    else {
                        res.end('An error occurred');
                        console.log(err);
                    }
                });

            }else if (results.code == 201) {
                console.log("users not found")
            }

        }
    });

};

exports.BidGraph_ab = function(req,res){
     winston.log('info','admin is the user.',new Date(), 'Admin has see the bid graph.');

    ejs.renderFile('./views/bidGraph_ab.ejs', { title: 'Bid Graph', bidUsers: req.session.bidUsers_ab, bidValues: req.session.bidBids_ab } , function(err, result) {
        if (!err) {
            res.end(result);
        }
        else {
            res.end('An error occurred');
            console.log(err);
        }
    });

};

exports.get_BiddingProperties_ab = function(req,res){
     winston.log('info','admin is the user.',new Date(), 'Admin fetches all bidding properties.');

    var msg_payload = {};

    mq_client.make_request('get_BiddingProperties_queue_ab', msg_payload, function (err, results) {
        if (err) {
            throw err;
        }
        else {
            if (results.code == 200) {

                res.send({"statuscode": 200, "properties":results.properties })

            }else if (results.code == 201) {
                console.log("users not found")
            }

        }
    });

};

exports.get_BiddingAnalytics_ab = function(req,res){
     winston.log('info','admin is the user.',new Date(), 'Admin has clicked on get View bid analytics.');

    var propertyID = req.param("propertyID")

    var msg_payload = {"propertyID": propertyID};

    mq_client.make_request('get_BiddingAnalytics_queue_ab', msg_payload, function (err, results) {
        if (err) {
            throw err;
        }
        else {
            if (results.code == 200) {

                var allBids_ab = results.bidDetails;

                var userID_ab = [];
                var bids_ab = [];

                for(i in allBids_ab){
                    if(allBids_ab[i].user_id != null){
                        userID_ab.push(allBids_ab[i].user_id)
                    }else{
                        userID_ab.push('0')
                    }

                    if(allBids_ab[i].bidPrice != null){
                        bids_ab.push(allBids_ab[i].bidPrice)
                    }else{
                        bids_ab.push(0)
                    }
                }

                req.session.bidUsers_ab = userID_ab
                req.session.bidBids_ab = bids_ab;

                res.send({"statuscode": 200 })

            }else if (results.code == 201) {
                console.log("users not found")
            }

        }
    });

};




