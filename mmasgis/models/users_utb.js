var mongoose = require('mongoose');
var User_utbSchema = require('../schemas/users_utb');
var users_utb = mongoose.model('user_utb', User_utbSchema);

module.exports = users_utb;
