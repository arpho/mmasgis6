var mongoose = require('mongoose');
var client_utbSchema = new mongoose.Schema({
	"cliente_id":String,
	"censimento_id":String,
	"utb":{'classe':String,'id':Number}
},{collection:'clienti_utb'})
module.exports = client_utbSchema;
