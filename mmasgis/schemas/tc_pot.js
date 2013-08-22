var mongoose = require('mongoose');
var tc_parSchema = new mongoose.Schema({
	"ins_utente": String,
	"ins_data": { type: Date, default: Date.now },
	"tc_clpot_id": Number,
	"tc_pot_id" : Number,
	"mod_utente": String,
	"mod_data": { type: Date, default: Date.now },
	"testo": String,
	"ordine": Number,
	"tc_stato_id":  Boolean
},{collection:'tc_pot'})
module.exports = tc_parSchema
