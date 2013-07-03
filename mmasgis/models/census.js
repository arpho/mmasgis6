
var mongoose = require('mongoose');
var CensusSchema = require('../schemas/census');
var Census = mongoose.model('censimenti', CensusSchema);

module.exports = Census;
