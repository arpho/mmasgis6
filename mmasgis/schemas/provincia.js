var mongoose = require('mongoose');
var ProvinciaSchema = new mongoose.Schema({
	"nome":String,
	"tc_provincia_id":Number,
	"id" : Number,
	"codice_regione" : Number,
	"codice" : Number,
	"sigla" : Number
},{collection:'province'})
module.exports = ProvinciaSchema;
