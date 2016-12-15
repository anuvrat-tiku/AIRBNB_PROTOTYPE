var mq_client = require('../rpc/client');
var passport= require('passport');
var LocalStrategy= require('passport-local');
var bCrypt= require('bcrypt');
var fs = require('fs');
var nodemailer = require("nodemailer");
var winston=require('winston');

var smtpTransport = nodemailer.createTransport("SMTP",{
   service: "Gmail",  // sets automatically host, port and connection security settings
   auth: {
       user: "nayalgoel@gmail.com",
       pass: "shimisawesome"
   }
});

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


var createHash = function(password){
		 return bCrypt.hashSync(password, bCrypt.genSaltSync(10), null);
		};

passport.serializeUser(function(user, done) {

  done(null, user);

});


passport.deserializeUser(function(id, done) {

  mongodb.userModel.findById(id, function(err, user) {

    done(err, user);

  });

});


passport.use('signuphost_ng', new LocalStrategy({

usernameField : 'email',

passwordField : 'password',

    passReqToCallback : true

  },

  function(req,username, password, done) {

  console.log("bulla");

  var findOrCreateUser = function(){

    console.log("ENTERED findorcreate");
    console.log(username+","+password+","+done);

    var op = "signuphost_ng";
    var profileimg= base64_encode_ng("././public/default.png");
    var hostvideo= base64_encode_ng("././public/camera.png");
    console.log("profileimg"+profileimg);
	var msg_payload = { "operation": op, "email": username, "password": password,"fname": req.param("first"), "lname":req.param("last"), "profileimg":profileimg, "hostvideo": hostvideo};
	mq_client.make_request('host_queue',msg_payload, function(err,results){
		console.log(results);
		if(err){
			throw err;
		}
		else 
		{	
			// console.log("code"+results.code);
			if(results.code == 200){
			// 	console.log("valid signuphost");
			// 	console.log("host id"+results.hostid);
			// 	console.log("fname="+results.fname);
			// 	req.session.email = results.email;
			// 	req.session.hostid= results.host_id;
			// 	req.session.fname= results.fname;
			// 	req.session.message_num='0';
			// 	req.session.profileimg= results.profileimg;
			// 	base64_decodevideo_ng("hostvideo",results.hostvideo);
			// 	base64_decode_ng("hostprofileimg",results.profileimg);
			// 	if(results.hostvideo==hostvideo){
			// 		console.log("equal");
			// 	}
			// 	else{
			// 		console.log("not equal");
			// 	}
			// 	req.session.propinfo={};
			// 	req.session.propinfo.propimg=[];

			smtpTransport.sendMail({  //email options
				   from: "Airbnb <nayangoel@gmail.com>", // sender address.  Must be the same as authenticated user if using Gmail.
				   to: "Receiver Name <"+username+">", // receiver
				   subject: "Welcome To Airbnb", // subject
				   text: "Your request to become a host has been sent to the admin for approval." // body
				}, function(error, response){  //callback
				   if(error){
				       console.log(error);
				   }else{
				       console.log("Message sent: " + response.message);
				   }
				   
				   smtpTransport.close(); // shut down the connection pool, no more messages.  Comment this line out to continue sending emails.
				});
				return done(null, results);
			}
			else {
				console.log("Invalid Signup");
				return done(null, false, req.flash('message','User Already Exists'));
			}
		}  
	});

    };

    process.nextTick(findOrCreateUser);

  }));

passport.use('signinhost_ng', new LocalStrategy({

usernameField : 'email',

passwordField : 'password',

    passReqToCallback : true

  },

  function(req,username, password, done) {

  console.log("bulla");

  var findOrCreateUser = function(){

    var op = "signinhost_ng";
	var msg_payload = { "operation": op, "email": username, "password":password };
	console.log(username+" , "+password);
	mq_client.make_request('host_queue',msg_payload, function(err,results){
		console.log(results);
		if(err){
			throw err;
		}
		else 
		{
			if(results.code == 200){
				console.log("valid Login");
				console.log("host id"+results.hostid);
				console.log("fname="+results.fname);
				req.session.email = results.email;
				req.session.hostid= results.hostid;
				req.session.fname= results.fname;
				req.session.profileimg= results.profileimg;
				req.session.host_pageclick= results.host_pageclick[0];
				base64_decode_ng("hostprofileimg",results.profileimg);
				base64_decodevideo_ng("hostvideo",results.hostvideo);
				req.session.propinfo={};
				req.session.propinfo.propimg=[];
				console.log("host_pageclick");
				console.dir(req.session.host_pageclick);
				return done(null, results);
			}
			else {
				console.log("Invalid Login");
				return done(null, false, req.flash('message','User Already Exists'));
			}
		}  
	});

    };

    process.nextTick(findOrCreateUser);

  }));

exports.hoststart1_ng=function (req,res) {
	 winston.log('info',req.session.fname+' is the user.',new Date(), 'Host has clicked on start button.');
	req.session.propinfo.place= req.param('place');
	req.session.propinfo.address=req.param('address');
	req.session.propinfo.guestnum=req.param('guestnum');
	res.redirect('/step1');
};

exports.hoststep1_ng=function (req,res) {
	winston.log('info',req.session.fname+' is the user.',new Date(), 'Host has clicked on  Next button in step 1.');
	req.session.propinfo.guest_place= req.param('guest_place');
	req.session.propinfo.type=req.param('type');
	res.redirect('/step1_bedroom');
};

exports.hoststep1_bedroom_ng=function (req,res) {
	winston.log('info',req.session.fname+' is the user.',new Date(), 'Host has clicked on  Next button in step 1.');
	req.session.propinfo.bed= req.param('bed');
	req.session.propinfo.guest=req.param('guest');
	res.redirect('/step1_bathroom');
};

exports.hoststep1_bathroom_ng=function (req,res) {
	winston.log('info',req.session.fname+' is the user.',new Date(), 'Host has clicked on  Next button in step 1.');
	req.session.propinfo.bathroom= req.param('bathroom');
	res.redirect('/step1_location');
};

exports.hoststep1_location_ng=function (req,res) {
	winston.log('info',req.session.fname+' is the user.',new Date(), 'Host has clicked on  Next button in step 1.');
	req.session.propinfo.country= req.param('country');
	req.session.propinfo.city=req.param('city');
	req.session.propinfo.state=req.param('state');
	req.session.propinfo.street=req.param('street');
	req.session.propinfo.apt=req.param('apt');
	req.session.propinfo.zip=req.param('zip');
	res.redirect('/step1_amenities');
};

exports.hoststep1_amenities_ng=function (req,res) {
	winston.log('info',req.session.fname+' is the user.',new Date(), 'Host has clicked on  Next button in step 1.');
	req.session.propinfo.amenities= req.param('amenities');
	res.redirect('/step1_spaces');
};

exports.hoststep1_spaces_ng=function (req,res) {
	winston.log('info',req.session.fname+' is the user.',new Date(), 'Host has clicked on  Finish button in step 1.');
	req.session.propinfo.spaces= req.param('spaces');
	res.redirect('/step2');
};

exports.hoststep2_editdescription_ng=function (req,res) {
	winston.log('info',req.session.fname+' is the user.',new Date(), 'Host has clicked on  Next button in step 2.');
	req.session.propinfo.description= req.param('edit');
	res.redirect('/step2_nameplace');
};

exports.hoststep2_nameplace_ng=function (req,res) {
	winston.log('info',req.session.fname+' is the user.',new Date(), 'Host has clicked on  Next button in step 2.');
	req.session.propinfo.placename= req.param('name');
	res.redirect('/step2_description');
};

exports.hoststep2_description_ng=function (req,res) {
	winston.log('info',req.session.fname+' is the user.',new Date(), 'Host has clicked on  Next button in step 2.');
	req.session.propinfo.nearbyloc= req.param('close');
	req.session.propinfo.love= req.param('love');
	req.session.propinfo.extrafeatures= req.param('amenities');
	res.redirect('/step2_mobile');
};

exports.hoststep2_mobile_ng=function (req,res) {
	winston.log('info',req.session.fname+' is the user.',new Date(), 'Host has clicked on Finish button in step 2.');
	req.session.propinfo.phone= req.param('phone');
	res.redirect('/step3');
};

exports.hoststep3_rules_ng=function (req,res) {
	winston.log('info',req.session.fname+' is the user.',new Date(), 'Host has clicked on Next button in step 3.');
	req.session.propinfo.children= req.param('children');
	req.session.propinfo.infants= req.param('infants');
	req.session.propinfo.smoking= req.param('smoking');
	req.session.propinfo.events= req.param('events');
	req.session.propinfo.pets= req.param('pets');
	res.redirect('/step3_ready');
};

exports.hoststep3_advance_ng=function (req,res) {
	winston.log('info',req.session.fname+' is the user.',new Date(), 'Host has clicked on Next button in step 3.');
	req.session.propinfo.advance= req.param('advance');
	res.redirect('/step3_long');
};

exports.hoststep3_ready_ng=function (req,res) {
	winston.log('info',req.session.fname+' is the user.',new Date(), 'Host has clicked on Next button in step 3.');
	req.session.propinfo.notice= req.param('notice');
	req.session.propinfo.from= req.param('from');
	req.session.propinfo.to= req.param('to');
	res.redirect('/step3_advance');
};

exports.hoststep3_long_ng=function (req,res) {
	winston.log('info',req.session.fname+' is the user.',new Date(), 'Host has clicked on Next button in step 3.');
	req.session.propinfo.min= req.param('min');
	req.session.propinfo.max= req.param('max');
	res.redirect('/step3_price');
};

exports.hoststep3_price_ng=function (req,res) {
	winston.log('info',req.session.fname+' is the user.',new Date(), 'Host has clicked on Next button in step 3.');
	var val= req.param('val');
	if(val==="bid"){
		res.redirect('/step3_bid');
	}
	else if(val==="fixed"){
		res.redirect('/step3_baseprice');
	}
};

exports.hoststep3_baseprice_ng=function (req,res) {
	winston.log('info',req.session.fname+' is the user.',new Date(), 'Host has clicked on Submit button in step 3.');
	req.session.propinfo.bid='0';
	req.session.propinfo.currency= req.param('currency');
	req.session.propinfo.price= req.param('price');
	console.log("session fixed ="+req.session.propinfo.bid);
	res.redirect('/allsteps');
};

exports.hoststep3_bid_ng=function (req,res) {
	winston.log('info',req.session.fname+' is the user.',new Date(), 'Host has clicked on Submit button in step 3.');
	req.session.propinfo.bid= '1';
	req.session.propinfo.currency= req.param('currency');
	req.session.propinfo.price= req.param('price');
	console.log("session bid ="+req.session.propinfo.bid);
	res.redirect('/allsteps');
};


exports.allsteps_ng=function(req,res) {
	winston.log('info',req.session.fname+' is the user.',new Date(), 'Host has finished all steps');
	
	var place=req.session.propinfo.place;
	var address=req.session.propinfo.address;
	var guestnum=req.session.propinfo.guestnum;
	var guest_place=req.session.propinfo.guest_place;
	var type=req.session.propinfo.type;
	var bed=req.session.propinfo.bed;
	var guest=req.session.propinfo.guest;
	var bathroom=req.session.propinfo.bathroom;
	var country=req.session.propinfo.country;
	var city=req.session.propinfo.city;
	var state=req.session.propinfo.state;
	var street=req.session.propinfo.street;
	var apt=req.session.propinfo.apt;
	var zip=req.session.propinfo.zip;
	var amenities=req.session.propinfo.amenities;
	var spaces=req.session.propinfo.spaces;
	var description=req.session.propinfo.description;
	var placename=req.session.propinfo.placename;
	var nearbyloc=req.session.propinfo.nearbyloc;
	var love=req.session.propinfo.love;
	var extrafeatures=req.session.propinfo.extrafeatures;
	var phone=req.session.propinfo.phone;
	var children=req.session.propinfo.children;
	var infants=req.session.propinfo.infants;
	var smoking=req.session.propinfo.smoking;
	var events=req.session.propinfo.events;
	var pets=req.session.propinfo.pets;
	var advance=req.session.propinfo.advance;
	var notice=req.session.propinfo.notice;
	var from=req.session.propinfo.from;
	var to=req.session.propinfo.to;
	var min=req.session.propinfo.min;
	var max=req.session.propinfo.max;
	var currency=req.session.propinfo.currency;
	var price=req.session.propinfo.price;
	var bid=req.session.propinfo.bid;
	console.log("bid="+bid);
	var propimg="";
	var i=0;
	console.log("req.session.propinfo.propimg.length="+req.session.propinfo.propimg.length);
	for(i=0;i<req.session.propinfo.propimg.length-1;i++){
	propimg+= req.session.propinfo.propimg[i]+",";
	}
	console.log("session propimg");
	// console.dir(req.session.propinfo.propimg);
	propimg=propimg+req.session.propinfo.propimg[i];
	console.log("propimg="+propimg.length);
	var op="property_details";
	var msg_payload = { "operation": op,"place":place,"address":address,"bid":bid,"guestnum":guestnum,"guest_place":guest_place,"type":type,"guest":guest,"bed":bed,"bathroom":bathroom,"country":country,"city":city,"state":state,"apt":apt,"zip":zip,"amenities":amenities,"spaces":spaces,"description":description,"placename":placename,"nearbyloc":nearbyloc,"love":love,"extrafeatures":extrafeatures,"phone":phone,"children":children,"infants":infants,"smoking":smoking,"events":events,"pets":pets,"advance":advance,"notice":notice,"from":from,"to":to,"min":min,"max":max,"currency":currency,"price":price,"hostid":req.session.hostid,"street":street, "propertyimg":propimg};
	mq_client.make_request('property_queue',msg_payload, function(err,results){
		if(err){
			throw err;
		}
		else 
		{
			if(results.code == "200"){
				
				res.render('all_steps_tg', {});
				}
			else{
				console.log("ERROR");
			}
		}
	});

	
};

exports.propertylist_ng = function (req,res) {
	winston.log('info',req.session.fname+' is the user.',new Date(), 'Host has clicked on Home button');
	
	console.log("in property list");
	var op= "propertylist";
	var msg_payload = { "operation": op,"hostid": req.session.hostid};
	mq_client.make_request('property_queue',msg_payload, function(err,results){
		if(err){
			throw err;
		}
		else 
		{
			if(results.code == "200"){
				var listing_result= results.result;
				req.session.message_num= results.message_num;
				console.log("req.session.message_num="+req.session.message_num);
				console.log("length="+listing_result.length);
				for(var i=0;i<listing_result.length;i++){
					var coverimgname= listing_result[i].property_id+"coverimg";
				base64_decode_ng(coverimgname,listing_result[i].propcoverimg);
				listing_result[i].coverimgname= coverimgname+".jpg";
				listing_result[i].message_num= req.session.message_num;
				console.log("coverimgname="+ listing_result.coverimgname);
				console.log("i="+i);
				if(listing_result.length-i==1){
					console.log("i=listing_result");
				res.send(listing_result);
			}
				}

				}
			else{
				console.log("ERROR");
			}
		}
	});
};

exports.propertydelete_ng= function (req,res) {
	winston.log('info',req.session.fname+' is the user.',new Date(), 'Host has clicked on Delete property button');
	console.log("in property delete");
	var op= "propertydelete";
	var msg_payload = { "operation": op,"property_id": req.param('property_id'), "host_id": req.session.hostid};
	mq_client.make_request('property_queue',msg_payload, function(err,results){
		if(err){
			throw err;
		}
		else 
		{
			if(results.code == "200"){
				
				console.dir(results.result);
				res.send(results.result);

				}
			else{
				console.log("ERROR");
			}
		}
	});

};


exports.preview_ng= function (req,res) {
	winston.log('info',req.session.fname+' is the user.',new Date(), 'Host has clicked on Preview button');
	console.log("in preview");
	var op= "preview";
	var id= req.param('propid');
	console.log("property="+req.param('propid'));
	var msg_payload = { "operation": op,"property_id": req.param('propid')};
	mq_client.make_request('property_queue',msg_payload, function(err,results){
		if(err){
			throw err;
		}
		else 
		{
			if(results.code == "200"){
				console.log("in preview result");
				console.dir(results.result);
				console.log("pets="+results.result[0].pets);
				var coverimg= id+"coverimg.jpg";
				var propimg= results.mongoresult[0].propertyimg.split(',');
				console.log("prop img length="+propimg.length);
				var propnames=[];
				for(var i=0;i<propimg.length;i++){
					propnames[i]= "propphoto"+i;
					base64_decode_ng(propnames[i],propimg[i]);
					propnames[i]= "propphoto"+i+".jpg";

				}
				console.log("cover= "+coverimg);
				res.render('host_preview',{fname:req.session.fname, description: results.result[0].description, guest_place: results.result[0].guest_place, guest:results.result[0].guest, bed: results.result[0].bed, bathroom: results.result[0].bathroom, place: results.result[0].place, smoking: results.result[0].smoking, pets: results.result[0].pets, infants: results.result[0].infants, nearbyloc: results.result[0].nearbyloc, amenities: results.result[0].amenities, extrafeatures: results.result[0].extrafeatures, city: results.result[0].city, state: results.result[0].state, price: results.result[0].price, property_id: results.result[0].property_id, coverimg: coverimg, type: results.result[0].type, propnames: propnames, xcoord: results.result[0].xcoord, ycoord: results.result[0].ycoord});

				}
			else{
				console.log("ERROR");
			}
		}
	});

};



exports.loadprofile_ng= function(req,res){
	winston.log('info',req.session.fname+' is the user.',new Date(), 'Host has clicked on Profile button');

	console.log("in load profile");
	var op= "loadprofile";
	var msg_payload = { "operation": op,"property_id": req.param('property_id'), "host_id": req.session.hostid};
	mq_client.make_request('host_queue',msg_payload, function(err,results){
		if(err){
			throw err;
		}
		else 
		{
			if(results.code == "200"){
				
				console.dir(results.result);
				res.send(results.result);

				}
			else{
				console.log("ERROR");
			}
		}
	});

};

exports.updatehostprofile_ng= function (req,res) {
	winston.log('info',req.session.fname+' is the user.',new Date(), 'Host has clicked on Update Profile button');
	console.log("in load profile");
	var op= "updatehostprofile";
	console.log(req.session.hostid);
	var msg_payload = { "operation": op,"fname":req.param("fname"),"lname": req.param("lname"),"dob":req.param("dob"),"email":req.param("email"),"phone": req.param("phone"), "gender": req.param("gender"),"hostid": req.session.hostid };
	mq_client.make_request('host_queue',msg_payload, function(err,results){
		if(err){
			throw err;
		}
		else 
		{
			if(results.code == "200"){
				
				console.dir(results.result);
				res.send(results.result);

				}
			else{
				console.log("ERROR");
			}
		}
	});
};

exports.uploadhostprofileimg_ng= function (req,res) {
	winston.log('info',req.session.fname+' is the user.',new Date(), 'Host has clicked on Update Profile Image button');
	console.log("in upload image");
	console.log(req.files.file.path);
	var base64str_img = base64_encode_ng(req.files.file.path);
	console.log("base64str: "+base64str_img.length);
	var op= "uploadhostprofileimg";
	console.log(req.session.hostid);
	var msg_payload = { "operation": op,"img":base64str_img,"hostid": req.session.hostid };
	mq_client.make_request('host_queue',msg_payload, function(err,results){
		if(err){
			throw err;
		}
		else 
		{
			if(results.code == "200"){
				
				console.dir(results.result);
				res.redirect('/host_media');

				}
			else{
				console.log("ERROR");
			}
		}
	});

};

exports.loadhostmedia_ng=function (req,res) {
	winston.log('info',req.session.fname+' is the user.',new Date(), 'Host has clicked on Upload Video button');
	console.log("in load host media");

	var op= "loadhostmedia";
	console.log(req.session.hostid);
	var msg_payload = { "operation": op,"hostid": req.session.hostid };
	mq_client.make_request('host_queue',msg_payload, function(err,results){
		if(err){
			throw err;
		}
		else 
		{
			if(results.code == "200"){
				
				console.dir("host="+results.result[0].hostid);
				base64_decode_ng("hostprofileimg",results.result[0].profileimg);
				console.log("wapas agaya");
				res.render('host_media_tg');

				}
			else{
				console.log("ERROR");
			}
		}
	});

};

exports.uploadpropertyimg_ng= function (req,res) {
	winston.log('info',req.session.fname+' is the user.',new Date(), 'Host has clicked on Upload property button');
	
	console.log("in upload property pics");
	console.dir(req.files);
	if(req.files)
	console.log("length="+req.files.file.length);
	for(var i=0;i<req.files.file.length;i++){
		console.log("path="+req.files.file[i].path);
		var base64str_img = base64_encode_ng(req.files.file[i].path);
		console.log("base64str: "+base64str_img.length);
		req.session.propinfo.propimg[i]= base64str_img;
	}
	console.dir(req.session);
	console.log("length= "+req.session.propinfo.propimg.length);
	res.redirect('/step2_editDescription');

};

exports.host_media_ng= function (req,res) {
	winston.log('info',req.session.fname+' is the user.',new Date(), 'Host has clicked on Photos, Video button');

console.log("app.js"+req.session.fname);

res.redirect('/loadhostmedia');
};

exports.uploadhostvideo_ng= function (req,res) {
	winston.log('info',req.session.fname+' is the user.',new Date(), 'Host has clicked on Upload Video button');
		console.log("in upload video");
		console.dir(req.files.file.path);
		var base64str_video = base64_encode_ng(req.files.file.path);
		base64_decodevideo_ng("hostvideo",base64str_video);

	console.log("base64str: "+base64str_video.length);
	var op= "uploadhostvideo";
	console.log(req.session.hostid);
	var msg_payload = { "operation": op,"hostvideo":base64str_video,"hostid": req.session.hostid };
	mq_client.make_request('host_queue',msg_payload, function(err,results){
		if(err){
			throw err;
		}
		else 
		{
			if(results.code == "200"){
				
				console.dir(results.result);
				res.redirect('/host_media');

				}
			else{
				console.log("ERROR");
			}
		}
	});
};

exports.host_home_ng= function (req,res) {
	winston.log('info',req.session.fname+' is the user.',new Date(), 'Host has clicked on Home button');
	console.log("app.js"+req.session);
	console.dir(req.session);
	res.render('host_home');
};

exports.gethostmessage_ng=function (req,res) {
	winston.log('info',req.session.fname+' is the user.',new Date(), 'Host has clicked on Message button');
	console.log("inside get host message");
	var op= "gethostmessage";
	console.log(req.session.hostid);
	var msg_payload = { "operation": op,"host_id": req.session.hostid};
	mq_client.make_request('host_queue',msg_payload, function(err,results){
		if(err){
			throw err;
		}
		else 
		{
			if(results.code == "200"){
				
				console.dir(results.result);
				res.send(results.result);

				}
			else{
				console.log("ERROR");
			}
		}
	});
};

exports.sethostmessagedenied_ng= function (req,res) {
	winston.log('info',req.session.fname+' is the user.',new Date(), 'Host has clicked on Deny message button');
	
	console.log("message denied");
	var op= "setmessagedenied";
	console.log("message id="+req.param('message_id'));
	var msg_payload = { "operation": op,"message_id": req.param('message_id'),"host_fname":req.session.fname};
	mq_client.make_request('host_queue',msg_payload, function(err,results){
		if(err){
			throw err;
		}
		else 
		{
			if(results.code == "200"){
				
				console.dir(results.result);
				res.send(200);

				}
			else{
				console.log("ERROR");
			}
		}
	});
};

exports.sethostmessageaccept_ng= function (req,res) {
	winston.log('info',req.session.fname+' is the user.',new Date(), 'Host has clicked on Accept message button');
	
	console.log("message accept");
	var op= "setmessageaccept";
	console.log("message id="+req.param('message_id'));
	var msg_payload = { "operation": op,"message_id": req.param('message_id'),"hostname":req.session.fname };
	mq_client.make_request('host_queue',msg_payload, function(err,results){
		if(err){
			throw err;
		}
		else 
		{
			if(results.code == "200"){
				
				console.dir(results.result);
				res.send(200);

				}
			else{
				console.log("ERROR");
			}
		}
	});
};

exports.getmessagenum_ng= function (req,res) {
	res.send(req.session.message_num);
};


exports.host_delete_profile= function(req,res){
winston.log('info',req.session.fname+' is the user.',new Date(), 'Host has clicked on Delete profile button');
	console.log("in delete profile");
	var op= "deleteprofile";
	var msg_payload = { "operation": op,"hostid": req.session.hostid};
	mq_client.make_request('host_queue',msg_payload, function(err,results){
		if(err){
			throw err;
		}
		else 
		{
			if(results.code == "200"){
				console.log("Inside else host delete");
				req.session.destroy();
				res.redirect('/');

				}
			else{
				console.log("ERROR");
			}
		}
	});

};

exports.host_transaction_history= function (req,res) {
	winston.log('info',req.session.fname+' is the user.',new Date(), 'Host has clicked on transaction history button');
	console.log("inside transaction history");
	var op= "history";
	var msg_payload = { "operation": op,"hostid": req.session.hostid };
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
				res.render('host_transaction_history',{rec:results.result});

				}
			else{
				console.log("ERROR");
			}
		}
	});
};

exports.gethostdash_ng= function (req,res) {
	winston.log('info',req.session.fname+' is the user.',new Date(), 'Host has clicked on Dashboard button');
	console.log("in dash client");
	var op= "gethostdash";
	var msg_payload = { "operation": op,"hostid": req.session.hostid };
	mq_client.make_request('host_queue',msg_payload, function(err,results){
		if(err){
			throw err;
		}
		else 
		{
			if(results.code === "200"){
				console.log('wapis aa gya');
				console.log('result=');
				console.dir(results);
				var properties= results.property_result;
				var bids= results.bid_results;
				var citycount= results.citycount_result;
				var areacount=results.areacount_result;
				//console.log("Results:"+results.result[0].bill_date);
				//results.result[0].total=+results.result[0].total + +300;
				res.render('host_dashboard',{properties: properties, bids: bids,citycount:citycount,areacount:areacount});

				}
			else{
				console.log("ERROR");
			}
		}
	});
};

exports.gethosttrip_ng=function (req,res) {
	winston.log('info',req.session.fname+' is the user.',new Date(), 'Host has clicked on Trip button');
    console.log("inside get host message");
    //var op= "getusermessage";
    console.log(req.session.hostid);

    var op= "gethosttrip";
	var msg_payload = { "operation": op,"hostid": req.session.hostid };
    mq_client.make_request('host_queue',msg_payload, function(err,results){
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

exports.gethostfuturetrip_ng=function (req,res) {
	winston.log('info',req.session.fname+' is the user.',new Date(), 'Host has clicked on Upcoming trip button');
    console.log("inside get trip message");
    //var op= "getusermessage";
    //console.log(req.session.hostid);
    var op= "gethostfuturetrips";
	var msg_payload = { "operation": op,"hostid": req.session.hostid };
    mq_client.make_request('host_queue',msg_payload, function(err,results){
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

exports.saveguestRating_ng = function(req, res){
	winston.log('info',req.session.fname+' is the user.',new Date(), 'Host has clicked on Review button');
    var hostFeedback = req.param("hostFeedback");
    var propertyFeedback = req.param("propertyFeedback");
    var cleanliness = req.param("cleanliness");
    var communication = req.param("communication");
    var houserules = req.param("houserules");
    var recommend = req.param("recommend");
    var user_id= req.param('user_id');
    var trip_id= req.param('trip_id');


    var op= "saveguestrating";
    var msg_payload = {"operation": op,"hostid": req.session.hostid, "hostFeedback": hostFeedback,"propertyFeedback":propertyFeedback,"cleanliness": cleanliness,"communication": communication,"houserules":houserules,"recommend":recommend,"user_id":user_id,"trip_id":trip_id,"host_name":req.session.fname};
console.log("sending");
    mq_client.make_request('host_queue', msg_payload, function (err, results) {
        console.log("getting back");
        console.log(results);
        if (err) {
            throw err;
        }
        else {
            if (results.code == 200) {
                console.log("back in save property ratings success")
                console.log(results.code);
                // req.session.ratingID_ab = results.propRatingID;
                res.send({"statuscode":200});

            }
            else if (results.code == 201) {

                console.log("back in save property ratings failure")
                res.send({"statuscode":201});
            }
        }
    });
};

exports.gethostreviewsforyou_ng= function (req,res) {
	winston.log('info',req.session.fname+' is the user.',new Date(), 'Host has clicked on Review for you button');
	console.log("in get reviews for host");
	var op= "gethostreviewsforyou";
	  var msg_payload = {"operation": op,"hostid": req.session.hostid};
console.log("sending");
    mq_client.make_request('host_queue', msg_payload, function (err, results) {
        console.log("getting back");
        console.log(results);
        if (err) {
            throw err;
        }
        else {
            if (results.code == 200) {
                console.log("back in get host review success")
                console.log(results);
                // req.session.ratingID_ab = results.propRatingID;
                res.send(results.records);

            }
            else if (results.code == 201) {

                console.log("back in save property ratings failure")
                res.send({"statuscode":201});
            }
        }
    });
};

exports.gethostreviewsbyyou_ng= function (req,res) {
	winston.log('info',req.session.fname+' is the user.',new Date(), 'Host has clicked on Review by you button');
	console.log("in get reviews by host");
	var op= "gethostreviewsbyyou";
	  var msg_payload = {"operation": op,"hostid": req.session.hostid};
console.log("sending");
    mq_client.make_request('host_queue', msg_payload, function (err, results) {
        console.log("getting back");
        console.log(results);
        if (err) {
            throw err;
        }
        else {
            if (results.code == 200) {
                console.log("back in get reviews by host")
                console.log(results.records);
                // req.session.ratingID_ab = results.propRatingID;
                res.send(results.records);

            }
            else if (results.code == 201) {

                console.log("back in save property ratings failure")
                res.send({"statuscode":201});
            }
        }
    });
};
