var mongoose = require('mongoose');
var RegionSchema = new mongoose.Schema({
	"nome":String,
	"tc_regione_id":Number,
	"id" : Number,
	"codice" :Number
},{collection:'regioni'})
module.exports = RegionSchema;
