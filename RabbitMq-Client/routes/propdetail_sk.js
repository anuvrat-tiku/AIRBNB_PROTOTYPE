
var mq_client = require('../rpc/client');
var ejs = require('ejs');
var fs = require('fs');

//nayan start
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

//nayan end

exports.render_homesk = function(req, res){
        console.log(" I m notttt here");
    //console.log(req.session.result);
        //Checks before redirecting whether the session is valid
        //console.log(req.session.username);
       // if(req.session.username)
        //{
            //Set these headers to notify the browser not to maintain any cache for the page being loaded
    var dest1 = req.session.destination;
    var guest1 = req.session.guest;
    var checkin1 = req.session.checkin;
   var checkout1 = req.session.checkout;
   console.log("req.session.userid_ab"+req.session.userid_ab);

            res.header('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
    console.log(req.session.result1);
    res.render("homepage_sk",{title: 'Welcome to Airbnb',myresult: req.session.result1.result, dest2: dest1, guest2: guest1, checkin2: checkin1, checkout2:checkout1,user_log:req.session.userid_ab});

       // }
       // else
       // {
       //     res.redirect('/signin');
       // }
    };





exports.submitProp = function(req, res){

    var destination = req.body.destination;
var checkin = req.body.checkin;
var checkout = req.body.checkout;
var guest = req.body.guest;
    //var x = localStorage.getItem('destination');
   // console.log(x);
    req.session.destination = destination;
    req.session.guest = guest;
    req.session.checkin = checkin;
    req.session.checkout = checkout;
    req.session.result1;
//console.log(checkin);
    //Anuvrat
        
    console.log("TESTTESTTESTTESTTESTTESTTESTTESTTESTTESTTESTTESTTESTTESTTESTTESTTESTTESTTEST");
    var cin = "\"" + checkin + "\"";
    var cout = "\"" + checkout + "\"";

    var date1 = new Date(cin);
    var date2 = new Date(cout);
    var timeDiff = Math.abs(date2.getTime() - date1.getTime());
    var diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24));

    console.log("Hello World");
    console.log(diffDays);
    req.session.diffDays = diffDays;
    //Anuvrat

var msg_payload = {"destination": destination,"checkin":checkin,"checkout": checkout,"guest": guest};
console.log("In POST Request = destination:" +destination + "checkin:" +checkin +" " + "checkout:"+" "+ checkout +" "+"guest:"+ guest);

mq_client.make_request('prop_queue_sk', msg_payload, function (err, results) {
    //  console.log(results);
    if (err) {
        throw err;
    }
    else {

        if (results.code == 200) {
            //nayan start
            console.log("results length="+results.result.length);
            console.log("results="+results.hostimg);
            console.log("results length="+results.hostimg.length);
            
            for(var i=0;i<results.result.length;i++){
                console.log("in for="+i);
                var coverimgname= results.result[i].property_id+"coverimguser";
                for(var j=0;j<results.hostimg.length;j++){
                    console.log("in second for");
                    if(results.result[i].host_id==results.hostimg[j].hostid){
                    var hostimgname= results.result[i].property_id+"hostimguser";
                    base64_decode_ng(hostimgname,results.hostimg[j].profileimg);
                    results.result[i].hostimgname= hostimgname+".jpg";
                    console.log("hostimgname="+results.result[i].hostimgname);
                    }
                } 
                base64_decode_ng(coverimgname,results.result[i].propcoverimg);
                results.result[i].coverimgname= coverimgname+".jpg";
                console.log("coverimgname="+results.result[i].coverimgname);
                console.log("i="+i);
                if(results.result.length-i==1){
                    console.log("in if");
                    console.log(req.session.result1);
                    req.session.nayanresult=results;
                    req.session.result1 = results;
                    res.send({"statuscode":200});
            }

            console.log("after for");
                }

            //nayan end

            // console.log(req.session.result1);
            // res.send({"statuscode":200});

            //console.log("result1 is: " + req.session.result1);
            //req.session.destination = destination;
            //req.session.guest = guest;
            //console.log("MMM2" + req.session.guest);
            //console.log("MMM3" + req.session.destination);
        }
        else if (results.code == 401) {
            res.send({"statuscode":401});
        }
    }
});
}


exports.submitnewProp = function(req, res) {

    var destination = req.body.destination;
    var checkin = req.body.checkin;
    var checkout = req.body.checkout;
    var guest = req.body.guest;
    var room1 = req.body.room1;
    var room2 = req.body.room2;
    var room3 = req.body.room3;
    //var x = localStorage.getItem('destination');
    // console.log(x);

    //Anuvrat
    console.log("TESTTESTTESTTESTTESTTESTTESTTESTTESTTESTTESTTESTTESTTESTTESTTESTTESTTESTTEST");
    var cin = "\"" + checkin + "\"";
    var cout = "\"" + checkout + "\"";

    var date1 = new Date(cin);
    var date2 = new Date(cout);
    var timeDiff = Math.abs(date2.getTime() - date1.getTime());
    var diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24));

    console.log("Hello World");
    console.log(diffDays);
    req.session.diffDays = diffDays;
    //Anuvrat

    console.log(room1);
    console.log(room2);
    console.log(room3);
    req.session.destination = destination;
    req.session.guest = guest;
    req.session.checkin = checkin;
    req.session.checkout = checkout;
    // var dummysession=req.session.result1;
    // req.session.result1;
    // console.dir(dummysession);
    // console.log("dummy session mcbc=");
//console.log(checkin);

    //Anuvrat



    //Anuvrat

    if (room1 != " ") {
        console.log("Sahil");
    }

    else {
        console.log("Sagar");
    }


   var msg_payload = {"destination": destination,"checkin":checkin,"checkout": checkout,"guest": guest,"room1":room1,"room2":room2,"room3": room3};
    console.log("In POST Request = destination:" +destination + "checkin:" +checkin +" " + "checkout:"+" "+ checkout +" "+"guest:"+ guest+" "+"room1:"+ room1+" "+"room2:"+ room2+" "+"room3:"+ room3);

    mq_client.make_request('prop__new_queue_sk', msg_payload, function (err, results) {
         console.log(results);
        if (err) {
            throw err;
        }
        else {

            if (results.code == 200) {
                
                var dummysession=req.session.nayanresult;
    req.session.result1;
    console.dir(dummysession);
    console.log("dummy session mcbc=");

    for(var i=0;i<results.result.length;i++){
            console.log("in for nayanresulting i="+i);
            console.log("results.result[i].property_id="+results.result[i].property_id);
        for(var j=0;j<dummysession.result.length;j++){
            console.log("in for nayanresulting j="+j);
            console.log("dummysession.result[i].property_id="+dummysession.result[j].property_id);
            if(results.result[i].property_id==dummysession.result[j].property_id){
                console.log("in if for="+dummysession.result[i].property_id);
                results.result[i].hostimgname=dummysession.result[j].hostimgname;
                results.result[i].coverimgname=dummysession.result[j].coverimgname;
            }
        }
    }

                //nayan
                req.session.result1 = results;

        
                    res.send({"statuscode":200});

                    console.log("after for");
                }



                //nayan

                //console.log("result1 is: " + req.session.result1);
                //req.session.destination = destination;
                //req.session.guest = guest;
                //console.log("MMM2" + req.session.guest);
                //console.log("MMM3" + req.session.destination);
            else if (results.code == 401) {
                res.send({"statuscode":401});
            }
        }
    });
}



exports.indProp = function(req, res){

    var propertyId = req.body.propertyId;
    var checkin = req.body.checkin;
    var checkout = req.body.checkout;
    var guest = req.body.guest;
    var destination = req.body.destination;
    req.session.destination = destination;
    req.session.guest = guest;
    req.session.checkin = checkin;
    req.session.checkout = checkout;
    console.log(req.session.guest);
    req.session.result2;

   
//console.log(checkin);
    //Anuvrat
    console.log("TESTTESTTESTTESTTESTTESTTESTTESTTESTTESTTESTTESTTESTTESTTESTTESTTESTTESTTEST");
    var cin = "\"" + checkin + "\"";
    var cout = "\"" + checkout + "\"";

    var date1 = new Date(cin);
    var date2 = new Date(cout);
    var timeDiff = Math.abs(date2.getTime() - date1.getTime());
    var diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24));

    console.log("Hello World");
    console.log(diffDays);
    req.session.diffDays = diffDays;
    //Anuvrat

    var msg_payload = {"propertyId": propertyId,"checkin":checkin,"checkout": checkout};
    console.log("In POST Request = propertyId:" +propertyId + "checkin:" +checkin +" " + "checkout:"+" "+ checkout);

    mq_client.make_request('prop_desc_queue_sk', msg_payload, function (err, results) {
          console.log(results);
        if (err) {
            throw err;
        }
        else {

            if (results.code == 200) {

                req.session.result2 = results;
                console.log("OUTPUT"+req.session.result1.Qty_available);
                console.log("mongoresult="+results.mongoresult.length);
                //nayan start
                var propimg= results.mongoresult[0].propertyimg.split(',');
                console.log("prop img length="+propimg.length);
                var propnames=[];
                for(var i=0;i<propimg.length;i++){
                    propnames[i]= "propphoto"+i;
                    base64_decode_ng(propnames[i],propimg[i]);
                    propnames[i]= "propphoto"+i+".jpg";
                }
                    req.session.propertyimgs= propnames;
                    res.send({"statuscode":200});
                    //nayanend
            }
            else if (results.code == 401) {
                res.send({"statuscode":401});
            }
        }
    });
}



exports.render_detailPage = function(req, res){
    console.log(" I m into this by here");
    console.log(req.session.result2);
    var data = req.session.result2.prop_result[0];
    var Qty = req.session.result2.Qty_available;
    var data2 = req.session.result2.host_res[0];
    //var data4 = req.session.result2.totalRating;
    var checkout1 = req.session.checkout;
    var checkin= req.session.checkin;
    console.log(req.session.destination);
    console.log("User Loggrd in " + req.session.userid_ab);
    var hostprofileimg= data.property_id+"hostimguser.jpg"
    console.log("host profile path"+hostprofileimg);
    //var booking = {
    //    NIGHTS : 3
        //TOTAL : 5000
    //};
    //Anuvrat


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
        dynprice=Number(data.price)*2;
    }
    else if(dyndiff>7&&dyndiff<=14){
        dynprice=Number(data.price)*1.75;
    }
    else if(dyndiff>14&&dyndiff<=21){
        dynprice=Number(data.price)*1.5;
    }
    else if(dyndiff>21&&dyndiff<=30){
        dynprice=Number(data.price)*1.25;
    }
    else{
        dynprice=data.price;
    }
    //dynamic pricing



    var duration = req.session.diffDays;
    console.log("I am days" + req.session.diffDays);
    var total = Number(dynprice) * Number(duration);
    var final = Number(total) + 56;
    console.log("XXXX" + final);

    //Anuvrat
    res.header('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
    console.log(req.session.guest);
    res.render("detail_sk",{title: 'Welcome to Airbnb',property: data, Qty:Qty, host : data2, ratings: req.session.result2.review_result, totalRatings:req.session.result2.rating, checkin: req.session.checkin, guests: req.session.guest, checkout: req.session.checkout,duration: duration, total : total, final: final, user_log:req.session.userid_ab,propnames:req.session.propertyimgs,hostprofileimg: hostprofileimg,dynprice:dynprice});

    // }
    // else
    // {
    //     res.redirect('/signin');
    // }
};


exports.confirmBook = function(req, res){
    console.log(" I m not a human being by here");
    var propertyId1 = req.body.propertyId;
    var checkin1 = req.body.checkin;
    var checkout1 = req.body.checkout;
    var guest1 = req.body.guest;

    console.log("Variety in house are" + guest1);
    req.session.guest1 = guest1;

    console.log("Total  guest in house" + req.session.guest1)
    req.session.checkin1 = checkin1;
    req.session.checkout1 = checkout1;
    console.log("guest" + propertyId1);
    req.session.result1;
//console.log(checkin);

    var msg_payload = {"propertyId": propertyId1,"checkin":checkin1,"checkout": checkout1};
    console.log("In POST Request = propertyId:" +propertyId1 + "checkin:" +checkin1 +" " + "checkout:"+" "+ checkout1);

    mq_client.make_request('confirm_book_queue_sk', msg_payload, function (err, output) {
        console.log(output);
        if (err) {
            throw err;
        }
        else {

            if (output.code == 200) {

                req.session.result3 = output;
                console.log("OUTPUT"+req.session.result1.Qty_available);

                res.send({"statuscode":200});

                //console.log("result1 is: " + req.session.result1);
                //req.session.destination = destination;
                //req.session.guest = guest;
                //console.log("MMM2" + req.session.guest);
                //console.log("MMM3" + req.session.destination);
            }
            else if (results.code == 401) {
                res.send({"statuscode":401});
            }
        }
    });
}




exports.render_confirmPage = function(req, res){
    console.log(" I m into Airbnb here");
    console.log(req.session.result3);
    var data = req.session.result3.prop_result[0];
    var data1 = req.session.result3.Qty_available;
    var data2 = req.session.result3.host_res[0];
    //var data4 = req.session.result2.totalRating;
    var checkout = req.session.checkout1;
    var checkin = req.session.checkin1;
    console.log("Total  guest into my house" + req.session.guest1);
    console.log(req.session.destination);
    //var booking = {
      //  NIGHTS : 3,
       // TOTAL : 5000
    //};
    var duration = req.session.diffDays;
    console.log("I am days" + req.session.diffDays);

    //dynpricing today 5th dec
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
        dynprice=Number(data.price)*2;
    }
    else if(dyndiff>7&&dyndiff<=14){
        dynprice=Number(data.price)*1.75;
    }
    else if(dyndiff>14&&dyndiff<=21){
        dynprice=Number(data.price)*1.5;
    }
    else if(dyndiff>21&&dyndiff<=30){
        dynprice=Number(data.price)*1.25;
    }
    else{
        dynprice=data.price;
    }

    //dynpricing today 5th dec
    var total = dynprice * Number(duration);
    var final = Number(total) + 56;
    console.log("XXXX" + final);

    res.header('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
    console.log(req.session.guest);
    res.render("confirm_sk",{title: 'Welcome to Airbnb',property: data, host : data2, ratings: req.session.result3.review_result, totalRatings:req.session.result3.rating, checkin: req.session.checkin1, guests: req.session.guest1, checkout: req.session.checkout1,duration: duration, total : total, final: final });

};


//bidding Tuesday

exports.bidProp = function(req, res){
//winston1.log('info',req.session.userid_ab+' is the user.',new Date(), 'user clicks on the bid button');
    var propertyId = req.body.propertyId;
    var checkin = req.body.checkin;
   // var checkout = req.body.checkout;
    var guest = req.body.guest;

    //req.session.destination = destination;
    req.session.guest = guest;
    req.session.checkin = checkin;
    //req.session.checkout = checkout;
    console.log(req.session.guest);
    console.log(req.session.checkin);
   // console.log(req.session.checkout);
    console.log(propertyId);
    req.session.result4;
//console.log(checkin);

    var msg_payload = {"propertyId": propertyId,"checkin":checkin};
    console.log("In POST Request = propertyId:" +propertyId + "checkin:" +checkin);

    mq_client.make_request('prop_bid_queue_sk', msg_payload, function (err, results) {
        console.log("Fetched" + results);
        if (err) {
            throw err;
        }
        else {

            if (results.code == 200) {

                req.session.result4 = results;
                console.log("OUTPUT"+req.session.result4.bidPrice);

                //nayan start
                console.log("length="+results.mongoresult[0].length);
                var propimg= results.mongoresult[0].propertyimg.split(',');
                console.log("prop img length="+propimg.length);
                var propnames=[];
                for(var i=0;i<propimg.length;i++){
                    propnames[i]= "propphoto"+i;
                    base64_decode_ng(propnames[i],propimg[i]);
                    propnames[i]= "propphoto"+i+".jpg";
                }
                    req.session.propertyimgs= propnames;
                    res.send({"statuscode":200});
                    //nayanend

                // res.send({"statuscode":200});

                //console.log("result1 is: " + req.session.result1);
                //req.session.destination = destination;
                //req.session.guest = guest;
                //console.log("MMM2" + req.session.guest);
                //console.log("MMM3" + req.session.destination);
            }
            else if (results.code == 401) {
                res.send({"statuscode":401});
            }
        }
    });
}
//TO be changed
exports.render_bidPage = function(req, res){
    //winston1.log('info',req.session.userid_ab+' is the user.',new Date(), 'bid page is rendered');
    console.log(" I m into this by here");
    //console.log(req.session.result4);
    var data = req.session.result4.prop_result[0];
    var data1 = req.session.result4.Qty_available;
    var data2 = req.session.result4.host_res[0];
    //var data4 = req.session.result2.totalRating;
   // var checkout1 = req.session.checkout;
    //var checkin1 = req.session.checkin;
    var guest1 = req.session.guest;
    var a = new Date();
    var checkin = new Date(a.setDate(a.getDate() + 4));
    var checkin5 = checkin.toISOString();
    var checkin1 = checkin5.substring(0, 10);
    var checkout= new Date(a.setDate(a.getDate() + 1));
    var checkout5 = checkout.toISOString();
    var checkout1 = checkout5.substring(0, 10);
    var biddingprice= req.session.result4.bidPrice;
    var total= biddingprice+56;
    var hostprofileimg= data.property_id+"hostimguser.jpg"
    console.log("host profile path"+hostprofileimg);

        console.log("Hiii" + checkout1);
        console.log("Hiii" + checkin1);
        console.log("Hiii");
    // console.log(req.session.user_ab.email);

    var booking = {
        NIGHTS : 1
        //TOTAL : 5000
    };

    res.header('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
    console.log(req.session.guest);
    res.render("bidPage_sk",{title: 'Welcome to Airbnb',property: data, host : data2, ratings: req.session.result4.review_result, totalRatings:req.session.result4.rating, booking: booking, checkin: checkin1,checkout: checkout1, guests: guest1, bidPrice: req.session.result4.bidPrice,propnames:req.session.propertyimgs,hostprofileimg: hostprofileimg,total:total, user_log:req.session.userid_ab});

    // }
    // else
    // {
    //     res.redirect('/signin');
    // }
};


exports.placeabid =  function(req, res){
//winston1.log('info',req.session.userid_ab+' is the user.',new Date(), 'user clicks on the place bid button with a bid of'+req.session.result4.bidPrice);
    var propertyId = req.body.propertyId;
    var checkin = req.body.checkin;
    var guest = req.body.guest;
    var bidPrice = req.body.bidPrice;
    var hostfname = req.body.hostfname;
    var hostlname = req.body.hostlname;
    var hostId =  req.body.hostId;
    var user_id = req.session.userid_ab;
    var userFname = req.session.firstname_ab;
    var userLname = req.session.lastname_ab;
    var email = req.session.user_ab.email;
    var guests = req.body.guests;
    var checkout = req.body.checkout;
    var type = req.body.type;
    var city = req.body.city;
    var state = req.body.state;
    var apt = req.body.apt;
    var zip = req.body.zip;
    var street = req.body.street;
    var guest_place = req.body.guest_place;
    var place = req.body.place;
    var country = req.body.country;
   // var total = bidPrice + 356;


    //req.session.destination = destination;
    req.session.guest = guest;
    req.session.checkin = checkin;
    req.session.bidPrice1 = bidPrice;
    console.log(req.session.guest);
    console.log(req.session.checkin);
    console.log(propertyId);
    console.log(checkin);
    console.log(guest);
    console.log(bidPrice);
    console.log(hostfname);
    console.log(hostlname);
    console.log(hostId);

    //req.session.result5;
//console.log(checkin);

    var msg_payload = {"propertyId": propertyId,"bidPrice":bidPrice,"hostfname":hostfname,"hostlname":hostlname,"hostId":hostId,"user_id":user_id,"userFname":userFname,"userLname":userLname,"email":email,"guests":guests,"checkout":checkout,"checkin":checkin,"type":type,"city":city,"state":state,"apt":apt,"zip":zip,"street":street,"guest_place":guest_place,"place":place,"country":country};
    console.log("In POST Request = propertyId:" + propertyId + "guest"+ guest +"bidPrice" + bidPrice + "hostfname" + hostfname + "hostlname" + hostlname + "hostId" + hostId+"user_id"+user_id+"userFname"+userFname+"userLname"+userLname+"email"+email+"guests"+guests+"checkout"+checkout+"type"+type+"city"+city+"state"+state+"apt"+apt+"zip"+zip+"street"+street+"guest_place"+guest_place+"place"+place);

    mq_client.make_request('prop_placebid_queue_sk', msg_payload, function (err, results) {
        console.log("Fetched" + results);
        if (err) {
            throw err;
        }
        else {

            if (results.code == 200) {




                res.send({"statuscode":200});

                //console.log("result1 is: " + req.session.result1);
                //req.session.destination = destination;
                //req.session.guest = guest;
                //console.log("MMM2" + req.session.guest);
                //console.log("MMM3" + req.session.destination);
            }
            else if (results.code == 401) {
                res.send({"statuscode":401});
            }
        }
    });
}

exports.render_bidsuccPage = function(req, res){
     //winston1.log('info',req.session.userid_ab+' is the user.',new Date(), 'bidding is confirmed');
    console.log(" Bid Successful");

    var Price = req.session.bidPrice1;
    var User = req.session.user_ab.firstname;
    console.log("I am tryrryryr here" + req.session.user_ab.firstname);
    //var date = "Dummy";
    //var time = "Dummy";



    res.header('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
    console.log(req.session.guest);
    res.render("bidsucc_sk",{title: 'Welcome to Airbnb',price: Price, user: User});

    // }
    // else
    // {
    //     res.redirect('/signin');
    // }
};

//ANuvrat
exports.addNewHostMessage = function (req, res) {
    console.log("Inside the host message function for new insert");
    console.log(req.body.checkin);
    console.log(req.body.checkout);
    console.log(req.body.guests);
    console.log(req.body.property_id);
    //req.session.duration = 3;
    var checkin = req.body.checkin;
    var checkout = req.body.checkout;
    var guests =  req.session.guest1;
    var property_id = req.body.property_id;
    var user_id = req.session.userid_ab;
    var userName = req.session.user_ab;
    var hostid = req.body.hostid;
    var proplace = req.body.proplace;
    var prop_price = req.body.prop_price;
    var prop_place = req.body.prop_place;
    var prop_city  = req.body.prop_city;
    var prop_apt   = req.body.prop_apt;
    var prop_zip   = req.body.prop_zip;
    var prop_country = req.body.prop_country;
    var prop_street  = req.body.prop_street;
    var user_id = req.session.userid_ab;
    var user_name =req.session.firstname_ab;
    var duration = req.session.diffDays
    var prop_state = req.body.prop_state;
    var prop_type =  req.body.prop_type;

    var prop_qty = req.body.prop_qty;

    console.log(user_id + " " + user_name);

    console.log("In POST Request = checkin:" + checkin + "checkout"+ checkout +"guests" + guests + "property_id" + property_id + "user_id" + user_id + "userName" + userName + "proplace" + proplace +"hostid" + hostid +"prop_price" + prop_price+"prop_place" + prop_place+"prop_city" + prop_city+"prop_apt" + prop_apt+"prop_zip" + prop_zip+"prop_country" + prop_country+"prop_street" + prop_street+"user_id" + user_id+"user_name" + user_name+"duration" + duration+"prop_state" + prop_state+"prop_type" + prop_type+"prop_qty"+ prop_qty);
    var msg_payload = {"checkin": checkin, "checkout": checkout, "guests": guests, "property_id" : property_id, "user_id": user_id ,"userName" : userName,"hostid" : hostid,"proplace" : proplace,"prop_price" :prop_price,"prop_place" : prop_place,"prop_city" : prop_city,"prop_apt" : prop_apt,"prop_zip" : prop_zip,"prop_country" : prop_country,"prop_street" : prop_street,"user_id" : user_id,"user_name" : user_name,"duration" : duration,"prop_state" : prop_state,"prop_type" : prop_type,"prop_qty": prop_qty};
    mq_client.make_request('inserthostMessageQ', msg_payload, function (err, results) {
        console.log(results);
        if (err) {
            throw err;
        }
        else {

            if (results.code == 200) {

                req.session.result5 = results;
                //console.log("OUTPUT"+req.session.result1.Qty_available);

                res.send({"statusCode":200});

                //console.log("result1 is: " + req.session.result1);
                //req.session.destination = destination;
                //req.session.guest = guest;
                //console.log("MMM2" + req.session.guest);
                //console.log("MMM3" + req.session.destination);
            }
            else if (results.code == 401) {
                res.send({"statuscode":401});
            }
        }
    });

}

exports.render_finalConfirmation = function(req, res){
    console.log("finalConfirmation");
    res.header('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
    //console.log(req.session.guest);
    res.render("finalConfirmation");

};


exports.getusermessage_sk=function (req,res) {
    console.log("inside get host message");
    //var op= "getusermessage";
    console.log(req.session.hostid);
    var msg_payload = {"user_id": req.session.userid_ab};
    mq_client.make_request('user_msgqueue',msg_payload, function(err,results){
        if(err){
            throw err;
        }
        else
        {
            if(results.code == "200"){
                console.log('back in front end messsage');
                console.dir(results.result);
                res.send(results.result);

            }
            else{
                console.log("ERROR");
            }
        }
    });
};

exports.getusertrip_sk=function (req,res) {
    console.log("inside get host message");
    //var op= "getusermessage";
    console.log(req.session.hostid);
    var msg_payload = {"user_id": req.session.userid_ab};
    mq_client.make_request('user_tripqueue',msg_payload, function(err,results){
        if(err){
            throw err;
        }
        else
        {
            if(results.code == "200"){
                console.log('back in front end messsage');
                console.dir(results.result);
                res.send(results.result);

            }
            else{
                console.log("ERROR");
            }
        }
    });
};

exports.getuserfuturetrip_sk=function (req,res) {
    console.log("inside get trip message");
    //var op= "getusermessage";
    //console.log(req.session.hostid);
    var msg_payload = {"user_id": req.session.userid_ab};
    mq_client.make_request('user_futuretripqueue',msg_payload, function(err,results){
        if(err){
            throw err;
        }
        else
        {
            if(results.code == "200"){
                console.log('back in front end messsage');
                console.dir(results.result);
                res.send(results.result);

            }
            else{
                console.log("ERROR");
            }
        }
    });
};

exports.deluserfuturetrip_sk=function (req,res) {
    console.log("inside get trip message");
    var property = req.body.property;
    var bill = req.body.bill;
    var trip = req.body.trip;
    //var op= "getusermessage";
    //console.log(req.session.hostid);
    var msg_payload = {"user_id": req.session.userid_ab,"property":property,"bill":bill,"trip":trip};
    mq_client.make_request('user_deletefuturetrip',msg_payload, function(err,results){
        if(err){
            throw err;
        }
        else
        {
            if(results.code == "200"){
                console.log('back in front end messsage');
                console.dir(results.result);
                res.send({"statusCode":200});

            }
            else{
                console.log("ERROR");
            }
        }
    });
};

exports.edituserfuturetrip_sk=function (req,res) {
    console.log("inside edit trip message");
    var property = req.body.property;
    var bill = req.body.bill;
    var trip = req.body.trip;
    var checkin = req.body.checkin;
    var checkout = req.body.checkout;
    var cin = "\"" + checkin + "\"";
    var cout = "\"" + checkout + "\"";

    var date1 = new Date(cin);
    var date2 = new Date(cout);
    var timeDiff = Math.abs(date2.getTime() - date1.getTime());
    var diffDays1 = Math.ceil(timeDiff / (1000 * 3600 * 24));

    console.log("Hello World");
    console.log(diffDays1);
    req.session.diffDays1 = diffDays1;
    //var op= "getusermessage";
    //console.log(req.session.hostid);
    var msg_payload = {"user_id": req.session.userid_ab,"property":property,"bill":bill,"trip":trip,"checkin":checkin,"checkout":checkout,"duration":req.session.diffDays1};
    mq_client.make_request('user_editfuturetrip',msg_payload, function(err,results){
        if(err){
            throw err;
        }
        else
        {
            if(results.code == "200"){
                console.log('back in front end messsage');
                console.dir(results.result);
                res.send({"statusCode":200});

            }
            else{
                console.log("ERROR");
            }
        }
    });
};

exports.user_transaction_history= function (req,res) {

    console.log("inside user transaction history");
    var op= "history_user";
    var msg_payload = { "operation": op,"userid": req.session.userid_ab };
    mq_client.make_request('host_queue',msg_payload, function(err,results){
        if(err){
            throw err;
        }
        else
        {
            if(results.code === "200"){
                console.log('wapis aa gya');
                //console.log("Results:"+results.result[0].bill_date);
                //results.result[0].total=+results.result[0].total + +300;
                res.render('user_transaction_history_sk',{rec:results.result});

            }
            else{
                console.log("ERROR");
            }
        }
    });
};


// bill Search

exports.searchBills_sk = function(req,res){

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
    var user_id = req.session.userid_ab;
    console.log("searchString is "+searchString)

    var msg_payload = {"searchString": searchString,"user_id": user_id};

    mq_client.make_request('getUserBills_queue_sk', msg_payload, function (err, results) {
        if (err) {
            throw err;
        }
        else {
            if (results.code == 200) {

                console.log(results.billResults.length)

                if(results.billResults.length > 0){
                    req.session.allbills_sk = results.billResults;
                   console.log(req.session.allbills_sk);
                }else if(results.billResults.length == 0){
                    console.log("no ")
                    req.session.allbills_sk = null;
                }

                res.send({"statuscode": 200});


            }else if (results.code == 201) {
                console.log("phone not updated")
            }

        }
    });
}



exports.search_BillsPage_sk = function(req,res) {

    ejs.renderFile('./views/SearchUser_bill.ejs', { title: 'Welcome to Airbnb'} ,
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

exports.bills_Page_sk = function(req,res){
    console.log("here")

    var len;

    if(req.session.allbills_sk != null){
        len = req.session.allbills_sk.length
    }else{
        len = 0
    }

    ejs.renderFile('./views/bills11_sk.ejs', { title: 'Welcome to Airbnb', bills: req.session.allbills_sk, length: len} ,
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

exports.openBill_sk = function(req,res){
    var bill_id = req.param("bill_id")

    req.session.currentBillId_sk = bill_id;

    console.log("here to open bill")

    console.log(req.session.currentBillId_sk)

    res.send({"statuscode": 200});
}



exports.billDetails_sk = function(req,res){

    var currentBill;
    for(i in req.session.allbills_sk){

        if(req.session.allbills_sk[i].bill_id == req.session.currentBillId_sk){
            currentBill = req.session.allbills_sk[i]
        }
    }


    console.log("juts check")
    console.log(currentBill)



    ejs.renderFile('./views/billview_sk.ejs', { title: 'Welcome to Airbnb', bill: currentBill} ,
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

//bill search