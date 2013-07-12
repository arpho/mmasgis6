var mongoose = require('mongoose');
var PvSchema = require('../schemas/pv');
var Pv = mongoose.model('Pv', PvSchema);

module.exports = Pv;
