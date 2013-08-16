var mongoose = require('mongoose');
var tcparSchema = require('../schemas/tc_par');
var tc_par = mongoose.model('tc_par', tcparSchema);

module.exports = tc_par;
