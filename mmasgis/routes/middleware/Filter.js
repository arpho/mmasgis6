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
function FilterParameter(req,db){
	this.family = 'par'
	this.census = req.censimento
	this.db = db
	//this.Rel = this.conn.model('rel_pv_par', rel_pv_par);
	var Collection = null;
	this.rel_pv_par = Collection;
	var self = this
	db.collection('rel_pv_par', function(err, collection) {self.rel_pv_par = collection;});
}
/**esegue le query sui potenziali
 * @class FilterParameter
 * @param express.request
 * @param mongoose.connection*/
function FilterPotential(req,db){
	this.family = 'pot'
	this.census = req.censimento
	this.db = db
	//this.Rel = this.conn.model('rel_pv_par', rel_pv_par);
	var Collection = null;
	this.rel_pv_par = Collection;
	var self = this
	db.collection('rel_pv_pot', function(err, collection) {self.rel_pv_par = collection;});
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
	console.log('executesQuery');
	console.time('executesQuery')
	self.rel_pv_par.find(query).toArray(function(e,o){if (e){return console.dir(e)}console.timeEnd('executesQuery');next(e,o)})
}
/**
 * inserisce un oggetto in un associative array, contando il numero di occorrenze usando come chiave il referenced_pv
 * @method pusPv
 * @param {} array da popolare
 * @return null
 * */
function pushPv(ar,item){
	if (item.referenced_pv in ar){ 
		ar[item.referenced_pv]+=1;}
	else{
		ar[item.referenced_pv] = 1} //inizializzo il contatore

}
	/**data la lista ottenuta dalla query, crea una lista contenente ogni pv presente con il suo numero di occorrenze
	 * @method pvList
	 * @param [mongoose.model.rel_pv]
	 * @return {referenced_pv_id:int} */
function listPv(l){
	pv = {}
	console.log(l.length)
	for (var i=0;i<l.length;i++){
		//console.log('counting'+i)
		pushPv(pv,l[i])
	}
	console.log('listato '+i+' elementi')
	return pv
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
		console.log('@#rawList')
		console.time('counting')
		countedList = self.listPv(rawList)// conto le occorrenze dei pv
		console.timeEnd('counting')
		//ottengo il numero di condizioni che devono essere soddisfatte
		var n
		if (query['$or']){n = query['$or'].length}
		var out = {}//
		out.data = countedList
		out.n = n
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
/**
 * ritorna la condizione del filtro per i parametri
 * @method getCondition4Parameter
 * @param cl::int tc_clpar_id
 * @param att::[int] insieme di tc_par_id da rispettare
 * @return {tc_clpar_id:cl,tc_par_id:{$in:att}
 * */
function getCondition4Parameter(cl,att){
	return {tc_clpar_id:cl,tc_par_id:{$in:att}}
}
/**crea la query che verrà eseguita da executesQuery
 * @method buildQuery
 * @param FilterParam: istanza di Filter <FilterParam,FilterPotential,Filterbrans>
 * @param setting: {cl_id:int,att_id:[int]} setting del filtro
 * @return Function::{$or[query]}*/
function buildQuery(self,setting){
	var query = {$or:[]};
	var cl = 'tc_cl'+self.family+'_id';
	var att ='tc_'+self.family+'_id';
	var keys = Object.keys(setting);
	var j = 0
	var ch
	do{
		ch = parseInt(keys[j]);
		query.$or.push(self.getCondition(ch,setting[ch]));
		j += 1
	}
	while (j<keys.length);
	return query;
};
FilterParameter.prototype.getCondition = getCondition4Parameter
FilterParameter.prototype.filterList = filterList
FilterParameter.prototype.makeQueryFunction = makeQueryFunction
FilterParameter.prototype.executesQueries = executesQueries
FilterParameter.prototype.buildQuery = buildQuery
FilterParameter.prototype.executesQuery = executesQuery
FilterParameter.prototype.pushPv = pushPv
FilterParameter.prototype.listPv = listPv
FilterParameter.prototype.filterList = filterList
FilterParameter.prototype.executesFilter = executesFilter
exports.FilterParameter = FilterParameter



FilterPotential.prototype.filterList = filterList
FilterPotential.prototype.makeQueryFunction = makeQueryFunction
FilterPotential.prototype.executesQueries = executesQueries
FilterPotential.prototype.buildQuery = buildQuery
FilterPotential.prototype.executesQuery = executesQuery
FilterPotential.prototype.pushPv = pushPv
FilterPotential.prototype.listPv = listPv
FilterPotential.prototype.filterList = filterList
FilterPotential.prototype.executesFilter = executesFilter
exports.FilterPotential = FilterPotential

