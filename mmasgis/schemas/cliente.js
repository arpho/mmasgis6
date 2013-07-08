var mongoose = require('mongoose');
var CustomerSchema = new mongoose.Schema({
         "nome":String,
        "funzionalità":[Number], //sottoinsieme delle funzionalità del cliente
        "censimenti_id": [String],
},{collection:'clienti'})
module.exports = CustomerSchema;
