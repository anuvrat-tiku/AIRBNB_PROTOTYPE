var MongoClient = require('mongodb').MongoClient; 
var db; 
var connected = false; 
var mongo = require("./mongo");
var mongoURL = "mongodb://localhost:27017/airbnb";

exports.connect = function(url, callback){    
	MongoClient.connect(url, function(err, _db){       
		if (err) { throw new Error('Could not connect: '+err); }       
		db = _db;       
		connected = true;              
		callback(db);     
		}); 
	}; 
	
	exports.collection = function(name){    
		if (!connected) {       
			throw new Error('Must connect to Mongo before calling "collection"');     
		}     
		return db.collection(name);   
	}

	