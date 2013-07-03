var mongoose = require('mongoose');
var CensusSchema = new mongoose.Schema({
         "censimento":String,
        "date": Date
},{collection:'censimenti'})
module.exports = CensusSchema;
