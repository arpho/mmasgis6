var solver = require('./selectionSolver')
var async=require('async')
var und = require("underscore");
var User = require('../../models/user');
var clienti_utb = require('../../models/clienti_utb');
var user_utbs = require('../../models/users_utb');
var utb_utente = {}
var istat_cliente = null
var istat_utente = null
var istat_selezione = null
var istat = null
var tc_istat = require('./tc_istat_id');
var und = require("underscore");
var includes = require('./includes')
function switchDb(censimento){
	/*cambia il database a cui si connette mongoose*/
	var mongoose = require('mongoose')
	mongoose.disconnect(function(){var db = mongoose.connect('mongodb://localhost/'+censimento);})
}

function getPv(req,data,next){
	/*recupera le due liste  di pv dal database  e le passa a next
	 * @method {getPv}
	 * @param {Object} richiesta di express*
	 * @param {Function} callback generata da opt_series
	 * @return {Object} :: [pv]
	 * */
	 console.log('getPv')
	 console.log(data.intersection.length)
	 var a = function(after){
		 solver.getPv({tc_istat_id:{$in:data.intersection},owner:{$exists:false}},req.censimento,function(err,out){
			 
			 after(err,out)
			}
		)}
	var b = function(after){solver.getPv({tc_istat_id:{$in:data.selection},owner:req.session.user._id.toString()},
		req.censimento,function(err,out){after(err,out)})}
	 async.parallel([//getPv in intersection
		function(callback){a(callback)}, // eof parallel1
		function(callback){solver.getPv({tc_istat_id:{$in:data.selection},owner:req.session.user._id.toString()},
		req.censimento,function(err,out){callback(err,out)})}
	],function(err,results){
		var out = includes.pvListMerger(results[0],results[1])
		//console.log(out)
		next(err,out)
	} //eof optional
) // eof parallel
} // eof getPv

function pvRetriever(req,data,next){
	/*si occupa di eseguire lo switching del db invocare getPv
	 * e riportare tutto su mmasgis
	 * @method {pvRetriever}
	 * @param {Object}express request
	 * @param {Object} {intersection:[int],selection[int]}
	 * @return {Object} [Pv]
	 * 
	 * */
	 var switchDb = PvLObj.prototype.switchDb;
	 var getPv = PvLObj.prototype.getPv;
	//console.time('pvRetriever')
	 async.series([
			function(callback){switchDb(req.censimento);callback()},
			function(callback){getPv(req,data,callback)},
			function(callback){switchDb('mmasgis');callback()}
	 ], function(err,results){
		//console.timeEnd('pvRetriever')
		next(err,results)
		 })
 }
function getUtb2(req,next){
	async.parallel([
		function(callback){
			var user = req.session.user
			clienti_utb.find({cliente_id:user.cliente_id},function(err,utbs){callback(err,utbs)})
		},//eof prima funzione parallelo clienti_utb fn0_parallel0
		function(callback){
							var user = req.session.user 
							user_utbs.find({user_id:user._id.toString()},function(err, utbs){callback(err,utbs)})
						} //eof fn1_parallel0
	],function(err,results){
		next(req,results[0],results[1],req.selezione) // next deve essere getIstat
			}) // eof opt_parallel0
	
}

function getIstat(req,utb_cliente,utb_utente,utb_selection,next){
	/*ricava i codici istat per cliente, utente e selezione e ne calcola l'intersezione
	 * @method {getIstat}
	 * recupera i codici istat relativi alle utb di utente, cliente e selezione
	 * @param {utb_cliente}:[{classe:String<regione,provincia,comune,Pv>
	 * @param {utb_utente}:{classe:String<regione,provincia,comune,Pv>
	 * @param {utb_selection}:{classe:String<regione,provincia,comune,Pv>*/
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
		var out = und.intersection(results[0],results[1],results[2]) //calcolo l'intersezione dei codici istat
		var istat = {}
		istat.intersection = out
		istat.selection = results[2]
		console.log('istat.intersection')
		console.log(istat.intersection.length)
		console.log('getistat chiama next')
		next(req,istat,next) //the external next is getPv, the internal next is the final callback
		}//eof optional function in parallel
		)//eof parallel
}

function pvFetcher(req,next){
	/*ritorna la lista dei Pv
	 * @method {pcFetcher}
	 * @param {req}
	 * @param {Function} funzione di callback function(err,out)*/
	 //series0
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

function PvLObj(req){
	/*
	 * questa classe raccoglie tutte le funzionalità necessarie per
	 * ottenere la lista di Pv data la  richiesta di express
	 * @class {PvObj}*/
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
