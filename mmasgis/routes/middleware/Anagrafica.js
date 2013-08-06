var test = require('tap').test;
//var pvList = require('../routes/middleware/PvRetriever');
var mongoose = require('mongoose')
mongoose.connect('localhost','saloni');
//var clienti_utb = require('../models/clienti_utb');
//var users_utb = require('../models/users_utb');
var ObjectId = mongoose.Types.ObjectId
//var Pv = require('../models/pv')
var PvSchema = require('../../schemas/pv');

function Anagrafica(req){
	this.census = req.body.censimento
	this._id = ObjectId(req.body.id)
	var conn = mongoose.createConnection('mongodb://localhost/'+this.census);
	this.pv = conn.model('Pv', PvSchema);
	}
	Anagrafica.prototype.getPv = function(next){
		this.pv.findOne({_id:this._id},function(err,out){
		next(err,out)
		})
		}

exports.Anagrafica = Anagrafica
