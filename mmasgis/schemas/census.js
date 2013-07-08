var mongoose = require('mongoose');
var CensusSchema = new mongoose.Schema({
         "censimento":String,
         "label":Stringtring,
        "date": Date
},{collection:'censimenti'})
module.exports = CensusSchema;
