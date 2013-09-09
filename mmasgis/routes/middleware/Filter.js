var mongoose = require('mongoose'),
 rel_pv_par = require('../../schemas/rel_pv_par'),
 rel_pv_mar = require('../../schemas/rel_pv_mar'),
 rel_pv_pot = require('../../schemas/rel_pv_pot'),
 tc_par = require('../../schemas/tc_par'),
 tc_mar = require('../../schemas/tc_mar'),
 tc_pot = require('../../schemas/tc_pot'),
 tc_clpar = require('../../schemas/tc_clpar'),
 tc_clmar = require('../../schemas/tc_clmar'),
 tc_clpot = require('../../schemas/tc_clpot'),
 tc_rel_clmar_mar = require('../../schemas/tc_rel_clmar_mar'),
 und = require("underscore");
 async = require('async');
/**esegue le query sui parametri
 * @class FilterParameter
 * @param express.request
 * @param mongoose.connection*/
function FilterParameter(req,conn){
	this.family = 'par'
	this.census = req.censimento
	this.conn = conn
	this.Rel = this.conn.model('rel_pv_par', rel_pv_par);
}
/**crea le funzioni che eseguono la query in async.parallel
 * @method makeQueryFunction
 * @param FilterParameter
 * @param query: {cl_id:int,att_id:[int]}
 * @return Function::rel_pv_par.find(..)*/
 function makeQueryFunction(self,query){
	 var out = function(callback){
		 //self.Rel.find({tc_clpar_id:query.cl_id,tc_par_id:{$in:query.att_id}},function(e,o){callback(e,o)})
		 self.Rel.find({tc_clpar_id:query.cl_id}).where('tc_par_id').in(query.att_id).exec(function(e,o){callback(e,o)})
		 }
	 return out
	 }
	 
/** esegue queries in parallelo
 * @method executesQueries
 * @param [QueryFunction]
 * @param callback
 * @note a callback è ritornato l'oggetto results di async.parallel: una lista degli output di ogni query sta a callback elaborarli*/
function executesQueries(queries,next){
	async.parallel(queries,function(err,results){next(err,results)})
}
/**
 * esegue la query di buildQuery
 * @method executesQuery
 * @param FilterParam
 * @param query prodotta da buildQuery::{$or[query]}
 * @Function callback*/
function executesQuery(self,query,next){
	self.Rel.find(query,function(e,o){next(e,o)})
}
/**
 * inserisce un oggetto in un associative array, contando il numero di occorrenze usando come chiave il referenced_pv
 * @method pusPv
 * @param {} array da popolare
 * @return null
 * */
function pushPv(ar,item){
	//console.log(item)
	if (item._doc.referenced_pv in ar){ar[item._doc.referenced_pv]+=1;}
	else{ar[item._doc.referenced_pv] = 1} //inizializzo il contatore
}
	/**data la lista ottenuta dalla query, crea una lista contenente ogni pv presente con il suo numero di occorrenze
	 * @method pvList
	 * @param [mongoose.model.rel_pv]
	 * @return {referenced_pv_id:int} */
function listPv(l){
	out = {} 
	for (var i=0;i<l.length;i++){
		pushPv(out,l[i])
	}
	return out
	}
	
/**esegue la query di buildQuery e ne  elabora il risultato ritornando la
 *  lista dei pv che rispettano tutte le clausole del filtro
 * @method executeFilter
 * @param FilterParam
 * @param query ottenuta da buildQuery
 * @param Function callback
 * @note opera come wrapper di executeQuery, listPv e filterList*/
 function executesFilter(self,query,next){
	//eseguo la query
	var rawList 
	self.executesQuery(self,query,function(e,o){
		rawList = o
		countedList = self.listPv(rawList)// conto le occorrenze dei pv
		//ottengo il numero di condizioni che devono essere soddisfatte
		n = query['$or'].length
		var out = self.filterList(countedList,n)
		next(null,out)
		
	})
}

	
/**filtra lo array ottenuta da listPv ritornando solo i referenced_pv che hanno il corretto numero di occorrenze
 * @param {referenced_pv:int
 * @param int numero occorrenze cercato
 * @method filterList */
function filterList(l,count){
	var out = []
	pv = Object.keys(l) //  i referenced_pv sono la chiave dello array ritornato da pvList
	for (var i =0;i<pv.length;i++){
			k = pv[i] //ottengo la chiave
			if (l[k]==count){
				out.push(k);
			}
	}
	return out
}
/**crea la query che verrà eseguita da executesQuery
 * @method buildQuery
 * @param FilterParam: istanza di Filter <FilterParam,FilterPotential,Filterbrans>
 * @param query: {cl_id:int,att_id:[int]} setting del filtro
 * @return Function::{$or[query]}*/
function buildQuery(self,setting){
	var query = {$or:[]}
	cl = 'tc_cl'+self.family+'_id'
	att ='tc_'+self.family+'_id'
	keys = Object.keys(setting)
	for( var k=0;k<keys.length;k++){
		ch = keys[k]
		var q = {}
		q[cl] = ch
		q[att] = {$in:setting[ch]}
		query['$or'].push(q)
	}
	return query
}

FilterParameter.prototype.makeQueryFunction = makeQueryFunction
FilterParameter.prototype.executesQueries = executesQueries
FilterParameter.prototype.buildQuery = buildQuery
FilterParameter.prototype.executesQuery = executesQuery
FilterParameter.prototype.pushPv = pushPv
FilterParameter.prototype.listPv = listPv
FilterParameter.prototype.filterList = filterList
FilterParameter.prototype.executesFilter = executesFilter
exports.FilterParameter = FilterParameter

