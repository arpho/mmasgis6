var mongoose = require('mongoose');
var Schema = new mongoose.Schema({
        ins_utente: String,
        mod_utente: String,
        pv_id: Number,
        mod_data: { type: Date, default: Date.now },
    },{collection:'rel_pv_par'});
    
module.exports =Schema
