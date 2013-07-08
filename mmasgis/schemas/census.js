var mongoose = require('mongoose');
var CensusSchema = new mongoose.Schema({
         "censimento":String,
         "label":String,
        "date": Date
},{collection:'censimenti'})
module.exports = CensusSchema;
