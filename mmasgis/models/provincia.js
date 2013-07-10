var mongoose = require('mongoose');
var ProvinciaSchema = require('../schemas/provincia');
var Provincia = mongoose.model('Provincia', ProvinciaSchema);
module.exports = Provincia;
