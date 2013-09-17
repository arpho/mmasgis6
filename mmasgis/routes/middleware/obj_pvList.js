var solver = require('./selectionSolver')
var async=require('async')
var und = require("underscore");
var User = require('../../models/user');
var clienti_utb = require('../../models/clienti_utb');
var user_utbs = require('../../models/users_utb');
var utb_utente = {}
var key = require('./KeyMaker').KeyMaker
var cache = require('memory-cache');
var istat_cliente = null
var istat_utente = null
var istat_selezione = null
var istat = null
var tc_istat = require('./tc_istat_id'),
intersect = require('./array_intersect.min').array_intersect;
var includes = require('./includes')
function switchDb(censimento){
	/*cambia il database a cui si connette mongoose*/
	var mongoose = require('mongoose')
	mongoose.disconnect(function(){var db = mongoose.connect('mongodb://localhost/'+censimento);})
}
/**recupera le due liste  di pv dal database  e le passa a next
	 * @method {getPv}
	 * @param {Object} richiesta di express*
	 * @param {Function} callback generata da opt_series
	 * @param KeyMaker identifica la richiesta in cache
	 * @return {Object} :: [pv]
	 * */
function getPv(req,data,next,K){
	  //creo una funzioneda usare in async.parallel per maggiore leggibilità, after sarà la funzione di callback passata da async.parallel
	 var a = function(after){
		 //cerco i pv originali, non modificati dall'utente
		 console.log('req.censimento in obj_pvList.getPv: '+req.censimento)
		 solver.getPv({tc_istat_id:{$in:data.intersection},owner:{$exists:false}},req.censimento,function(err,out){
			 console.log('pv originali')
			 console.log(out.length)
			 after(err,out)
			}
		)}
		//cerco i pv modificati dagli utenti
	/*var b = function(after){solver.getPv({tc_istat_id:{$in:data.selection},owner:req.session.user._id.toString()},
		req.censimento,function(err,out){
			 console.log('pv modificati')
			 console.log(out.length);after(err,out)})}*/
	 async.parallel([//getPv in intersection
		function(callback){a(callback)}, // eof parallel1
		function(callback){solver.getPv({tc_istat_id:{$in:data.selection},owner:req.session.user._id.toString()},
		req.censimento,function(err,out){callback(err,out)})}
	],function(err,results){
		console.log('start: '+req.start)
		console.log('page: '+req.page)
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
/**si occupa di eseguire lo switching del db invocare getPv
	 * e riportare tutto su mmasgis
	 * @method {pvRetriever}
	 * @param {Object}express request
	 * @param {Object} {intersection:[int],selection[int]}
	 * @param Function funzione di callback
	 * @param KeyMaker  identifica il risultato della richiesta
	 * @return {Object} [Pv]
	 * 
	 * */
function pvRetriever(req,data,next,K){
	
	 var switchDb = PvLObj.prototype.switchDb;
	 var getPv = PvLObj.prototype.getPv;
	//console.time('pvRetriever')
	 async.series([
			function(callback){/*switchDb(req.censimento);*/callback()},
			function(callback){getPv(req,data,callback,K)},
			function(callback){/*switchDb('mmasgis');*/callback()}
	 ], function(err,results){
		//console.timeEnd('pvRetriever')
		next(err,results)
		 })
 }
function getUtb2(req,next){
	async.parallel([
		function(callback){
			var user = req.session.user
			console.log({cliente_id:user.cliente_id,censimento_id:req.censimento_id})
			clienti_utb.find({cliente_id:user.cliente_id,censimento_id:req.censimento_id},function(err,utbs){callback(err,utbs)})
		},//eof prima funzione parallelo clienti_utb fn0_parallel0
		function(callback){
							var user = req.session.user 
							user_utbs.find({user_id:user._id.toString(),censimento_id:req.censimento_id},function(err, utbs){callback(err,utbs)})
						} //eof fn1_parallel0
	],function(err,results){
		console.log('clienti_utb:')
		console.log(results[0].length)
		console.log('users_utb:')
		console.log(results[1].length)
		next(req,results[0],results[1],req.selection) // next deve essere getIstat
			}) // eof opt_parallel0
	
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
						console.log('istat cliente:')
						console.log(out.length)
						istat_cliente = out
						callback(null,out)
						})//eof getIstat4Selection
				},//eof 1° funzione parallela
				function(callback){
					 tc_istat.getIstat4Selection(utb_utente,function(err,out){
						 if (err){callback(err)}
						console.log('istat utente:')
						console.log(out.length)
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
						console.log('istat selezione:')
						console.log(out.length)
					istat_selezione = out
					callback(err,out)
					})//eof getIstat4selection
					
					}//eof 3° funzione //
	],function(err,results){
		if (err){next(err,null)}
		var out = intersect(results[0],results[1],results[2]) //calcolo l'intersezione dei codici istat
		var istat = {}
		istat.intersection = out
						console.log('istat intersect:')
						console.log(out.length)
		istat.selection = results[2]
		next(req,istat,next) //chiama pvRetriever
		}//eof optional function in parallel
		)//eof parallel
}
/**
 * ritorna la lista dei Pv, controlla in cache se c'è il dato ritorna 
	 il valore salvato  altrimenti lancia getUtb con una next modificata per pvREtriever
	 * @method {pcFetcher}
	 * @param {req}
	 * @param {Function} funzione di callback function(err,out)*/
function pvFetcher(req,next){// 
	
	 //preparo la chiave  per la cache
	 var par = {}
	 par.user = req.session.user 
	par.filter ={parametri:[{class_id:1,id:1}]}
	par.censimento = req.censimento
	par.selection = req.selection
	 var Key = new key(par)
	 if( cache.get(Key.getKey())==null){
		 console.log('no cache')
		 var  selezione = req.selection 
		 var getIstat = PvLObj.prototype.getIstat;
		 var pvretriever = this.pvRetriever
		 this.getUtb2(req,function(req,utb_u,utb_c,selezione){
			//console.time('getIstat')
			getIstat(req,utb_u,utb_c,selezione,function(a,b,c){
				//console.timeEnd('getIstat')
				pvRetriever(a,b,next,Key)
				 })
		})
	}
	else{
		console.log('cache found:')
		var d = cache.get(Key.getKey())
		var out = {}
		console.log('start: '+req.start)
		console.log('end: '+(req.start+req.limit))
		out.data = d.data.slice(req.start,req.start+req.limit)
		out.count = d.count
		var results = [null,out] // uniforme al risultato di pvRetriever
		next(null,results)
	}
	 
}
/**
	 * questa classe raccoglie tutte le funzionalità necessarie per
	 * ottenere la lista di Pv data la  richiesta di express
	 * @class {PvObj}*/
function PvLObj(req){
	
	this.req = req
}

PvLObj.prototype.initialize = function(req){
	this.req = req
}

function obj(req){
	this.req =req}
obj.prototype = new PvLObj()
PvLObj.prototype.getIstat = getIstat// se invece di prototype le avessi definite dentro la funzione sarebbe stato più facile cambiarle nella funzione estesa
PvLObj.prototype.pvFetcher = pvFetcher
PvLObj.prototype.getUtb2 = getUtb2
PvLObj.prototype.switchDb = switchDb
PvLObj.prototype.pvRetriever = pvRetriever
PvLObj.prototype.getPv = getPv
exports.pvFetcher = pvFetcher
exports.PvLObj = PvLObj
