var mongoose = require('mongoose');
var rel_pv_potSchema = new mongoose.Schema({
"ins_utente": String,
"ins_data":{ type: Date, default: Date.now },
"pv_id": Number,
"mod_utente": String,
"mod_data": { type: Date, default: Date.now },
"valore": Number,//24.63,
"tc_pot_id":Number,// 102,
"tc_clpot_id":Number// 10
},{collection:'rel_pv_pot'})
module.exports = rel_pv_potSchema
