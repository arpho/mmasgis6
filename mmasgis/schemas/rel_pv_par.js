var mongoose = require('mongoose');
var rel_pv_parSchema = new mongoose.Schema({
	"ins_utente": String,
	"ins_data":{ type: Date, default: Date.now },
	"pv_id": Number,
	"mod_utente": String,
	"mod_data": { type: Date, default: Date.now },
	//"valore": Number,//24.63,
	"class_id":{ type: mongoose.Schema.Types.ObjectId, ref: 'tc_par' },// 102,
	"parameter_id":{ type: mongoose.Schema.Types.ObjectId, ref: 'tc_clpar' },// 10
	"tc_clpar_id" : Number,
	"tc_par_id" : Number
},{collection:'rel_pv_par'})
module.exports = rel_pv_parSchema
