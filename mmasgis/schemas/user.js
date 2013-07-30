var mongoose = require('mongoose');
var UserSchema = new mongoose.Schema({
         "nome":String,
         "password": String,
        "cliente_id":  String,
        "funzionalità":[Number], //sottoinsieme delle funzionalità del cliente
        "utb":[{classe:String, utb_id:Number}], //sottoinsieme delle utb del cliente
        "logged": Boolean,
        "enabled": Boolean,
        "censimenti_id": [String],
        "bosses" : [String],
        "last_login": { type: Date, default: Date.now }
})
module.exports = UserSchema;
