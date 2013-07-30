var solver = require('./selectionSolver')
var async=require('async')
var und = require("underscore");
var User = require('../../models/user');
var clienti_utb = require('../../models/clienti_utb');
var user_utbs = require('../../models/users_utb');
var pvListObj = require('./obj_pvList');
var utb_utente = {}
var istat_cliente = null
var istat_utente = null
var istat_selezione = null
var istat = null
var tc_istat = require('./tc_istat_id');
var und = require("underscore");
var includes = require('./includes')

function obj2 (req){
	this.req = req}
	
obj2.prototype.pvRetriever = function pvRetriever(req,data,next){
	/*si occupa di eseguire lo switching del db invocare getPv
	 * e riportare tutto su mmasgis
	 * @method {pvRetriever}
	 * @param {Object}express request
	 * @param {Object} {intersection:[int],selection[int]}
	 * @return {Object} [Pv]
	 * 
	 * */
	 var switchDb = obj.prototype.switchDb;
	 var getPv = obj.prototype.getPv;
	console.time('pvRetriever')
	 async.series([
			function(callback){switchDb(req.censimento);callback()},
			function(callback){getPv(req,data,callback)},
			function(callback){switchDb('mmasgis');callback()}
	 ], function(err,results){
		console.timeEnd('pvRetriever')
		next(err,results)
		 })
}

obj2.prototype = new pvListObj.PvLObj()
exports.obj2 = obj2
