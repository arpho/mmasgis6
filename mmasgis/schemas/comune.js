var mongoose = require('mongoose');
var ComuneSchema = new mongoose.Schema({
	"nome":String,
	"tc_comune_id":Number,
	"id" : Number,
	"codice_provincia" : Number,
	"codice" : Number,
},{collection:'comuni'})
module.exports = ComuneSchema;
