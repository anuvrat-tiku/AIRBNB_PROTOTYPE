var mq_client = require('../rpc/client');
var fs = require('fs');
var winston=require('winston');

exports.billgen_ng= function (req,res) {
	 winston.log('info','bill.',new Date(), 'Bill is generated.');
	console.log("in bill gen="+req.param('bill_id'));
	var op= "bill_gen";
	var msg_payload = { "operation": op,"bill_id": req.param('bill_id') };
	mq_client.make_request('bill_queue',msg_payload, function(err,results){
		if(err){
			throw err;
		}
		else 
		{
			if(results.code == "200"){
				
				console.dir(results.result);
				var full_total= parseInt(results.result[0].total)+300;
				var fullandfinal_total= full_total+1000;
				res.render('bill',{bill_id: req.param('bill_id'), user_fname: results.result[0].user_fname, city: results.result[0].city, state: results.result[0].state, zip: results.result[0].zip, country: results.result[0].country, prop_type: results.result[0].prop_type, accom_type: results.result[0].accom_type, no_guest: results.result[0].no_guest, from_date: results.result[0].from_date, to_date: results.result[0].to_date, duration: results.result[0].duration, price: results.result[0].price, full_total: full_total, bill_date: results.result[0].bill_date, fullandfinal_total:fullandfinal_total, apt: results.result[0].apartment, street: results.result[0].street, total: results.result[0].total});

				}
			else{
				console.log("ERROR");
			}
		}
	});

};