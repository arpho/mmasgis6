var test = require('tap').test;
//var pvList = require('../routes/middleware/PvRetriever');
var mongoose = require('mongoose')
mongoose.connect('localhost','saloni');
//var clienti_utb = require('../models/clienti_utb');
//var users_utb = require('../models/users_utb');
var ObjectId = mongoose.Types.ObjectId
//var Pv = require('../models/pv')
var PvSchema = require('../../schemas/pv');
var rpvpot = require('../../schemas/rel_pv_pot');

function Anagrafica(req){
	this.census = req.body.censimento
	this._id = ObjectId(req.body.id)
	var conn = mongoose.createConnection('mongodb://localhost/'+this.census);
	this.pv = conn.model('Pv', PvSchema);
	this.rel_pv_pot = conn.model('rel_pv_pot',rpvpot)
	}
	
	Anagrafica.prototype.getPv = function(next){
							var PV = this.pv
							this.pv.findOne({_id:this._id},function(err,pv){
								var opts = [{ path: 'pv', match: { tc_clpot_id: 10 }, select: 'valore' }]
								PV.populate(pv, opts, function (err, pv) {
    next(err,pv);
  })
								})
						}

exports.Anagrafica = Anagrafica
