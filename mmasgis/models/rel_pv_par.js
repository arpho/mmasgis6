var mongoose = require('mongoose');
var rppSchema = require('../schemas/rel_pv_par');
var rel_pv_par = mongoose.model('Rel_pv_par', rppSchema);

module.exports = rel_pv_par;
