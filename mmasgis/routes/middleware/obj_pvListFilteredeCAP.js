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
var key = require('./KeyMaker').KeyMaker
var cache = require('memory-cache');
var tc_istat = require('./tc_istat_id');
var oldPvList = require('./obj_pvListCap').PvLObj
var filter = require('./Filter').FullFilter

/**recupera le due liste  di pv dal database  e le passa a next
	 * @method getPv
	 * @param Object richiesta di express*
	 * @param {Function} callback generata da opt_series
	 * @param KeyMaker identifica la richiesta in cache
	 * @return {Object} :: [pv]
	 * */
function getPv(req,data,next,K){
	var selection = req.selection
	//cerco i cap 
	cap = []
	console.log('filter')
	console.log(req.filter)
	var n = selection.length
	for(var i=0;i<n;i++){
		if(selection[i]['utb']['classe']=='cap'){cap.push(selection[i]['utb']['id'])}
		}
	
	  //creo una funzioneda usare in async.parallel per maggiore leggibilità, after sarà la funzione di callback passata da async.parallel
	 var a = function(after){
		 //cerco i pv originali, non modificati dall'utente
		 solver.getPv({$or:[{tc_istat_id:{$in:data.intersection,owner:{$exists:false}}},{cap:{$in:cap},owner:{$exists:false}}]},req.censimento,function(err,out){
			 after(err,out)
			}
		)}
		var b = function(after){
			solver.getPv({$or:[{tc_istat_id:{$in:data.selection},owner:req.session.user._id.toString()},{cap:{$in:cap},owner:req.session.user._id.toString()}]},
		req.censimento,function(err,out){after(err,out)})
			}
	 async.parallel([//getPv in intersection
		function(callback){a(callback)}, 
		//cerco i pv modificati dagli utenti
		function(callback){b(callback)}
	],function(err,results){
		var out = includes.pvListMerger(results[0],results[1],req.page,req.start)
		var item = {}
		item.data = out.fullData
		item.count = out.count
		cache.put(K.getKey(),item,10*60*1000) // conservo il dato in cache per 10 minuti
		//console.log(out)
		cache
		next(err,out)
	} //eof optional
) // eof parallel
} // eof getPv

/** ricava i codici istat per cliente, utente e selezione e ne calcola l'intersezione
	 * @method {getIstat}
	 * recupera i codici istat relativi alle utb di utente, cliente e selezione
	 * @param {utb_cliente}:[{classe:String<regione,provincia,comune,Pv>
	 * @param {utb_utente}:{classe:String<regione,provincia,comune,Pv>
	 * @param {utb_selection}:{classe:String<regione,provincia,comune,Pv>*/
function getIstat(req,utb_cliente,utb_utente,utb_selection,next){
	
	async.parallel([
				function(callback){
					tc_istat.getIstat4Selection(utb_cliente,function(err,out){
						if (err){callback(err)}
						istat_cliente = out
						callback(null,out)
						})//eof getIstat4Selection
				},//eof 1° funzione parallela
				function(callback){
					 tc_istat.getIstat4Selection(utb_utente,function(err,out){
						 if (err){callback(err)}
						 istat_utente = out
						 callback(err,out)
						 }) //eof getIstat4Selection
				}, // eof 2° funzione //
				function(callback){
					tc_istat.getIstat4Selection(utb_selection,function(err,out){
					if (err) {
						callback(err)
						console.log('utb_selection error')
					}
					istat_selezione = out
					callback(err,out)
					})//eof getIstat4selection
					
					}//eof 3° funzione //
	],function(err,results){
		if (err){next(err,null)}
		var out = intersect(results[0],results[1],results[2]) //calcolo l'intersezione dei codici istat
		var istat = {}
		istat.intersection = out
		istat.selection = results[2]
		next(req,istat,next) //chiama pvRetriever
		}//eof optional function in parallel
		)//eof parallel
}

/** ricava i codici istat per cliente, utente e selezione e ne calcola l'intersezione
	 * @method {getIstat}
	 * recupera i codici istat relativi alle utb di utente, cliente e selezione
	 * @param {utb_cliente}:[{classe:String<regione,provincia,comune,Pv>
	 * @param {utb_utente}:{classe:String<regione,provincia,comune,Pv>
	 * @param {utb_selection}:{classe:String<regione,provincia,comune,Pv>*/
function getIstat(req,utb_cliente,utb_utente,utb_selection,next){
	
	async.parallel([
				function(callback){
					tc_istat.getIstat4Selection(utb_cliente,function(err,out){
						if (err){callback(err)}
						istat_cliente = out
						callback(null,out)
						})//eof getIstat4Selection
				},//eof 1° funzione parallela
				function(callback){
					 tc_istat.getIstat4Selection(utb_utente,function(err,out){
						 if (err){callback(err)}
						 istat_utente = out
						 callback(err,out)
						 }) //eof getIstat4Selection
				}, // eof 2° funzione //
				function(callback){
					tc_istat.getIstat4Selection(utb_selection,function(err,out){
					if (err) {
						callback(err)
						console.log('utb_selection error')
					}
					istat_selezione = out
					callback(err,out)
					})//eof getIstat4selection
					
					}//eof 3° funzione //
	],function(err,results){
		if (err){next(err,null)}
		var out = intersect(results[0],results[1],results[2]) //calcolo l'intersezione dei codici istat
		var istat = {}
		istat.intersection = out
		istat.selection = results[2]
		next(req,istat,next) //chiama pvRetriever
		}//eof optional function in parallel
		)//eof parallel
}


/**
	 * questa classe raccoglie tutte le funzionalità necessarie per
	 * ottenere la lista di Pv, data la  richiesta di express,
	 * @class {PvObj}
	 * @param express.request
	 * @param mongodb-node-native.connection*/
function PvFiltered(req,db){
	this.db = db
	this.req = req
	PvFiltered.prototype = new oldPvList(req)
	}

PvFiltered.prototype.initialize = function(req){
	this.req = req
}
PvFiltered.prototype.getPv = getPv
PvFiltered.prototype.getIstat = getIstat
