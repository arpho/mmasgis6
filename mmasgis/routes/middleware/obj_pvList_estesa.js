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
var und = require("underscore");
var includes = require('./includes')

function obj2 (req){
	this.req = req}


function getPvCap(req,data,next,K){
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
		 var query = {$or:[{tc_istat_id:{$in:data.intersection},owner:{$exists:false}},{cap:{$in:cap},owner:{$exists:false}}]};
		 //db.pv.find({$or:[{tc_istat_id:{$in:[1772]},owner:{$exists:false}},{cap:{$in:['95014']},owner:{$exists:false}}]})
		 solver.getPv(query,req.censimento,function(err,out){
			 if(err){console.dir(err);console.log('errore a')}
			 after(err,out)
			}
		)}
		var b = function(after){
			var query = {$or:[{tc_istat_id:{$in:data.selection},owner:req.session.user._id.toString()},{cap:{$in:cap},owner:req.session.user._id.toString()}]}
			solver.getPv(query,req.censimento,function(err,out){
				if(err){console.dir(err);console.log('errore b')}
				after(err,out)
			})
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
		//cache
		next(err,out)
	} //eof optional
) // eof parallel
} // eof getPv



function getPv(req,data,next,K){
	  //creo una funzioneda usare in async.parallel per maggiore leggibilità, after sarà la funzione di callback passata da async.parallel
	 var a = function(after){
		 //cerco i pv originali, non modificati dall'utente
		 console.log('req.censimento in obj_pvList.getPv: '+req.censimento)
		 solver.getPv({tc_istat_id:{$in:data.intersection},owner:{$exists:false}},req.censimento,function(err,out){
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
		var out = includes.pvListMerger(results[0],results[1],req.page,req.start)
		var item = {}
		item.data = out.fullData
		item.count = out.count
		cache.put(K.getKey(),item,10*60*1000) // conservo il dato in cache per 10 minuti
		//console.log(out)
		//cache
		next(err,out)
	} //eof optional
) // eof parallel
} // eof getPv

function pvFetcher(self,req,next){// 
	
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
		 var getIstat = self.getIstat;
		 self.getUtb2(req,function(req,utb_u,utb_c,selezione){
			//console.time('getIstat')
			getIstat(req,utb_u,utb_c,selezione,function(a,b,c){
				//console.timeEnd('getIstat')
				
				self.pvRetriever(self,a,b,next,Key)
				 })
		})
	}
	else{
		console.log(' pvList_estesa cache found:')
		var d = cache.get(Key.getKey())
		var out = {}
		out.data = d.data.slice(req.start,req.start+req.limit)
		out.count = d.count
		var results = [null,out] // uniforme al risultato di pvRetriever
		next(null,results)
	}
	 
}
obj2.prototype = new pvListObj.PvLObj() // estendo PvLobj
obj2.prototype.getPv = getPvCap// ancora non funziona riportare a getPv in produzione
obj2.prototype.pvFetcher = pvFetcher
exports.obj2 = obj2
