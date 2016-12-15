var amqp = require('amqp')
 , util = require('util');

var amqp = require('amqp')
    , util = require('util');
var host= require('./services/host_tg');
var bill= require('./services/bill_ng');
var prop = require('./services/prop_sk');
var admin= require('./services/admin');


var bCrypt= require('bcrypt');

var user   = require('./services/user');

var mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/airbnb?pool=100');

 var cnn = amqp.createConnection({url: "amqp://localhost"})

 //sahil cron start

var cronjob = require('node-cron-job');


cronjob.setJobsPath(__dirname + '/services/bid_job.js');  // Absolute path to the jobs module.

cronjob.startJob('bid_job');
//sahil cron end

// add this for better debuging
cnn.on('error', function(e) {
    console.log("Error from amqp: ", e);
});

cnn.on('ready', function() {

    console.log("Server is ready and is listening");

    //anvita start

    cnn.queue('login_queue_ab', function(q){
        console.log("listening on login_queue_ab");
        q.subscribe(function(message, headers, deliveryInfo, m){
            util.log(util.format( deliveryInfo.routingKey, message));
            util.log("Message: "+JSON.stringify(message));
            util.log("DeliveryInfo: "+JSON.stringify(deliveryInfo));
            user.handle_request_login_ab(message, function(err,res){

                //return index sent
                cnn.publish(m.replyTo, res, {
                    contentType:'application/json',
                    contentEncoding:'utf-8',
                    correlationId:m.correlationId
                });
            });
        });
    });   // end login_queue_ab

    cnn.queue('signup_queue_ab', function(q){
        console.log("listening on signup_queue_ab");
        q.subscribe(function(message, headers, deliveryInfo, m){
            util.log(util.format( deliveryInfo.routingKey, message));
            util.log("Message: "+JSON.stringify(message));
            util.log("DeliveryInfo: "+JSON.stringify(deliveryInfo));
            user.handle_request_signup_ab(message, function(err,res){

                //return index sent
                cnn.publish(m.replyTo, res, {
                    contentType:'application/json',
                    contentEncoding:'utf-8',
                    correlationId:m.correlationId
                });
            });
        });
    });   // end signup_queue


    cnn.queue('checkProfile_queue_ab', function(q){
        console.log("listening on profile_queue_ab");
        q.subscribe(function(message, headers, deliveryInfo, m){
            util.log(util.format( deliveryInfo.routingKey, message));
            util.log("Message: "+JSON.stringify(message));
            util.log("DeliveryInfo: "+JSON.stringify(deliveryInfo));
            user.handle_request_checkProfile_ab(message, function(err,res){

                //return index sent
                cnn.publish(m.replyTo, res, {
                    contentType:'application/json',
                    contentEncoding:'utf-8',
                    correlationId:m.correlationId
                });
            });
        });
    });   // end checkProfile_queue_ab


    cnn.queue('updatePhone_queue_ab', function(q){
        console.log("listening on updatePhone_queue_ab");
        q.subscribe(function(message, headers, deliveryInfo, m){
            util.log(util.format( deliveryInfo.routingKey, message));
            util.log("Message: "+JSON.stringify(message));
            util.log("DeliveryInfo: "+JSON.stringify(deliveryInfo));
            user.handle_request_updatePhone_ab(message, function(err,res){

                //return index sent
                cnn.publish(m.replyTo, res, {
                    contentType:'application/json',
                    contentEncoding:'utf-8',
                    correlationId:m.correlationId
                });
            });
        });
    });   // end updatePhone_queue_ab


    cnn.queue('profile_Update_queue_ab', function(q){
        console.log("listening on profile_Update_queue_ab");
        q.subscribe(function(message, headers, deliveryInfo, m){
            util.log(util.format( deliveryInfo.routingKey, message));
            util.log("Message: "+JSON.stringify(message));
            util.log("DeliveryInfo: "+JSON.stringify(deliveryInfo));
            user.handle_request_profileUpdate_ab(message, function(err,res){

                //return index sent
                cnn.publish(m.replyTo, res, {
                    contentType:'application/json',
                    contentEncoding:'utf-8',
                    correlationId:m.correlationId
                });
            });
        });
    });   // end updatePhone_queue_ab

    cnn.queue('profileImage_Update_queue_ab', function(q){
        console.log("listening on profileImage_Update_queue_ab");
        q.subscribe(function(message, headers, deliveryInfo, m){
            util.log(util.format( deliveryInfo.routingKey, message));
            util.log("Message: "+JSON.stringify(message));
            util.log("DeliveryInfo: "+JSON.stringify(deliveryInfo));
            user.profileImage_Update_ab(message, function(err,res){

                //return index sent
                cnn.publish(m.replyTo, res, {
                    contentType:'application/json',
                    contentEncoding:'utf-8',
                    correlationId:m.correlationId
                });
            });
        });
    });   // end profileImage_Update_queue_ab

    cnn.queue('addProperty_Images_queue_ab', function(q){
        console.log("listening on addProperty_Review_queue_ab");
        q.subscribe(function(message, headers, deliveryInfo, m){
            util.log(util.format( deliveryInfo.routingKey, message));
            util.log("Message: "+JSON.stringify(message));
            util.log("DeliveryInfo: "+JSON.stringify(deliveryInfo));
            user.addProperty_Images_ab(message, function(err,res){

                //return index sent
                cnn.publish(m.replyTo, res, {
                    contentType:'application/json',
                    contentEncoding:'utf-8',
                    correlationId:m.correlationId
                });
            });
        });
    });   // end addProperty_Review_queue_ab

    cnn.queue('propertyRating_queue_ab', function(q){
        console.log("listening on propertyRating_queue_ab");
        q.subscribe(function(message, headers, deliveryInfo, m){
            util.log(util.format( deliveryInfo.routingKey, message));
            util.log("Message: "+JSON.stringify(message));
            util.log("DeliveryInfo: "+JSON.stringify(deliveryInfo));
            user.handle_request_saveProperty_review_ab(message, function(err,res){

                //return index sent
                cnn.publish(m.replyTo, res, {
                    contentType:'application/json',
                    contentEncoding:'utf-8',
                    correlationId:m.correlationId
                });
            });
        });
    });   // end propertyRating_queue_ab


    cnn.queue('delete_queue_ab', function(q){
        console.log("listening on delete_queue_ab");
        q.subscribe(function(message, headers, deliveryInfo, m){
            util.log(util.format( deliveryInfo.routingKey, message));
            util.log("Message: "+JSON.stringify(message));
            util.log("DeliveryInfo: "+JSON.stringify(deliveryInfo));
            user.handle_request_deleteUser_ab(message, function(err,res){

                //return index sent
                cnn.publish(m.replyTo, res, {
                    contentType:'application/json',
                    contentEncoding:'utf-8',
                    correlationId:m.correlationId
                });
            });
        });
    });   // end delete_queue_ab


    cnn.queue('changePassword_queue_ab', function(q){
        console.log("listening on changePassword_queue_ab");
        q.subscribe(function(message, headers, deliveryInfo, m){
            util.log(util.format( deliveryInfo.routingKey, message));
            util.log("Message: "+JSON.stringify(message));
            util.log("DeliveryInfo: "+JSON.stringify(deliveryInfo));
            user.handle_request_changePassword_ab(message, function(err,res){

                //return index sent
                cnn.publish(m.replyTo, res, {
                    contentType:'application/json',
                    contentEncoding:'utf-8',
                    correlationId:m.correlationId
                });
            });
        });
    });   // end changePassword_queue_ab

    cnn.queue('user_reviews_queue_ab', function(q){
        console.log("listening on user_reviews_queue_ab");
        q.subscribe(function(message, headers, deliveryInfo, m){
            util.log(util.format( deliveryInfo.routingKey, message));
            util.log("Message: "+JSON.stringify(message));
            util.log("DeliveryInfo: "+JSON.stringify(deliveryInfo));
            user.handle_request_userReviews_ab(message, function(err,res){

                //return index sent
                cnn.publish(m.replyTo, res, {
                    contentType:'application/json',
                    contentEncoding:'utf-8',
                    correlationId:m.correlationId
                });
            });
        });
    });   // end user_reviews_queue_ab


    cnn.queue('user_by_reviews_queue_ab', function(q){
        console.log("listening on user_by_reviews_queue_ab");
        q.subscribe(function(message, headers, deliveryInfo, m){
            util.log(util.format( deliveryInfo.routingKey, message));
            util.log("Message: "+JSON.stringify(message));
            util.log("DeliveryInfo: "+JSON.stringify(deliveryInfo));
            user.handle_request_userByReviews_ab(message, function(err,res){

                //return index sent
                cnn.publish(m.replyTo, res, {
                    contentType:'application/json',
                    contentEncoding:'utf-8',
                    correlationId:m.correlationId
                });
            });
        });
    });   // end user_by_reviews_queue_ab

    //anvita end


    //anvita admin start

    cnn.queue('getHosts_queue_ab', function(q){
    console.log("listening on getHosts_queue_ab");
    q.subscribe(function(message, headers, deliveryInfo, m){
      util.log(util.format( deliveryInfo.routingKey, message));
      util.log("Message: "+JSON.stringify(message));
      util.log("DeliveryInfo: "+JSON.stringify(deliveryInfo));
      admin.handle_request_getHosts_ab(message, function(err,res){

        //return index sent
        cnn.publish(m.replyTo, res, {
          contentType:'application/json',
          contentEncoding:'utf-8',
          correlationId:m.correlationId
        });
      });
    });
  });   // end getHosts_queue_ab

  cnn.queue('getGraphs_queue_ab', function(q){
    console.log("listening on getHosts_queue_ab");
    q.subscribe(function(message, headers, deliveryInfo, m){
      util.log(util.format( deliveryInfo.routingKey, message));
      util.log("Message: "+JSON.stringify(message));
      util.log("DeliveryInfo: "+JSON.stringify(deliveryInfo));
      admin.handle_request_getGraphs_ab(message, function(err,res){

        //return index sent
        cnn.publish(m.replyTo, res, {
          contentType:'application/json',
          contentEncoding:'utf-8',
          correlationId:m.correlationId
        });
      });
    });
  });   // end getGraphs_queue_ab

  cnn.queue('getUserTrack_queue_ab', function(q){
    console.log("listening on getUserTrack_queue_ab");
    q.subscribe(function(message, headers, deliveryInfo, m){
      util.log(util.format( deliveryInfo.routingKey, message));
      util.log("Message: "+JSON.stringify(message));
      util.log("DeliveryInfo: "+JSON.stringify(deliveryInfo));
      admin.handle_request_getUserTrack_ab(message, function(err,res){

        //return index sent
        cnn.publish(m.replyTo, res, {
          contentType:'application/json',
          contentEncoding:'utf-8',
          correlationId:m.correlationId
        });
      });
    });
  });   // end getUserTrack_queue_ab

  cnn.queue('getBills_queue_ab', function(q){
    console.log("listening on getBills_queue_ab");
    q.subscribe(function(message, headers, deliveryInfo, m){
      util.log(util.format( deliveryInfo.routingKey, message));
      util.log("Message: "+JSON.stringify(message));
      util.log("DeliveryInfo: "+JSON.stringify(deliveryInfo));
      admin.handle_request_getBills_ab(message, function(err,res){

        //return index sent
        cnn.publish(m.replyTo, res, {
          contentType:'application/json',
          contentEncoding:'utf-8',
          correlationId:m.correlationId
        });
      });
    });
  });   // end getGraphs_queue_ab


  cnn.queue('getUsers_queue_ab', function(q){
    console.log("listening on getUsers_queue_ab");
    q.subscribe(function(message, headers, deliveryInfo, m){
      util.log(util.format( deliveryInfo.routingKey, message));
      util.log("Message: "+JSON.stringify(message));
      util.log("DeliveryInfo: "+JSON.stringify(deliveryInfo));
      admin.handle_request_getUsers_ab(message, function(err,res){

        //return index sent
        cnn.publish(m.replyTo, res, {
          contentType:'application/json',
          contentEncoding:'utf-8',
          correlationId:m.correlationId
        });
      });
    });
  });   // end getUsers_queue_ab

  cnn.queue('getAdminPage_queue_ab', function(q){
    console.log("listening on getAdminPage_queue_ab");
    q.subscribe(function(message, headers, deliveryInfo, m){
      util.log(util.format( deliveryInfo.routingKey, message));
      util.log("Message: "+JSON.stringify(message));
      util.log("DeliveryInfo: "+JSON.stringify(deliveryInfo));
      admin.handle_request_getAdminHomepage_ab(message, function(err,res){

        //return index sent
        cnn.publish(m.replyTo, res, {
          contentType:'application/json',
          contentEncoding:'utf-8',
          correlationId:m.correlationId
        });
      });
    });
  });   // end getAdminPage_queue_ab


  cnn.queue('acceptHost_queue_ab', function(q){
    console.log("listening on acceptHost_queue_ab");
    q.subscribe(function(message, headers, deliveryInfo, m){
      util.log(util.format( deliveryInfo.routingKey, message));
      util.log("Message: "+JSON.stringify(message));
      util.log("DeliveryInfo: "+JSON.stringify(deliveryInfo));
      admin.handle_request_acceptHost_ab(message, function(err,res){

        //return index sent
        cnn.publish(m.replyTo, res, {
          contentType:'application/json',
          contentEncoding:'utf-8',
          correlationId:m.correlationId
        });
      });
    });
  });   // end acceptHost_queue_ab


  cnn.queue('declineHost_queue_ab', function(q){
    console.log("listening on declineHost_queue_ab");
    q.subscribe(function(message, headers, deliveryInfo, m){
      util.log(util.format( deliveryInfo.routingKey, message));
      util.log("Message: "+JSON.stringify(message));
      util.log("DeliveryInfo: "+JSON.stringify(deliveryInfo));
      admin.handle_request_declineHost_ab(message, function(err,res){

        //return index sent
        cnn.publish(m.replyTo, res, {
          contentType:'application/json',
          contentEncoding:'utf-8',
          correlationId:m.correlationId
        });
      });
    });
  });   // end declineHost_queue_ab

cnn.queue('get_BiddingProperties_queue_ab', function(q){
    console.log("listening on get_BiddingProperties_queue_ab");
    q.subscribe(function(message, headers, deliveryInfo, m){
      util.log(util.format( deliveryInfo.routingKey, message));
      util.log("Message: "+JSON.stringify(message));
      util.log("DeliveryInfo: "+JSON.stringify(deliveryInfo));
      admin.handle_request_biddingProperties_ab(message, function(err,res){

        //return index sent
        cnn.publish(m.replyTo, res, {
          contentType:'application/json',
          contentEncoding:'utf-8',
          correlationId:m.correlationId
        });
      });
    });
  });   // end get_BiddingProperties_queue_ab


  cnn.queue('get_BiddingAnalytics_queue_ab', function(q){
    console.log("listening on get_BiddingAnalytics_queue_ab");
    q.subscribe(function(message, headers, deliveryInfo, m){
      util.log(util.format( deliveryInfo.routingKey, message));
      util.log("Message: "+JSON.stringify(message));
      util.log("DeliveryInfo: "+JSON.stringify(deliveryInfo));
      admin.handle_request_biddingAnalytics_ab(message, function(err,res){

        //return index sent
        cnn.publish(m.replyTo, res, {
          contentType:'application/json',
          contentEncoding:'utf-8',
          correlationId:m.correlationId
        });
      });
    });
  });   // end get_BiddingAnalytics_queue_ab

    cnn.queue('fetchHostDetails_queue_ab', function(q){
    console.log("listening on fetchHostDetails_queue_ab");
    q.subscribe(function(message, headers, deliveryInfo, m){
      util.log(util.format( deliveryInfo.routingKey, message));
      util.log("Message: "+JSON.stringify(message));
      util.log("DeliveryInfo: "+JSON.stringify(deliveryInfo));
      admin.handle_request_fetchHostDetails_ab(message, function(err,res){

        //return index sent
        cnn.publish(m.replyTo, res, {
          contentType:'application/json',
          contentEncoding:'utf-8',
          correlationId:m.correlationId
        });
      });
    });
  });   // end get_BiddingAnalytics_queue_ab
  
    // anvita admin end

//sahil start
    cnn.queue('prop_queue_sk', function(q){
        console.log("listening on prop_queue_sk");
        q.subscribe(function(message, headers, deliveryInfo, m){
            util.log(util.format( deliveryInfo.routingKey, message));
            util.log("Message: "+JSON.stringify(message));
            util.log("DeliveryInfo: "+JSON.stringify(deliveryInfo));
            prop.handle_prop_detail__sk(message, function(err,res){

                //return index sent
                cnn.publish(m.replyTo, res, {
                    contentType:'application/json',
                    contentEncoding:'utf-8',
                    correlationId:m.correlationId
                });
            });
        });
    });   // end prop_queue_sk

    cnn.queue('prop__new_queue_sk', function(q){
        console.log("listening on prop_new_queue_sk");
        q.subscribe(function(message, headers, deliveryInfo, m){
            util.log(util.format( deliveryInfo.routingKey, message));
            util.log("Message: "+JSON.stringify(message));
            util.log("DeliveryInfo: "+JSON.stringify(deliveryInfo));
            prop.handle_propnew_detail__sk(message, function(err,res){

                //return index sent
                cnn.publish(m.replyTo, res, {
                    contentType:'application/json',
                    contentEncoding:'utf-8',
                    correlationId:m.correlationId
                });
            });
        });
    });   // end prop_new_queue_sk

    cnn.queue('prop_desc_queue_sk', function(q){
        console.log("listening on prop_desc_queue_sk");
        q.subscribe(function(message, headers, deliveryInfo, m){
            util.log(util.format( deliveryInfo.routingKey, message));
            util.log("Message: "+JSON.stringify(message));
            util.log("DeliveryInfo: "+JSON.stringify(deliveryInfo));
            prop.handle_prop_desc__sk(message, function(err,res){

                //return index sent
                cnn.publish(m.replyTo, res, {
                    contentType:'application/json',
                    contentEncoding:'utf-8',
                    correlationId:m.correlationId
                });
            });
        });
    }); // end of prop_desc_queue_sk

    cnn.queue('confirm_book_queue_sk', function(q){
        console.log("listening on confirm_book_queue_sk");
        q.subscribe(function(message, headers, deliveryInfo, m){
            util.log(util.format( deliveryInfo.routingKey, message));
            util.log("Message: "+JSON.stringify(message));
            util.log("DeliveryInfo: "+JSON.stringify(deliveryInfo));
            prop.handle_confirm_book__sk(message, function(err,res){

                //return index sent
                cnn.publish(m.replyTo, res, {
                    contentType:'application/json',
                    contentEncoding:'utf-8',
                    correlationId:m.correlationId
                });
            });
        });
    }); // end of prop_desc_queue_sk

    cnn.queue('prop_bid_queue_sk', function(q){
        console.log("listening on prop_bid_queue_sk");
        q.subscribe(function(message, headers, deliveryInfo, m){
            util.log(util.format( deliveryInfo.routingKey, message));
            util.log("Message: "+JSON.stringify(message));
            util.log("DeliveryInfo: "+JSON.stringify(deliveryInfo));
            prop.handle_bid_desc__sk(message, function(err,res){

                //return index sent
                cnn.publish(m.replyTo, res, {
                    contentType:'application/json',
                    contentEncoding:'utf-8',
                    correlationId:m.correlationId
                });
            });
        });
    }); // end of prop_bid_queue_sk

    cnn.queue('prop_placebid_queue_sk', function(q){
        console.log("listening on prop_placebid_queue_sk");
        q.subscribe(function(message, headers, deliveryInfo, m){
            util.log(util.format( deliveryInfo.routingKey, message));
            util.log("Message: "+JSON.stringify(message));
            util.log("DeliveryInfo: "+JSON.stringify(deliveryInfo));
            prop.handle_placebid_desc__sk(message, function(err,res){

                //return index sent
                cnn.publish(m.replyTo, res, {
                    contentType:'application/json',
                    contentEncoding:'utf-8',
                    correlationId:m.correlationId
                });
            });
        });
    }); //end of prop_placebid_queue_sk

    cnn.queue('inserthostMessageQ', function(q){
        console.log("Listening on host messages Q for insert");
        q.subscribe(function(message, headers, deliveryInfo, m){
            util.log(util.format( deliveryInfo.routingKey, message));
            util.log("Message: "+JSON.stringify(message));
            util.log("DeliveryInfo: "+JSON.stringify(deliveryInfo));
            prop.inserthostMessage_av(message, function(err,res){

                //return index sent
                cnn.publish(m.replyTo, res, {
                    contentType:'application/json',
                    contentEncoding:'utf-8',
                    correlationId:m.correlationId
                });
            });
        });
    });//end of insert host msg queue

    cnn.queue('user_msgqueue', function(q){
        console.log("Listening on user messages Q for insert");
        q.subscribe(function(message, headers, deliveryInfo, m){
            util.log(util.format( deliveryInfo.routingKey, message));
            util.log("Message: "+JSON.stringify(message));
            util.log("DeliveryInfo: "+JSON.stringify(deliveryInfo));
            prop.getuserMessage_sk(message, function(err,res){

                //return index sent
                cnn.publish(m.replyTo, res, {
                    contentType:'application/json',
                    contentEncoding:'utf-8',
                    correlationId:m.correlationId
                });
            });
        });
    });



    cnn.queue('user_tripqueue', function(q){
        console.log("Listening on trips");
        q.subscribe(function(message, headers, deliveryInfo, m){
            util.log(util.format( deliveryInfo.routingKey, message));
            util.log("Message: "+JSON.stringify(message));
            util.log("DeliveryInfo: "+JSON.stringify(deliveryInfo));
            prop.gettrips_sk(message, function(err,res){

                //return index sent
                cnn.publish(m.replyTo, res, {
                    contentType:'application/json',
                    contentEncoding:'utf-8',
                    correlationId:m.correlationId
                });
            });
        });
    });


    cnn.queue('user_futuretripqueue', function(q){
        console.log("Listening on future trips");
        q.subscribe(function(message, headers, deliveryInfo, m){
            util.log(util.format( deliveryInfo.routingKey, message));
            util.log("Message: "+JSON.stringify(message));
            util.log("DeliveryInfo: "+JSON.stringify(deliveryInfo));
            prop.getfuturetrips_sk(message, function(err,res){

                //return index sent
                cnn.publish(m.replyTo, res, {
                    contentType:'application/json',
                    contentEncoding:'utf-8',
                    correlationId:m.correlationId
                });
            });
        });
    });
    cnn.queue('user_deletefuturetrip', function(q){
        console.log("Listening on delete future trips");
        q.subscribe(function(message, headers, deliveryInfo, m){
            util.log(util.format( deliveryInfo.routingKey, message));
            util.log("Message: "+JSON.stringify(message));
            util.log("DeliveryInfo: "+JSON.stringify(deliveryInfo));
            prop.delfuturetrips_sk(message, function(err,res){

                //return index sent
                cnn.publish(m.replyTo, res, {
                    contentType:'application/json',
                    contentEncoding:'utf-8',
                    correlationId:m.correlationId
                });
            });
        });
    });

    cnn.queue('user_editfuturetrip', function(q){
        console.log("Listening on delete future trips");
        q.subscribe(function(message, headers, deliveryInfo, m){
            util.log(util.format( deliveryInfo.routingKey, message));
            util.log("Message: "+JSON.stringify(message));
            util.log("DeliveryInfo: "+JSON.stringify(deliveryInfo));
            prop.futureeditTrips_sk(message, function(err,res){

                //return index sent
                cnn.publish(m.replyTo, res, {
                    contentType:'application/json',
                    contentEncoding:'utf-8',
                    correlationId:m.correlationId
                });
            });
        });
    });

    cnn.queue('getUserBills_queue_sk', function(q){
        console.log("Listening on delete future trips");
        q.subscribe(function(message, headers, deliveryInfo, m){
            util.log(util.format( deliveryInfo.routingKey, message));
            util.log("Message: "+JSON.stringify(message));
            util.log("DeliveryInfo: "+JSON.stringify(deliveryInfo));
            prop.handle_request_getUserBills_ab(message, function(err,res){

                //return index sent
                cnn.publish(m.replyTo, res, {
                    contentType:'application/json',
                    contentEncoding:'utf-8',
                    correlationId:m.correlationId
                });
            });
        });
    });

cnn.queue('viewbidDetails_queue_ab', function(q){
        console.log("listening on viewbidDetails_queue_ab");
        q.subscribe(function(message, headers, deliveryInfo, m){
            util.log(util.format( deliveryInfo.routingKey, message));
            util.log("Message: "+JSON.stringify(message));
            util.log("DeliveryInfo: "+JSON.stringify(deliveryInfo));
            user.handle_request_bidDetails_ab(message, function(err,res){

                //return index sent
                cnn.publish(m.replyTo, res, {
                    contentType:'application/json',
                    contentEncoding:'utf-8',
                    correlationId:m.correlationId
                });
            });
        });
    });   // end viewbidDetails_queue_ab


    //sahil end

    //tirath start

    console.log("listening on host_queue");
    console.log("listening on property_queue");
    console.log("listening on bill_queue");

    cnn.queue('host_queue', function(q){
        q.subscribe(function(message, headers, deliveryInfo, m){
            util.log(util.format( deliveryInfo.routingKey, message));
            util.log("Message: "+JSON.stringify(message));
            util.log("DeliveryInfo: "+JSON.stringify(deliveryInfo));

            if(message.operation=="signuphost_ng"){
                console.log("signup host");
                host.signuphost_ng(message, function(err,res){
                    cnn.publish(m.replyTo, res, {
                        contentType:'application/json',
                        contentEncoding:'utf-8',
                        correlationId:m.correlationId
                    });

                });
            }

            else if(message.operation=="signinhost_ng"){
                console.log("signin host");
                host.signinhost_ng(message, function(err,res){
                    cnn.publish(m.replyTo, res, {
                        contentType:'application/json',
                        contentEncoding:'utf-8',
                        correlationId:m.correlationId
                    });

                });
            }

            else if(message.operation=="loadprofile"){
                console.log("load profile");
                host.loadprofile_ng(message, function(err,res){
                    cnn.publish(m.replyTo, res, {
                        contentType:'application/json',
                        contentEncoding:'utf-8',
                        correlationId:m.correlationId
                    });

                });
            }

            else if(message.operation=="updatehostprofile"){
                console.log("load profile");
                host.updatehostprofile_ng(message, function(err,res){
                    cnn.publish(m.replyTo, res, {
                        contentType:'application/json',
                        contentEncoding:'utf-8',
                        correlationId:m.correlationId
                    });

                });
            }

            else if(message.operation=="uploadhostprofileimg"){
                console.log("upload image");
                host.uploadhostprofileimg_ng(message, function(err,res){
                    cnn.publish(m.replyTo, res, {
                        contentType:'application/json',
                        contentEncoding:'utf-8',
                        correlationId:m.correlationId
                    });

                });
            }

            else if(message.operation=="loadhostmedia"){
                console.log("load host media");
                host.loadhostmedia_ng(message, function(err,res){
                    cnn.publish(m.replyTo, res, {
                        contentType:'application/json',
                        contentEncoding:'utf-8',
                        correlationId:m.correlationId
                    });

                });
            }

            else if(message.operation=="uploadhostvideo"){
                console.log("load host media");
                host.uploadhostvideo_ng(message, function(err,res){
                    cnn.publish(m.replyTo, res, {
                        contentType:'application/json',
                        contentEncoding:'utf-8',
                        correlationId:m.correlationId
                    });

                });
            }

            else if(message.operation=="gethostmessage"){
                console.log("get host message");
                host.gethostmessage_ng(message, function(err,res){
                    cnn.publish(m.replyTo, res, {
                        contentType:'application/json',
                        contentEncoding:'utf-8',
                        correlationId:m.correlationId
                    });

                });
            }

            else if(message.operation=="history"){
                console.log("history");
                host.host_transaction_history(message, function(err,res){
                    cnn.publish(m.replyTo, res, {
                        contentType:'application/json',
                        contentEncoding:'utf-8',
                        correlationId:m.correlationId
                    });

                });
            }

            else if(message.operation=="deleteprofile"){
                console.log("load profile");
                host.host_delete_profile(message, function(err,res){
                    cnn.publish(m.replyTo, res, {
                        contentType:'application/json',
                        contentEncoding:'utf-8',
                        correlationId:m.correlationId
                    });

                });
            }

            else if(message.operation=="setmessagedenied"){
                console.log("set denied message");
                host.sethostmessagedenied_ng(message, function(err,res){
                    cnn.publish(m.replyTo, res, {
                        contentType:'application/json',
                        contentEncoding:'utf-8',
                        correlationId:m.correlationId
                    });

                });
            }

             //sahil
            else if(message.operation=="history_user"){
                console.log("history");
                prop.user_transaction_history(message, function(err,res){
                    cnn.publish(m.replyTo, res, {
                        contentType:'application/json',
                        contentEncoding:'utf-8',
                        correlationId:m.correlationId
                    });

                });
            } //sahil

            else if(message.operation=="setmessageaccept"){
                console.log("set accept message");
                host.sethostmessageaccept_ng(message, function(err,res){
                    cnn.publish(m.replyTo, res, {
                        contentType:'application/json',
                        contentEncoding:'utf-8',
                        correlationId:m.correlationId
                    });

                });
            }

            else if(message.operation=="gethostdash"){
                console.log("get host dash");
                host.gethostdash_ng(message, function(err,res){
                    cnn.publish(m.replyTo, res, {
                        contentType:'application/json',
                        contentEncoding:'utf-8',
                        correlationId:m.correlationId
                    });

                });
            }

            else if(message.operation=="gethosttrip"){
                console.log("get host dash");
                host.gethosttrip_ng(message, function(err,res){
                    cnn.publish(m.replyTo, res, {
                        contentType:'application/json',
                        contentEncoding:'utf-8',
                        correlationId:m.correlationId
                    });

                });
            }

            else if(message.operation=="gethostfuturetrips"){
                console.log("get host dash");
                host.gethostfuturetrip_ng(message, function(err,res){
                    cnn.publish(m.replyTo, res, {
                        contentType:'application/json',
                        contentEncoding:'utf-8',
                        correlationId:m.correlationId
                    });

                });
            }

            else if(message.operation=="saveguestrating"){
                console.log("set guest rating");
                host.saveguestRating_ng(message, function(err,res){
                    cnn.publish(m.replyTo, res, {
                        contentType:'application/json',
                        contentEncoding:'utf-8',
                        correlationId:m.correlationId
                    });

                });
            }

            else if(message.operation=="gethostreviewsforyou"){
                console.log("set guest rating");
                host.gethostreviewsforyou_ng(message, function(err,res){
                    cnn.publish(m.replyTo, res, {
                        contentType:'application/json',
                        contentEncoding:'utf-8',
                        correlationId:m.correlationId
                    });

                });
            }

            else if(message.operation=="gethostreviewsbyyou"){
                console.log("set guest rating");
                host.gethostreviewsbyyou_ng(message, function(err,res){
                    cnn.publish(m.replyTo, res, {
                        contentType:'application/json',
                        contentEncoding:'utf-8',
                        correlationId:m.correlationId
                    });

                });
            }


        });
    });

    cnn.queue('property_queue', function(q){
        q.subscribe(function(message, headers, deliveryInfo, m){
            util.log(util.format( deliveryInfo.routingKey, message));
            util.log("Message: "+JSON.stringify(message));
            util.log("DeliveryInfo: "+JSON.stringify(deliveryInfo));

            if(message.operation=="property_details"){
                console.log("property details");
                host.allsteps_ng(message, function(err,res){
                    cnn.publish(m.replyTo, res, {
                        contentType:'application/json',
                        contentEncoding:'utf-8',
                        correlationId:m.correlationId
                    });

                });
            }

            else if(message.operation=="propertylist"){
                console.log("property list");
                host.propertylist_ng(message, function(err,res){
                    cnn.publish(m.replyTo, res, {
                        contentType:'application/json',
                        contentEncoding:'utf-8',
                        correlationId:m.correlationId
                    });

                });
            }

            else if(message.operation=="propertydelete"){
                console.log("property list");
                host.propertydelete_ng(message, function(err,res){
                    cnn.publish(m.replyTo, res, {
                        contentType:'application/json',
                        contentEncoding:'utf-8',
                        correlationId:m.correlationId
                    });

                });
            }

            else if(message.operation=="preview"){
                console.log("property view");
                host.preview_ng(message, function(err,res){
                    cnn.publish(m.replyTo, res, {
                        contentType:'application/json',
                        contentEncoding:'utf-8',
                        correlationId:m.correlationId
                    });

                });
            }


        });
    });

    cnn.queue('bill_queue', function(q){
        console.log("in bill queue");
        q.subscribe(function(message, headers, deliveryInfo, m){
            util.log(util.format( deliveryInfo.routingKey, message));
            util.log("Message: "+JSON.stringify(message));
            util.log("DeliveryInfo: "+JSON.stringify(deliveryInfo));

            if(message.operation=="bill_gen"){
                console.log("bill generate");
                bill.billgen_ng(message, function(err,res){
                    cnn.publish(m.replyTo, res, {
                        contentType:'application/json',
                        contentEncoding:'utf-8',
                        correlationId:m.correlationId
                    });

                });
            }

        });
    });


    //tirath end


}); // end of cnn.on

