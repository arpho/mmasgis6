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

		
		
function getUserUtb(user,next){
	
	}
function getIstat(utb_cliente,utb_utente,utb_selection,next){
	/*@method
	 * recupera i codici istat relativi alle utb di utente, cliente e selezione
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
		var out = und.intersection(results[0],results[1],results[2]) //calcolo l'intersezione dei codici istat
		istat = out
		var istats = {}
		istats.intersection = out
		istats.selection = results[2]
		next(null,istats)
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
	async.series([//function(callback)
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
	},// eof seconda funzione serie
	
	],function(err,results){
		solver.getPv({tc_istat_id:{$in:results[1]}},censimento,function(err,out){next(err,out)})
		//results[1]:istat:[int]
		})// eof series
		
}

function getPv(results,req,next){
	/**@method getPv
	 * @param dummy
	 * */
	async.parallel([//getPv in intersection
							function(callback){
								solver.getPv({tc_istat_id:{$in:results[0].intersection},owner:{$exists:false}},
								req.censimento,
								function(err,out){
									
									console.log('next in getPv')
									if (err){console.log('errore');console.dir(err)}
									console.log("prima parallel cerca i pv nell'intersezione")
									console.dir(out.length)
									callback(err,out)
									console.log('end next getPv')
								})
							}, //eof prima funzione parallel 
							// get Pv<- cliente in selection
							function(callback){
								solver.getPv({tc_istat_id:{$in:results[0].selection},owner:req.user.cliente_id},
								req.censimento,
								function(err,out){
									console.log('seconda parallel cerca i pv di proprietà')
									//console.log(out.length)
									if (err){console.log(err)}
									callback(err,out)})
								} // eof seconda funzione parallel 
						], // unifico i pv e li rimando in dietro
						function(err,results){
							console.log('parallel results  ho preso le due serie di  pv getPv')
							console.log(results.length)
							console.log('parallel0')
							console.dir(results[0].length)//lista A pv originali
							console.log('parallel1')//lista B pv prprietari
							var C = includes.pvListMerger(results[0],results[1]) //paging va qui
							console.dir(results[1].length)
							var out = C
							next(err,out)
							//devo creare una lista  unica degli _id dei pv da inviare al client
							//for 
						} // eof optional di parallel
				)// eof parallel
}
function switchDb(censimento){
	/*cambia il database a cui si connette mongoose*/
	var mongoose = require('mongoose')
	mongoose.disconnect(function(){var db = mongoose.connect('mongodb://localhost/'+censimento);})
	
	//mongoose.connection.base.connections[1].close();
	//console.log('disconnected')
	//mongoose.connect('localhost',db);
}
function getSelection(req,next){
	async.series([// cerco utb di cliente utente e selezione
			function(callback){
					async.parallel([function(callback){
						var user = req.user
						clienti_utb.find({cliente_id:user.cliente_id},function(err,utbs){
						if (err){
						console.log('errore nella prima funzione parallela di getPvList. no customer_utb')
							return next(err) //chiudo l'esecuzione
						}
						callback(err,utbs)
						//next(err, utbs)
						})
					},//eof prima funzione parallelo clienti_utb
			function(callback){
				var user = req.user 
				user_utbs.find({user_id:user._id.toString()},function(err, utbs){callback(err,utbs)})
			},// eof seconda funzione parallelo utenti_utb
					],function(err,results){
						// devo convertire le utb in codici istat, getIstat lo fa in parallelo e ritorna l'intersezione
						getIstat(results[0],results[1],req.selezione,function(err,out){
			if (err){callback(err)}
			
			callback(err,out)
			//next(null,out)
		})
						//next(err,results)
						} // eof optional parallel estrae gli istat e li interseca
						)// eof parallel
				//cerco le utb del cliente
			},//eof prima e unica funzione serie ho i codici istat  dell'intersezione e della selezione
			]
			,function(err,results){ //in results ho l'output di getIstat:{intersection:[int],selection:[int]}
				console.log('optional di series woa');
				next(err,results);
				//cerco i pv in intersection e quelli appartenenti al cliente contenuti nella selezione iniziale
				// lo faccio in parallelo, la funzione opzionale unificherà i due risultati e invocherà next per getSelection
				async.parallel([//getPv in intersection
							function(callback){
								solver.getPv({tc_istat_id:{$in:results.intersection},owner:{$exists:false}},
								req.censimento,
								function(err,out){
									console.log('prima parallel')
									console.log(out.length)
									callback(err,out)})
							}, //eof prima funzione parallel 
							// get Pv<- cliente in selection
							function(callback){
								solver.getPv({tc_istat_id:{$in:results.selection},owner:req.user.cliente_id},
								req.censimento,
								function(err,out){
									console.log('seconda parallel')
									console.log(out.length)
									callback(err,out)})
								} // eof seconda funzione parallel 
						], // unifico i pv e li rimando in dietro
						function(err,results){
							console.log('parallel results getPv second')
							console.log(results.length)
							console.log('parallel0')
							console.log(results.length)
							//devo creare una lista  unica degli _id dei pv da inviare al client
							//for 
						} // eof optional di parallel
				)// eof parallel
				console.log('end optional di series')
			}//eof optional di series
				)//eof series
}
function getPvFromSelection(req,next){
	async.series([
	// cerco gli utb  da cui estrarrò i codici istat nella funzione opzionle
		function(callback){
			async.parallel([
				function(callback){
									var user = req.user
									clienti_utb.find({cliente_id:user.cliente_id},function(err,utbs){callback(err,utbs)})
								},//eof prima funzione parallelo clienti_utb
				function(callback){
							var user = req.user 
							user_utbs.find({user_id:user._id.toString()},function(err, utbs){callback(err,utbs)})
						},// eof seconda funzione parallelo utenti_utb
			],function(err,results){
				getIstat(results[0],results[1],req.selezione,function(err,out){
			if (err){callback(err)}
			//console.log('istat')
			//console.log(out)
			callback(err,out) // ho l'uscita di getIstat nel results di series
			//next(null,out)
		})
			} // eof optional parallel
			)}
	],function(err,results){
		console.log('elementi in results series0 '+ results.length)
		async.series([
				function(callback){switchDb(req.censimento); callback()},
				function(callback){getPv(results,req,callback)}, // il results è quello della serie precedente  che cioè {intersection:[int],selection:[int]}
				function(callback){switchDb('mmasgis');callback()}
		],
		function(err,results){
			var out = results //'qlc di results'
			console.log(out)
			console.log('optional di series holè')
			// results è una lista di 3 elementi [null,pv,null]
			//console.log(results[1][0])
			//next(err,out)
			} // eof optional in series
			)// eof series 
		//next(err,results)
		 console.log('output della prima serie')
		} // eof optional in series
		) // eof series
	}
exports.getPvFromSelection = getPvFromSelection
exports.getSelection = getSelection
exports.getFullList = getFullList
