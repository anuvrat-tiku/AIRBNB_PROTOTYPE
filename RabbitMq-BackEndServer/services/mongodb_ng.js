var mongoose = require('mongoose');
mongoose.set('debug', true);
var Schema = mongoose.Schema;

var host_schema = new Schema({
	hostid: String,
	hostvideo: String
});
var property_schema = new Schema({
	propertyid: String,
	propertyimg: String
});

var hostModel = mongoose.model("host", host_schema);
var propertyModel = mongoose.model("property", property_schema);


exports.hostModel= hostModel;
exports.propertyModel= propertyModel;