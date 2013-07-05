var mongoose = require('mongoose');
var User = require('./models/user');
var CheckLogin = require('./routes/middleware/user')

exports.login = CheckLogin
