var mongoose = require('mongoose');
var tc_clParSchema = require('../schemas/tc_clpar');
var tc_clPar = mongoose.model('tc_clPar', tc_clParSchema);

module.exports = tc_clPar;
