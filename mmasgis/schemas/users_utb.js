var mongoose = require('mongoose');
var user_utbSchema = new mongoose.Schema({
	"userd_id":String,
	"censimento_id": String,
	"utb":{'classe':String,'id':Number}
},{collection:'users_utb'})
module.exports = user_utbSchema;
