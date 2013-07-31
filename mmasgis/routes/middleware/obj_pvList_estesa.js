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


obj2.prototype.pvFetcher = function pvFetcher(req,next){
	/*ritorna la lista dei Pv
	 * @method {pcFetcher}
	 * @param {req}
	 * @param {Function} funzione di callback function(err,out)*/
	 //series0
	 selezione = req.selection
	 console.log(selezione)
	 console.log('pvFetcher')
	 var getIstat = PvLObj.prototype.getIstat;
	 var pvretriever = this.pvRetriever
	 this.getUtb2(req,function(req,utb_u,utb_c,selezione){
		console.log('dummy func in getUtb')
		//console.time('getIstat')
		getIstat(req,utb_u,utb_c,selezione,function(a,b,c){
			console.log('next fn di gatIstat')
			console.log('b.intersection.length ricevuto')
			console.log(b.intersection.length)
			console.log('ora chiamo getPv')
			//console.timeEnd('getIstat')
			pvRetriever(a,b,next)
			 })
	})
	 
}
obj2.prototype = new pvListObj.PvLObj()
exports.obj2 = obj2
