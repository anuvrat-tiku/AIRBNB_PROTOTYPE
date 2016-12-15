var mq_client = require('../rpc/client');
var passport= require('passport');
var LocalStrategy= require('passport-local');
var bCrypt= require('bcrypt');

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
	var msg_payload = { "operation": op, "email": username, "password": password,"fname": req.param("first"), "lname":req.param("last")};
	mq_client.make_request('host_queue',msg_payload, function(err,results){
		console.log("WAPAS AGAYA");
		console.log(results);
		if(err){
			throw err;
		}
		else 
		{
			console.log("code"+results.code);
			if(results.code == 200){
				console.log("valid signup");
				console.log("host id"+results.hostid);
				console.log("fname="+results.fname);
				req.session.email = results.email;
				req.session.hostid= results.hostid;
				req.session.fname= results.fname;
				req.session.propinfo={};
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
				req.session.propinfo={};
				return done(null, results);
			}
			else {
				console.log("Invalid Login");ejs.renderFile('./views/loginfail.ejs',function(err, result) {
			        if (!err) {
				return done(null, false, req.flash('message','User Already Exists'));
			           
			        }
			        else {
				return done(null, false, req.flash('message','User Already Exists'));
			            console.log(err);
			        }
				});
			}
		}  
	});

    };

    process.nextTick(findOrCreateUser);

  }));

exports.hoststart1_ng=function (req,res) {
	req.session.propinfo.place= req.param('place');
	req.session.propinfo.address=req.param('address');
	req.session.propinfo.guestnum=req.param('guestnum');
	res.redirect('/step1');
};

exports.hoststep1_ng=function (req,res) {
	req.session.propinfo.guest_place= req.param('guest_place');
	req.session.propinfo.type=req.param('type');
	res.redirect('/step1_bedroom');
};

exports.hoststep1_bedroom_ng=function (req,res) {
	req.session.propinfo.bed= req.param('bed');
	req.session.propinfo.guest=req.param('guest');
	res.redirect('/step1_bathroom');
};

exports.hoststep1_bathroom_ng=function (req,res) {
	req.session.propinfo.bathroom= req.param('bathroom');
	res.redirect('/step1_location');
};

exports.hoststep1_location_ng=function (req,res) {
	req.session.propinfo.country= req.param('country');
	req.session.propinfo.city=req.param('city');
	req.session.propinfo.state=req.param('state');
	req.session.propinfo.street=req.param('street');
	req.session.propinfo.apt=req.param('apt');
	req.session.propinfo.zip=req.param('zip');
	res.redirect('/step1_amenities');
};

exports.hoststep1_amenities_ng=function (req,res) {
	req.session.propinfo.amenities= req.param('amenities');
	res.redirect('/step1_spaces');
};

exports.hoststep1_spaces_ng=function (req,res) {
	req.session.propinfo.spaces= req.param('spaces');
	res.redirect('/step2');
};

exports.hoststep2_editdescription_ng=function (req,res) {
	req.session.propinfo.description= req.param('edit');
	res.redirect('/step2_nameplace');
};

exports.hoststep2_nameplace_ng=function (req,res) {
	req.session.propinfo.placename= req.param('name');
	res.redirect('/step2_description');
};

exports.hoststep2_description_ng=function (req,res) {
	req.session.propinfo.nearbyloc= req.param('close');
	req.session.propinfo.love= req.param('love');
	req.session.propinfo.extrafeatures= req.param('amenities');
	res.redirect('/step2_mobile');
};

exports.hoststep2_mobile_ng=function (req,res) {
	req.session.propinfo.phone= req.param('phone');
	res.redirect('/step3');
};

exports.hoststep3_rules_ng=function (req,res) {
	req.session.propinfo.children= req.param('children');
	req.session.propinfo.infants= req.param('infants');
	req.session.propinfo.smoking= req.param('smoking');
	req.session.propinfo.events= req.param('events');
	req.session.propinfo.pets= req.param('pets');
	res.redirect('/step3_ready');
};

exports.hoststep3_advance_ng=function (req,res) {
	req.session.propinfo.advance= req.param('advance');
	res.redirect('/step3_long');
};

exports.hoststep3_ready_ng=function (req,res) {
	req.session.propinfo.notice= req.param('notice');
	req.session.propinfo.from= req.param('from');
	req.session.propinfo.to= req.param('to');
	res.redirect('/step3_advance');
};

exports.hoststep3_long_ng=function (req,res) {
	req.session.propinfo.min= req.param('min');
	req.session.propinfo.max= req.param('max');
	res.redirect('/step3_price');
};

exports.hoststep3_price_ng=function (req,res) {
	var val= req.param('val');
	if(val==="bid"){
		res.redirect('/step3_bid');
	}
	else if(val==="fixed"){
		res.redirect('/step3_baseprice');
	}
};

exports.hoststep3_baseprice_ng=function (req,res) {
	req.session.propinfo.currency= req.param('currency');
	req.session.propinfo.price= req.param('price');
	res.redirect('/allsteps');
};

exports.hoststep3_bid_ng=function (req,res) {
	req.session.propinfo.currency= req.param('currency');
	req.session.propinfo.price= req.param('price');
	req.session.propinfo.bid= req.param('bid');
	res.redirect('/allsteps');
};


exports.allsteps_ng=function(req,res) {
	
	
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
	
	var op="property_details";
	var msg_payload = { "operation": op,"place":place,"address":address,"bid":bid,"guestnum":guestnum,"guest_place":guest_place,"type":type,"guest":guest,"bed":bed,"bathroom":bathroom,"country":country,"city":city,"state":state,"apt":apt,"zip":zip,"amenities":amenities,"spaces":spaces,"description":description,"placename":placename,"nearbyloc":nearbyloc,"love":love,"extrafeatures":extrafeatures,"phone":phone,"children":children,"infants":infants,"smoking":smoking,"events":events,"pets":pets,"advance":advance,"notice":notice,"from":from,"to":to,"min":min,"max":max,"currency":currency,"price":price,"hostid":req.session.hostid,"street":street};
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
				
				console.dir(results.result);
				res.send(results.result);

				}
			else{
				console.log("ERROR");
			}
		}
	});
};

exports.propertydelete_ng= function (req,res) {
	
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

exports.loadprofile_ng= function(req,res){

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
	
	console.log("in upload image");
	var op= "uploadhostprofileimg";
	console.log(req.session.hostid);
	var msg_payload = { "operation": op,"img":req.param("img"),"hostid": req.session.hostid };
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