var mongoose = require('mongoose');
var ProvinciaSchema = require('../schemas/provincia');
var Provincia = mongoose.model('provincia', ProvinciaSchema);
module.exports = Provincia;
