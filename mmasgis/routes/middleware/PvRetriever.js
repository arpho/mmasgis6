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

		
		
function getUserUtb(user,next){
	user_utbs.find({user_id:user._id.toString()},function(err, utbs){utb_utente = utbs;next(err,utbs)})
	}
function getIstat(utb_cliente,utb_utente,utb_selection,next){
	/*recupera i codici istat relativi alle utb di utente, cliente e selezione
	 * @param utb_cliente:[{classe:String<regione,provincia,comune,Pv>
	 * @param utb_utente:{classe:String<regione,provincia,comune,Pv>
	 * @param utb_selection:{classe:String<regione,provincia,comune,Pv>*/
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
		var out = und.intersection(istat_cliente,istat_utente,istat_selezione) //calcolo l'intersezione dei codici istat
		istat = out
		next(null,out)
		}//eof optional function in parallel
		)//eof parallel
}
function getFullList(req,next){
	var censimento = req.censimento
	var utb_cliente = {}
	var user = req.user
	//console.log(user.cliente_id)
	var utb_selezione = req.selezione
	//console.log('getpv')
	async.series([
	function(callback){
		//cerco le utb di cliente e utente
		async.parallel([
				function(callback){// cerco le utb per cui è abilitato il cliente
					//console.log('parallel '+user.cliente_id)
					clienti_utb.find({cliente_id:user.cliente_id},function(err,utbs){
						if (err){
						console.log('errore nella prima funzione parallela di getPvList. no customer_utb')
							return next(err) //chiudo l'esecuzione
						}
						utb_cliente = utbs
						callback(err,utbs)
						//next(err, utbs)
						})
				},//eof prima funzione parallela
				//cerco le utb per cui è abilitato l'utente
				function(callback){getUserUtb(user,callback)}//eof seconda funzione parallela
				
		],function(err,results){ /*console.log('out parallel');console.log(results);*/callback(err,results)}) // eof parallel 
	}//eof  prima funzione serie
	// cerco l'intersezione dei codici istat per cliente, utente e selezione
	,function(callback){
		//console.log(utb_selezione)
		getIstat(utb_cliente,utb_utente,utb_selezione,function(err,out){
			if (err){callback(err)}
			callback(err,out)
			next(null,out)
		})//eof getIstat
	}// eof seconda funzione serie
	],function(err,results){
		solver.getPv({tc_istat_id:{$in:results[1]}},censimento,function(err,out){next(err,out)})
		//results[1]:istat:[int]
		})// eof series
}
exports.getFullList = getFullList
