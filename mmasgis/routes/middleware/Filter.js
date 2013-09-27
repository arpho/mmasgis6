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
intersect = require('./array_intersect.min').array_intersect;
var Debug = require('../../public/javascripts/constants').Debug
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
	this.rel = null
	var self = this
	db.collection('rel_pv_par', function(err, collection) {self.rel_pv_par = collection;
	self.rel = collection});
}

/**
 * wrapper di FilterParameter, FilterPotential,FilterBrand
 * @class FullFilter
 * @param express.request
 * @param mongodb-node-native.connection
 *  */
 function FullFilter(req,db){
	 this.parameter = new FilterParameter(req,db)
	 this.potential = new FilterPotential(req,db)
	 this.brand = new FilterBrand(req,db)
	this.filterFunction = {}
	this.filterFunction.par = this.parameter
	this.filterFunction.mar = this.brand
	this.filterFunction.pot = this.potential
}
/** lancia i filtri in parallelo su tutti gli attributi richiesti
 * @method runFilter
 * @param istanza di FullFilter
 * @param express.request il formato dei dati del filtro è [{family:<'par','mar','pot'>,data:{int:[int]}}]*/
function runFilter(self,req,next){
	var settings = req.filter
	/**
	 * genera la funzione che va eseguita in parallelo
	 * @method generateFilter
	 * @param {family:string, data:{..}
	 * return Function
	 * */
	function generateFilter(item){
		var family = item.family;
		Debug('item in generateFilter')
		Debug(item)
		var filterAttribut = self.filterFunction[family];
		var data = item.data
		var query = filterAttribut.buildQuery(filterAttribut,data)
		var out = function(cb){filterAttribut.executesFilteredList(filterAttribut,query,cb)}
		return out
	}
	var functions = []
	Debug('settings filter')
	Debug(settings)
	for (var i=0;i<settings.length;i++){
		Debug(settings[i])
		functions.push(generateFilter(settings[i]))
	}console.time('parallel')
	async.parallel(functions,function(err,results){
		//Debug('results.length in poarallel: '+results.length)
		var out;
		if (results.length>1){
			out = intersect(results[0],results[1]) //inizializzo 
			for (var i=2;i<results.length;i++){
				out = intersect(out,results[i])
			}
		}
		else{
			out = results[0]
		}
		console.timeEnd('parallel')
		next(err,out)})
	
}

	/**esegue le query sui marchi
 * @class FilterBrand
 * @param express.request
 * @param mongoose.connection*/
function FilterBrand(req,db){
	this.family = 'mar'
	this.census = req.censimento
	this.db = db
	//this.Rel = this.conn.model('rel_pv_par', rel_pv_par);
	var Collection = null;
	this.rel_pv_mar = Collection;
	this.rel = null
	var self = this
	db.collection('rel_pv_mar', function(err, collection) {self.rel_pv_mar = collection;
	self.rel = collection});
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
	this.rel = null
	var self = this
	db.collection('rel_pv_pot', function(err, collection) {self.rel_pv_par = collection;
	self.rel = collection});
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
	self.rel.find(query).toArray(function(e,o){if (e){return console.dir(e)};next(e,o)})
}

/**
 * esegue la query di buildQuery per i marchi
 * @method executesBrandsQuery
 * @param FilterParam
 * @param query prodotta da buildQuery::{$or[query]}
 * @Function callback*/
function executesBrandsQuery(self,query,next){
	self.rel_pv_mar.find(query).toArray(function(e,o){if (e){return console.dir(e)};next(e,o)})
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
	for (var i=0;i<l.length;i++){
		//Debug('counting'+i)
		pushPv(pv,l[i])
	}
	return pv
}
	
/**esegue la query di buildQuery e ne  elabora il risultato ritornando la
 *  lista dei pv che rispettano tutte le clausole del filtro
 * @method executeFilter
 * @param FilterParam
 * @param query ottenuta da buildQuery
 * @param Function callback
 * @note opera come wrapper di executeQuery, listPv bisogna applicare filterList al risultato*/
 function executesFilter(self,query,next){
	//eseguo la query
	var rawList 
	self.executesQuery(self,query,function(e,o){
		rawList = o
		countedList = self.listPv(rawList)// conto le occorrenze dei pv
		//ottengo il numero di condizioni che devono essere soddisfatte
		var n
		if (query['$or']){n = query['$or'].length}
		var out = {}//
		out.data = countedList
		out.n = n
		next(null,out)
		
	})
}/**esegue la query di buildQuery e ne  elabora il risultato ritornando la
 *  lista dei pv che rispettano tutte le clausole del filtro
 * @method executeFilteredList
 * @param FilterParam
 * @param query ottenuta da buildQuery
 * @param Function callback
 * @note opera come wrapper di executeQuery, listPv e filterList*/
 function executesFilteredList(self,query,next){
	//eseguo la query
	var rawList 
	self.executesQuery(self,query,function(e,o){
		rawList = o
		countedList = self.listPv(rawList)// conto le occorrenze dei pv
		//ottengo il numero di condizioni che devono essere soddisfatte
		var n
		if (query['$or']){n = query['$or'].length}
		var out = {}//
		out.data = countedList
		out.n = n
		var result = self.filterList(out.data,n)
		next(null,result)
		
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
}/**
 * ritorna la condizione del filtro per i potenziali
 * @method getCondition4Potential
 * @potam cl::int tc_clpot_id
 * @potam att::[int] insieme di tc_pot_id da rispettare
 * @return {tc_clpot_id:cl,tc_pot_id:{$in:att}
 * */
function getCondition4Potential(cl,att){
	return {tc_clpot_id:cl,tc_pot_id:{$in:att}}
}/**
 * ritorna la condizione del filtro per i marchi
 * @method getCondition4Brand
 * @maram cl::int tc_clmar_id
 * @maram att::[int] insieme di tc_mar_id da rispettare
 * @return {tc_clmar_id:cl,tc_mar_id:{$in:att}
 * */
function getCondition4Brand(cl,att){
	return {tc_clmar_id:cl,tc_mar_id:{$in:att}}
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
FilterParameter.prototype.executesFilteredList = executesFilteredList
exports.FilterParameter = FilterParameter

FilterBrand.prototype.getCondition = getCondition4Brand
FilterBrand.prototype.filterList = filterList
FilterBrand.prototype.makeQueryFunction = makeQueryFunction
FilterBrand.prototype.executesQueries = executesBrandsQuery
FilterBrand.prototype.buildQuery = buildQuery
FilterBrand.prototype.executesQuery = executesQuery
FilterBrand.prototype.pushPv = pushPv
FilterBrand.prototype.listPv = listPv
FilterBrand.prototype.filterList = filterList
FilterBrand.prototype.executesFilter = executesFilter
FilterBrand.prototype.executesFilteredList = executesFilteredList
exports.FilterBrand = FilterBrand

FilterPotential.prototype.getCondition = getCondition4Potential
FilterPotential.prototype.filterList = filterList
FilterPotential.prototype.makeQueryFunction = makeQueryFunction
FilterPotential.prototype.executesQueries = executesQueries
FilterPotential.prototype.buildQuery = buildQuery
FilterPotential.prototype.executesQuery = executesQuery
FilterPotential.prototype.pushPv = pushPv
FilterPotential.prototype.listPv = listPv
FilterPotential.prototype.filterList = filterList
FilterPotential.prototype.executesFilter = executesFilter
FilterPotential.prototype.executesFilteredList = executesFilteredList
exports.FilterPotential = FilterPotential
exports.FullFilter = FullFilter
FullFilter.prototype.runFilter = runFilter
