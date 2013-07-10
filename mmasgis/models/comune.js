var mongoose = require('mongoose');
var ComuneSchema = require('../schemas/comune');
var Comune = mongoose.model('Comune', ComuneSchema);

module.exports = Comune;
