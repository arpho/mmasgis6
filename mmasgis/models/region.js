var mongoose = require('mongoose');
var RegionSchema = require('../schemas/region');
var Region = mongoose.model('regioni', RegionSchema);

module.exports = Region;
