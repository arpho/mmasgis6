var mongoose = require('mongoose');
var Schema = require('../schemas/relpvpar');
var Rel_pv_par = mongoose.model('Rel_pv_par', Schema);

module.exports = Rel_pv_par;
