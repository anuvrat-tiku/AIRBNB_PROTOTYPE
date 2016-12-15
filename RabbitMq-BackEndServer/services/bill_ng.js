var mysql= require('./mysql');
var mongodb= require('./mongodb_ng');

exports.billgen_ng= function (msg,callback){
	console.log("in bill gen server");
	var response={};
	var query= "SELECT * FROM bill WHERE bill_id='"+msg.bill_id+"';";
	mysql.pushData(function (err,result) {
		if(err){
			throw err;
		}
		else{
		
				response.result=result;
				response.code="200";
				response.status="bill generated";
				callback(null,response);
		
		}
	},query);
};