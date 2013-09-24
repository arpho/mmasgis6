var Region = require('../../models/region');
var Provincia = require('../../models/provincia');
var Comune = require('../../models/comune');
var async = require('async')
var clc = require('./classCollector')
var cache = require('memory-cache');

var parallelRegione = function(selection, callback){
		getIstatFromRegione(selection,function(err,istat){callback(null,istat)})
	}

var parallelProvincia = function(selection,callback){
		getIstatFromProvincia(selection,function(err,istat){callback(null,istat)
		})
	}
var parallelComune = function(selection,callback){
	//console.log('comuni '+selection)
		callback(null,selection) /* nel caso dei comuni, selection
		/* è già la lista dei loro tc_istat_id se ne occupa clasCollector
	  elaborando la lista delle selezioni ricevuta dal client*/
	}
	
var parallelCap = function(selection,callback){
		callback(null,[]) /* nel caso dei cap non uso il concetto di codice istat
		// il cap è usato per ricavare direttamente la lista pv con getPv */
	}
var parallelPv = function(selection,callback){
		callback(null,[]) /* nel caso dei pv come dei cap non uso il concetto di codice istat
		// il pv_id è usato per ricavare direttamente la lista pv con getPv */
	}

function getIstat4Selection(selezione,next){
	var selection = clc.classCollector(selezione)
	if (cache.get(JSON.stringify(selection))==null){
		console.log('selezione non in cache')
		async.parallel([
			function(callback){parallelRegione(selection.regione,callback)},
			function(callback){parallelProvincia(selection.provincia,callback)},
			function(callback){parallelCap(selection.cap,callback)},
			function(callback){parallelComune(selection.comune,callback)},
			function(callback){parallelPv(selection.pv,callback)}
		],
		function(err,results){
			//console.log('end parallel')
			//console.log(results)
			//console.log('end result optional function di getIstat4Selection 42')
			var total = []
			for (var i=0;i<results.length;i++){total = total.concat(results[i])}
			cache.put(JSON.stringify(selection),total,5*60*1000)
			next(null, total)
			})
	}
	else{
		console.log('selezione in cache')
		next(null,cache.get(JSON.stringify(selection)))
	}
}
function getProvince(regioni,next)
/*
 * ritorna la lista dei cod_pro appartenenti alla lista delle regioni passate
 * @arg regioni:[{classe:'regione',id:int}]
 * @return [int]*/
{
	/*User.find({nome:'me'},function(err,user){
		console.log(user)})*/
	var regioni_id = []
	for (var i=0;i<regioni.length;i++){regioni_id.push(Number(regioni[i].id))}
	//console.log(regioni_id)
	//var province = null
	//next('test next prima DI FIND','should be prov')
	//console.log('ora provincia.find')
	Provincia.find({codice_regione:{$in:regioni_id}},function(err,province){
		 if (err){console.log('errorre whoosh '+err);
		 //console.log('this is callback')
		//next(err,province)
		 }
		if (!province){console.log('trovato nulla')}
		//console.log('callback tc_istat_id')
		var out =[]
		for (var i=0;i<province.length;i++)
		{
			out.push(province[i].codice)
		}
		next(null,out)
	 })
	 //next()
	 //console.log('dopo find')
}

function getIstatFromRegione(regioni,next)
{/*
@param:[{classe:'regione',id:int}]
* @param gString nome censimento
*/
	//var next = next
	var province = []
	var istat = []
	var pv_list = []
	/*ritorna i pv residenti in una lista di regioni*/
	async.series([
			function(callback)
			{
						getProvince(regioni,function(err,out) //ottengo la lista delle province
						{
							province = out
							callback(err,out)
						})
			},
		function(callback)
		{
			getIstat(province,function(err,out) // ottengola lista dei codici istat
			{
				istat = out
				//callback(err,out)
				next(err,out)
			})
		},
		
		
	], function(err,results)
	{
		next(err,istat)
	})
}

 function getIstatFromProvincia(prov,next)
 {/*
  wrapper di getIstat
  * @param [{id:Number}]
  * #return [Number]
 */
 //console.log(next)
	 var prov_id = []
	 for (var i =0;i<prov.length;i++){prov_id.push(prov[i].id)}
	 getIstat(prov_id,next)
}
function getIstat(prov,next){
	/*interroga la collezione comuni ritornando il tc_comune_id dei comuni il cui codice provincia è presente nella lista passata
	 * @param [int]*/
	 //console.log('tc_istat_id.142 in getIstat')
		Comune.find({codice_provincia:{$in:prov}},function(err,comuni){
		if(err){next(err); console.log('errore getIstat')}
		var out = []
		for (var i=0;i<comuni.length;i++){out.push(Number(comuni[i].tc_comune_id))}
		next(null,out)
	 })
 }
exports.getProvince = getProvince
exports.getIstat = getIstat
exports.getIstatFromRegione = getIstatFromRegione
exports.getIstatFromProvincia = getIstatFromProvincia
exports.getIstat4Selection = getIstat4Selection

