
var express = require('express')
    , routes = require('./routes')
    , http = require('http')
    , path = require('path')
    // , session = require('client-sessions')
    , ejs = require('ejs');


var propdetail_sk = require('./routes/propdetail_sk');



var mq_client = require('./rpc/client');
var session= require('express-session');
var passport= require('passport');
var LocalStrategy = require('passport-local').Strategy;
var flash= require('connect-flash');
// var bCrypt= require('bcrypt');
var host= require('./routes/host_ng');
var bill = require('./routes/bill_ng');
var fs = require('fs');
var index = require('./routes/index');
var user_ab = require('./routes/user_ab');
var admin= require('./routes/admin_ab');
var bodyParser = require('body-parser');
var winston = require('winston');
var multer = require('multer');
var app = express();

winston.add(
          winston.transports.File, {
            filename: 'event.log',
            level: 'info',
            json: true,
            eol: 'rn', // for Windows, or `eol: ‘n’,` for *NIX OSs
            timestamp: true
          }
        );

// app.use(express.cookieParser());
// app.use(express.bodyParser());
// app.use(express.methodOverride());


// app.use(passport.initialize());
// app.use(passport.session());
// app.use(flash());
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({cookieName: 'session', secret: "fafadsfasfgfsgsa", resave: false, saveUninitialized: true,
    duration: 30 * 60 * 1000, activeDuration: 5 * 60 * 1000}));
app.use(express.cookieParser());
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(express.static(path.join(__dirname, 'public')));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());
app.use(app.router);



app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: false }));
var upload = multer({  dest: __dirname + '/public/uploads/' })

var util = require('util');
var log_file = fs.createWriteStream(__dirname + '/debug.log', {flags : 'w'});
var log_stdout = process.stdout;

console.log = function(d) { //
    log_file.write(util.format(d) + '\n');
    log_stdout.write(util.format(d) + '\n');
};


// view engine setup
// app.use(session({

//     cookieName: 'session',
//     secret: 'cmpe273-session',
//     duration: 30 * 60 * 1000,
//     activeDuration: 5 * 60 * 1000,  }));



if ('development' == app.get('env')) {
    app.use(express.errorHandler());
}

//anvita start

app.get('/', index.index);
app.get('/signupsuccess', user_ab.signUpSuccess);
app.get('/homepage', user_ab.getHomepage);
app.get('/editProfile_ab', user_ab.editProfile_ab);
app.get('/profilePhoto_ab', user_ab.editPhotoPage_ab)
app.get('/updateProfileImage_ab', user_ab.upload_file_ab);
app.get('/ratings', user_ab.load_ratings_ab)
app.get('/addPropertyImage_ab', user_ab.addPropertyImage_ab)
app.get('/pRatingSuccess', user_ab.propertyRating_success)
app.get('/logout_ab', user_ab.logout_ab)
app.get('/deleteUser_ab', user_ab.deleteUser_ab)
app.get('/changePassword_ab', user_ab.changePassword_ab)
app.get('/userPasswordChangeSuccess_ab', user_ab.userPasswordChangeSuccess_ab)
app.get('/user_reviews_ab', user_ab.user_reviews_ab)
app.get('/user_review_by_you_ab', user_ab.user_reviews_by_you_ab)
app.post('/signup', user_ab.submitSignup);
app.post('/signin_ab', user_ab.loginCheck);
app.post('/savePhone_ab', user_ab.savePhone_ab);
app.post('/saveProfile_ab', user_ab.saveProfile_ab);
app.post('/savePropertyRating_ab', user_ab.savePropertyRating_ab)
app.post('/updatePassword_ab', user_ab.updatePassword_ab)


app.post('/file_upload', upload.single("file"), function (req, res) {

    console.log("app.js - 1")
    console.log(req.files)

    fs.readFile(req.files.file.path, function (err, data) {

        app.configure(function() {
            app.set('file', req.files.file.path);
        });

        var imagetopass =
            Math.floor(Math.random() * 9)+""+Math.floor(Math.random() * 9)+"" + ""+Math.floor(Math.random() * 9)
            +""+Math.floor(Math.random() * 9)+""+Math.floor(Math.random() * 9);

        var filename = ""+imagetopass+".jpg";
        req.files.file.name = filename
        var newPath = "./public/uploads/"+req.files.file.name;
        fs.writeFile(newPath, data, function (err) {

            app.configure(function() {
                app.set('imageid', imagetopass);
            });

            res.redirect('/updateProfileImage_ab');
        });
    });

})

app.post('/property_upload', upload.single("file"), function (req, res, next) {

    var images_arr = [];
    var count = 0;

    console.log(req.files.file.length)

    for(i in req.files.file){
        fs.readFile(req.files.file[i].path, function (err, data) {

            app.configure(function() {
                app.set('file', req.files.file[i].path);
            });

            var imagetopass =
                "pReview_"+Math.floor(Math.random() * 9)+""+Math.floor(Math.random() * 9)+"" + ""+Math.floor(Math.random() * 9)
                +""+Math.floor(Math.random() * 9)+""+Math.floor(Math.random() * 9);

            var filename = ""+imagetopass+".jpg";
            req.files.file[i].name = filename
            var newPath = "./public/uploads/"+req.files.file[i].name;
            fs.writeFile(newPath, data, function (err) {

                images_arr.push(imagetopass);
                count = count + 1;

                if(count > i){
                    app.configure(function() {
                        app.set('images', images_arr);
                    });

                    res.redirect('/addPropertyImage_ab');
                }
            });
        });
    }
})

//anvita end

//sahil start

app.post('/checkproperty_sk', propdetail_sk.submitProp);
app.post('/checknewproperty_sk', propdetail_sk.submitnewProp);
app.get('/homepage_sk', propdetail_sk.render_homesk);
app.post('/propertydesc_sk', propdetail_sk.indProp);
app.get('/propdetail_sk', propdetail_sk.render_detailPage);
app.post('/confirmbook_sk', propdetail_sk.confirmBook);
app.get('/confirmPage_sk', propdetail_sk.render_confirmPage);
//bid
app.post('/bidDesc_sk', propdetail_sk.bidProp);
app.get('/biddetail_sk', propdetail_sk.render_bidPage);
app.post('/putbid_sk', propdetail_sk.placeabid);
app.get('/bidsucc_sk',propdetail_sk.render_bidsuccPage);

//msgs
app.get('/getusermessage',propdetail_sk.getusermessage_sk);
app.get('/user_messages',function(req,res){
    res.render('user_messages');
});

app.get('/getusertrips',propdetail_sk.getusertrip_sk);
app.get('/user_trips',function(req,res){
    res.render('user_trips_sk');
});

app.get('/getusercommingtrips',propdetail_sk.getuserfuturetrip_sk);
app.get('/user_futuretrips_sk',function(req,res){
    res.render('user_futuretrips_sk');
});

app.post('/delTripsMessage',propdetail_sk.deluserfuturetrip_sk );

app.post('/editTripsMessage',propdetail_sk.edituserfuturetrip_sk )


//sahil transaction
app.get('/user_transaction_history', propdetail_sk.user_transaction_history);
//
app.post('/searchBills_sk', propdetail_sk.searchBills_sk);

app.get('/search_BillsPage_sk', propdetail_sk.search_BillsPage_sk);
app.get('/bills_Page_sk', propdetail_sk.bills_Page_sk);
app.get('/billDetails_sk', propdetail_sk.billDetails_sk);

app.post('/searchBills_sk', propdetail_sk.searchBills_sk);
app.post('/openBill_sk', propdetail_sk.openBill_sk);
//

//Anuvrat
app.get('/finalConfirmation', propdetail_sk.render_finalConfirmation);
app.post('/addNewHostMessage', propdetail_sk.addNewHostMessage);
//Anuvrat end
app.get('/viewallbids',function (req,res) {
    var property= req.param('property_id');
    console.log("property_id="+property);

    var msg_payload = { "propertyid": property };

    mq_client.make_request('viewbidDetails_queue_ab', msg_payload, function (err, results) {
        if (err) {
            throw err;
        }
        else {

            if (results.code == 200) {

                req.session.currentBidDetails_ab = results.bids;

                //res.send({"statuscode":200 });

                ejs.renderFile('./views/viewallbids_ab.ejs', { title: 'Bid Details', bids: req.session.currentBidDetails_ab } , function(err, result) {
                    if (!err) {
                        res.end(result);
                    }
                    else {
                        res.end('An error occurred');
                        console.log(err);
                    }
                });


            }else{
                console.log("nothing retrieved from bids")
            }
        }
    });

});
//sahil end

//tirath start


// app.get('/', function (req,res) {
//     var message;
//     if(req.param('message')){
//         console.log("in message");
//         message= req.param('message');
//         res.render('hostSignup_tg',{message:message});
//     }
//     else{
//         console.log("in message else");
//         message="";
//         res.render('hostSignup_tg',{message:message});
//     }
    
// });

app.get('/hoststart', function (req,res) {
    console.log("app.js"+req.session.fname);
    res.redirect('/host_home');
});

app.get('/hostbegin', function (req,res) {
    console.log("app.js"+req.session.fname);
    res.render('hostStart_tg',{fname:req.session.fname});
});

app.get('/host_home', host.host_home_ng);

// app.get('/host_dashboard', function (req,res) {
//     console.log("app.js"+req.session);
//     console.dir(req.session);
//     res.render('host_dashboard');
// });

app.get('/step1', function (req,res) {
    console.log("app.js"+req.session);
    console.dir(req.session);
    res.render('step1_tg');
});

app.get('/step1_amenities', function (req,res) {
    console.log("app.js"+req.session);
    console.dir(req.session);
    res.render('step1_amenities');
});

app.get('/step1_bathroom', function (req,res) {
    console.dir(req.session);
    res.render('step1_bathroom');
});

app.get('/step1_bedroom', function (req,res) {
    console.log("app.js"+req.session);
    console.dir(req.session);
    res.render('step1_bedroom');
});

app.get('/step1_location', function (req,res) {
    console.log("app.js"+req.session);
    console.dir(req.session);
    res.render('step1_location');
});

app.get('/step1_spaces', function (req,res) {
    console.log("app.js"+req.session);
    console.dir(req.session);
    res.render('step1_spaces');
});

app.get('/step2', function (req,res) {
    console.log("app.js"+req.session);
    console.dir(req.session);
    res.render('step2_tg');
});

app.get('/step2_photos',function (req,res) {
    res.render('step2_photos_tg');
});

app.get('/step2_editDescription',function (req,res) {
    res.render('step2_edit_description_tg');
});

app.get('/step2_nameplace',function (req,res) {
    res.render('step2_name_place_tg');
});

app.get('/step2_description',function (req,res) {
    res.render('step2_description_tg');
});

app.get('/step2_mobile',function (req,res) {
    res.render('step2_mobile_tg');
});

app.get('/step3',function (req,res) {
    console.log("app.js"+req.session);
    console.dir(req.session);
    res.render('step3_tg');
});

app.get('/step3_rules',function (req,res) {
    console.log("app.js"+req.session);
    console.dir(req.session);
    res.render('step3_rules_tg');
});

app.get('/step3_advance',function (req,res) {
    res.render('step3_advance_tg');
});

app.get('/step3_ready',function (req,res) {
    res.render('step3_ready_tg');
});

app.get('/step3_long',function (req,res) {
    res.render('step3_long_tg');
});

app.get('/step3_price',function (req,res) {
    res.render('step3_price_tg');
});

app.get('/step3_baseprice',function (req,res) {
    res.render('step3_base_price_tg');
});

app.get('/step3_bid',function (req,res) {
    res.render('step3_bid_tg');
});

app.get('/allsteps',host.allsteps_ng);

app.get('/host_profile', function (req,res) {

    console.log("app.js"+req.session.fname);

    res.render('host_profile_tg');

});

app.get('/host_review', function (req,res) {

    console.log("app.js"+req.session.fname);

    res.render('host_reviews_tg');

});

app.get('/host_review_by_you', function (req,res) {

    console.log("app.js"+req.session.fname);

    res.render('host_reviews_by_you_tg');

});

app.get('/host_media', host.host_media_ng);

app.get('/host_messages', function (req,res) {
    res.render('host_messages');
});

app.get('/host_logout',function(req,res)

{

    req.session.destroy();

    res.redirect('/');

});

//app.get('/users', user.list);

app.post('/signupHost', passport.authenticate('signuphost_ng', {

    successRedirect :'/?message="An email has been sent to the admin for approval. Kindly check your email account"',

    failureRedirect :'/?message="Host Already Exists"',

    failureFlash : true,

    session: false

}));

app.post('/signinHost', passport.authenticate('signinhost_ng', {

    successRedirect :'/hoststart',

    failureRedirect :'/?message="Email and Password do not match"',

    failureFlash : true,

    session: false

}));

app.post('/hoststart1',host.hoststart1_ng);
app.post('/hoststep1',host.hoststep1_ng);
app.post('/hoststep1_amenities',host.hoststep1_amenities_ng);
app.post('/hoststep1_bathroom',host.hoststep1_bathroom_ng);
app.post('/hoststep1_bedroom',host.hoststep1_bedroom_ng);
app.post('/hoststep1_location',host.hoststep1_location_ng);
app.post('/hoststep1_spaces',host.hoststep1_spaces_ng);
app.post('/hoststep2_editdescription', host.hoststep2_editdescription_ng);
app.post('/hoststep2_nameplace', host.hoststep2_nameplace_ng);
app.post('/hoststep2_description', host.hoststep2_description_ng);
app.post('/hoststep2_mobile', host.hoststep2_mobile_ng);
app.post('/hoststep3_rules', host.hoststep3_rules_ng);
app.post('/hoststep3_advance', host.hoststep3_advance_ng);
app.post('/hoststep3_ready', host.hoststep3_ready_ng);
app.post('/hoststep3_long', host.hoststep3_long_ng);
app.post('/hoststep3_price', host.hoststep3_price_ng);
app.post('/hoststep3_baseprice', host.hoststep3_baseprice_ng);
app.post('/hoststep3_bid', host.hoststep3_bid_ng);
app.get('/propertylist', host.propertylist_ng);
app.get('/deleteproperty', host.propertydelete_ng);
app.get('/loadprofile', host.loadprofile_ng);
app.get('/updatehostprofile',host.updatehostprofile_ng);
app.post('/uploadhostprofileimg',host.uploadhostprofileimg_ng);
app.get('/loadhostmedia',host.loadhostmedia_ng);
app.get('/preview',host.preview_ng);
app.post('/uploadpropertyimg', host.uploadpropertyimg_ng);
app.post('/uploadhostvideo', host.uploadhostvideo_ng);
app.get('/gethostmessage', host.gethostmessage_ng);
app.get('/sethostmessagedenied',host.sethostmessagedenied_ng);
app.get('/sethostmessageaccept',host.sethostmessageaccept_ng);
app.get('/bill',bill.billgen_ng);
app.get('/getmessagenum',host.getmessagenum_ng);
app.get('/host_delete_profile',host.host_delete_profile);
app.get('/host_transaction_history', host.host_transaction_history);
app.get('/gethostdash', host.gethostdash_ng);
app.get('/gethosttrips',host.gethosttrip_ng);
app.get('/host_trips',function(req,res){
    res.render('host_trips_ng');
});
app.get('/gethostcommingtrips',host.gethostfuturetrip_ng);
app.get('/host_futuretrips_ng',function(req,res){
    res.render('host_future_trips_ng');
});
app.get('/host_rating_ng',function (req,res) {
    res.render('host_rating_ng',{trip_id: req.param('trip_id'), user_id: req.param('user_id')});
});
app.post('/saveguestRating',host.saveguestRating_ng);
app.get('/gethostreviewsforyou', host.gethostreviewsforyou_ng);
app.get('/gethostreviewsbyyou', host.gethostreviewsbyyou_ng);

//tirath end

//anvita admin start

app.get('/success_Admin_ab', admin.index);

app.get('/admin', admin.login_ab)

app.get('/search_Hosts_ab', admin.getHosts)
app.get('/displayHostDetails_ab', admin.displayHostDetails_ab)
app.get('/view_Graph_ab', admin.viewGraph_ab)
app.get('/search_BillsPage_ab', admin.search_BillsPage_ab)
app.get('/bills_Page_ab', admin.bills_Page_ab)
app.get('/billDetails_ab', admin.billDetails_ab)
app.get('/search_Users_ab', admin.search_Users_ab)
app.get('/viewUserDetails_ab', admin.viewUserDetails_ab)
app.get('/checkInactiveHosts_ab', admin.checkInactiveHosts_ab)

app.post('/fetchHost_ab', admin.fetchHostDetails_ab)
app.post('/filterHostCity_ab', admin.filterHostCity_ab)
app.post('/searchBills_ab', admin.searchBills_ab)
app.post('/openBill_ab', admin.openBill_ab)
app.post('/fetchUser_ab', admin.fetchUser_ab)
app.post('/acceptHost_ab', admin.acceptHost_ab)
app.post('/declineHost_ab', admin.declineHost_ab)
app.post('/get_BiddingProperties_ab', admin.get_BiddingProperties_ab)
app.post('/get_BiddingAnalytics_ab', admin.get_BiddingAnalytics_ab)                        
app.get('/BidGraph_ab',admin.BidGraph_ab);
//anvita admin end


var server = app.listen(app.get('port'), function() {
    console.log('Express server listening on port ' + server.address().port);
});



module.exports = app;