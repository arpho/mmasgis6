var test = require('tap').test;
//var pvList = require('../routes/middleware/PvRetriever');
var mongoose = require('mongoose')
mongoose.connect('localhost','saloni');
//var clienti_utb = require('../models/clienti_utb');
//var users_utb = require('../models/users_utb');
var ObjectId = mongoose.Types.ObjectId
//var Pv = require('../models/pv')
var rel_pv_parSchema = require('../../schemas/rel_pv_par');
var tc_clparSchema = require('../../schemas/tc_clpar');
var tc_parSchema = require('../../schemas/tc_par');

function Parametri(req){
	this.census = req.body.censimento
	this._id = ObjectId(req.body.id)
	var conn = mongoose.createConnection('mongodb://localhost/'+this.census);
	this.rel_pv_par = conn.model('rel_pv_par', rel_pv_parSchema);
	this.tc_clpar = conn.model('tc_clpar',tc_clparSchema)
	}
	
	Parametri.prototype.getPv = function(next){
							var PV = this.pv
							this.pv.findOne({_id:this._id},function(err,pv){
								var opts = [{ path: 'pv', match: { tc_clpot_id: 10 }, select: 'valore' }]
								PV.populate(pv, opts, function (err, pv) {
    next(err,pv);
  })
								})
						}

exports.Parametri = Parametri
