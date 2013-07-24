var mongoose = require('mongoose');
var Clienti_utbSchema = require('../schemas/clienti_utb');
var clienti_utb = mongoose.model('customer_utb', Clienti_utbSchema);

module.exports = clienti_utb;
