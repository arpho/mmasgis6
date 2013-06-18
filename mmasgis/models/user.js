
var mongoose = require('mongoose');
var UserSchema = require('../schemas/user');
var User = mongoose.model('utenti', UserSchema);

module.exports = User;
