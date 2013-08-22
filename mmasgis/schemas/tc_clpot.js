var mongoose = require('mongoose');
var Schema = new mongoose.Schema({
	"ins_utente": Number,
	"ins_data": { type: Date, default: Date.now },
	"tc_clpot_id": Number,
	"mod_utente": String,
	"mod_data": { type: Date, default: Date.now },
	"testo": String,
	"ordine": Number,
	"tc_stato_id": Boolean
},{collection:'tc_clpot'})
module.exports = Schema
