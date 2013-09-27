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
var filter = require('./Filter').FullFilter
var key = require('./KeyMaker').KeyMaker
var cache = require('memory-cache');
var tc_istat = require('./tc_istat_id');
var PvList = require('./obj_pvList_estesa')
var filter = require('./Filter').FullFilter,
mongoose = require('mongoose')
var intersect = require('./array_intersect.min').array_intersect;
var includes = require('./includes')
var ObjectId = mongoose.Types.ObjectId
var Debug = require('../../public/javascripts/constants').Debug
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
	var n = selection.length
	for(var i=0;i<n;i++){
		if(selection[i]['utb']['classe']=='cap'){cap.push(selection[i]['utb']['id'])}
		}
	  //creo una funzioneda usare in async.parallel per maggiore leggibilità, after sarà la funzione di callback passata da async.parallel
	 var a = function(after){
		 //cerco i pv originali, non modificati dall'utente
		 solver.getPv({$or:[{tc_istat_id:{$in:data.intersection},owner:{$exists:false},_id:{$in:data.filter}},{cap:{$in:cap},owner:{$exists:false},_id:{$in:data.filter}}]},req.censimento,function(err,out){
			 after(err,out)
			}
		)}
		var b = function(after){
			solver.getPv({$or:[{tc_istat_id:{$in:data.selection},owner:req.session.user._id.toString(),_id:{$in:data.filter}},{cap:{$in:cap},owner:req.session.user._id.toString(),_id:{$in:data.filter}}]},
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
		//Debug(out)
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
function getIstat(self,req,utb_cliente,utb_utente,utb_selection,next){
	//Debug(self.db)
	Filter = new filter(req,self.db)
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
						Debug('utb_selection error')
					}
					istat_selezione = out
					callback(err,out)
					})//eof getIstat4selection
					
					},//eof 3° funzione //
				function(callback){
					Filter.runFilter(Filter,req,function(e,o){Debug('callback getIstat filter');Debug(o.length);callback(e,o);})
				}
	],function(err,results){
		if (err){next(err,null)}
		var out = intersect(results[0],results[1],results[2]) //calcolo l'intersezione dei codici istat
		var istat = {}
		istat.intersection = out
		istat.selection = results[2]
		console.time('map')
		istat.filter = results[3].map(function(v){ return ObjectId(v)})
		debug('istat in selezione ')
		Debug(istat.filter.length)
		console.timeEnd('map')
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
	this.name = 'PvFiltered'
	this.req = req

	}
	
/**
 * ritorna la lista dei Pv, controlla in cache se c'è il dato ritorna 
	 il valore salvato  altrimenti lancia getUtb2 con una next modificata per pvREtriever
	 * @method {pcFetcher}
	 * @param {req}
	 * @param {Function} funzione di callback function(err,out)*/
function pvFetcher(self,req,next){// 
	Debug('pvfetcher in '+self.name)
	 //preparo la chiave  per la cache
	 var par = {}
	 par.user = req.session.user 
	par.filter = req.filter//{parametri:[{class_id:1,id:1}]}
	par.censimento = req.censimento
	par.selection = req.selection
	 var Key = new key(par)
	 if( cache.get(Key.getKey())==null){
		 Debug('no cache for '+Key.getKey())
		 var  selezione = req.selection 
		 var getIstat = self.getIstat;
		 var pvretriever = self.PvRetriever
		 self.getUtb2(req,function(req,utb_u,utb_c,selezione){
			//console.time('getIstat')
			self.getIstat(self,req,utb_u,utb_c,selezione,function(a,b,c){
				//console.timeEnd('getIstat')
				pvretriever(self,a,b,next,Key)
				 })
		})
	}
	else{
		Debug('cache found for: '+Key.getKey())
		var d = cache.get(Key.getKey())
		var out = {}
		out.data = d.data.slice(req.start,req.start+req.limit)
		out.count = d.count
		var results = [null,out] // uniforme al risultato di pvRetriever
		next(null,results)
	}
	 
}

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
function pvRetriever(self,req,data,next,K){
	 var switchDb = self.switchDb;
	 var getPv = self.getPv;
	console.time('pvRetriever')
	 async.series([
			function(callback){/*switchDb(req.censimento);*/callback()},
			function(callback){getPv(req,data,callback,K)},
			function(callback){/*switchDb('mmasgis');*/callback()}
	 ], function(err,results){
		console.timeEnd('pvRetriever')
		next(err,results)
		 })
 }


//pv.prototype.PvFetcher = new PvList.obj2(null).pvFetcher
PvFiltered.prototype = new PvList.obj2(null)
PvFiltered.prototype.PvRetriever = pvRetriever
PvFiltered.prototype.pvFetcher = pvFetcher
PvFiltered.prototype.getIstat = getIstat
PvFiltered.prototype.getPv = getPv
exports.PvFiltered = PvFiltered
