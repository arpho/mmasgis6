var mongoose = require('mongoose')
var rel_pv_par = require('../../schemas/rel_pv_par');
var rel_pv_pot = require('../../schemas/rel_pv_pot');
var cache = require('memory-cache');
var tc_par = require('../../schemas/tc_par');
var tc_pot = require('../../schemas/tc_pot');
var tc_clpar = require('../../schemas/tc_clpar');
var tc_clpot = require('../../schemas/tc_clpot');
var async = require('async')
/** implementa Parameter, siinterfaccia al database per ricavare la lista degli attributi di un pv.
 * @param req: richiesta express
 * @param conn: connessione mongoose
@class Parameter */
function Parameter( req,conn){
		this.family = 'par'
		//this.census = req.censimento
		this.conn = conn
		this.Rel = this.conn.model('rel_pv_par', rel_pv_par); // modello delle relazioni
		this.Tc = this.conn.model('tc_par', tc_par) // modello degli aatributi
		this.Tc_cl = this.conn.model('tc_clpar', tc_clpar) // modello delle classi degli attributi
	}
	/**
	 * ritorna la lista degli item in tc_cl+family
	 * @param Id: int
	 * @param function: funzione di callback
	 * @method getClass*/
	function getClasses(next){
		console.log('classes: '+this.family)
		console.time('getClasses')
		this.Tc_cl.find({},function(err,out){ console.timeEnd('getClasses')
			next(err,out)}).sort({ordine:1})
	}
	/**
	 * ritorna la lista degli item in tc_par 
	 * @method getAttribute
	 * @param function: funzione di callback
	 * */
	function getParameters(next){
		console.log('parameters '+this.family)
		console.time('getParameters')
		this.Tc.find({},function(err,out){ console.timeEnd('getParameters');
			next(err,out)}).sort({ordine:1})
	}
	/**
	 * ritorna la lista degli item in tc_pot 
	 * @method getAttribute
	 * @param function: funzione di callback
	 * */
	function getPotentials(next){
		console.time('getPotentials')
		this.Tc.find({},function(err,out){ console.timeEnd('getPotentials');
			next(err,out)}).sort({ordine:1})
	}
	/** ritorna le relazioni con il pv
	 * @method getRelations
	 * @param referenced_pv: ObjectId del pv*/
	function getRelations(Id,next){
		this.Rel.find({referenced_pv:Id},function(e,o){next(e,o)})}
	/**
	 * cerca un item  nella lista per campo
	 * @method find
	 * @param [{}] lista in cui cercare
	 * @param string: campo di interesse
	 * @value Object: valore di interesse
	 * @return Object l'oggetto della lista cercato*/
	function find(l,field,value){
		var found = false
		var out = null
		for (var i=0;i<l.length && !found;i++){
				if(l[i][field] == value){
					found = true
					out = l[i]
				}
			}
		return out
	}
	
	
	/**
	 * ritorna la lista degli attributi del pv insieme con il testo di classe e parametro
	 * @method getAttributeslist
	 * @param referenced_pv: ObjectId del pv
	 * @param Parameter: come in python passo un riferimento a se stesso
	 * */
	 function getParametersList(Id,obj,next){
		async.parallel([
			function(callback){obj.getParameters(callback)}, // ottengo la lista dei parametri
			function(callback){obj.getClasses(callback)}, // ottengo la lista delle classi
			function(callback){obj.getRelations(Id,callback)} // ottengo la lista delle relazioni
		],function(err,results){
			attributes = results[0]
			classes = results[1]
			relations = results[2]
			var out = []
			for (var i=0;i<relations.length; i++){
				cl = find(classes,'tc_clpar_id',relations[i]['tc_clpar_id'])
				classText = cl.testo
				att = find(attributes,'tc_par_id',relations[i]['tc_par_id'])
				valueText = att.testo				
					var item = {class:classText,class_id:cl.tc_clpar_id,value:valueText,value_id:att.tc_par_id}
				out.push(item)
				}
			next(err,out)
		})
		
		 }
		 
	/**
	 * ritorna la lista degli attributi del pv insieme con il testo di classe e parametro
	 * @method getAttributeslist
	 * @param referenced_pv: ObjectId del pv
	 * @param Parameter: come in python passo un riferimento a se stesso
	 * */
	 function getPotentialsList(Id,obj,next){
		async.parallel([
			function(callback){obj.getAttributes(callback)}, // ottengo la lista dei parametri
			function(callback){obj.getClasses(callback)}, // ottengo la lista delle classi
			function(callback){obj.getRelations(Id,callback)} // ottengo la lista delle relazioni
		],function(err,results){
			attributes = results[0]
			classes = results[1]
			relations = results[2]
			var out = []
			for (var i=0;i<relations.length; i++){
				cl = find(classes,'tc_clpot_id',relations[i]['tc_clpot_id'])
				classText = cl.testo
				att = find(attributes,'tc_pot_id',relations[i]['tc_pot_id'])
				valueText = att.testo				
					var item = {class:classText,class_id:cl.tc_clpot_id,value:relations[i].valore,value_id:att.tc_pot_id}
				out.push(item)
				}
			next(err,out)
		})
		
		 }
/**
 * astrae il concetto di potenziale
 * @class Potential
 * */
function Potential(req,conn){
	
	 //this.inheritFrom = Parameter ;

	//this.inerithedFrom()
	this.family = 'pot'
	//this.census = req.censimento
	this.conn = conn
	this.Rel = this.conn.model('rel_pv_pot', rel_pv_pot); // modello delle relazioni
	this.Tc = this.conn.model('tc_pot', tc_pot) // modello degli aatributi
	this.Tc_cl = this.conn.model('tc_clpot', tc_clpot) // modello delle classi degli attributi
}
/**wrapper delle classi per gli attributi permette di ritornare i valori delle grid di anagrafica con una sola chiamata
 * @class AttributesWrapper
 * @param req richiesta di express
 * @param string host di mongodb */
function AttributesWrapper(req,host){
	var conn = mongoose.createConnection(host,req.censimento,27017)
	this.Parameter = new Parameter(req,conn)
	this.Potential = new Potential(req,conn)
}

/**ottiene le liste di attributi da inviare ad anagrafica
 * @param _id ObjectId di pv*/
 function getLists(Id,obj,next){
	 //console.log(obj.Parameter)
		 async.parallel([
				function(callback){obj.Parameter.getAttributesList(Id,obj.Parameter,callback)},
				function(callback){obj.Potential.getPotentialsList(Id,obj.Potential,callback)}
				],function(err,results){
					data = {}
					data.success = true
					data.attributs = {}
					data.attributs.params = {}
					data.attributs.params.data = results[0]
					data.attributs.potentials = {}
					data.attributs.potentials.data = results[1]
					data.attributs.brands = {}
					data.attributs.brands.data = [{class:'stub',value:'stub dal back-end'}]
					next(err,data)})
		}
AttributesWrapper.prototype.getLists = getLists
Potential.prototype.getClasses = getClasses
Potential.prototype.getAttributes = getPotentials
Potential.prototype.getRelations = getRelations
Potential.prototype.getPotentialsList = getPotentialsList
Parameter.prototype.getClasses = getClasses
Parameter.prototype.getRelations = getRelations
Parameter.prototype.getParameters = getParameters
Parameter.prototype.getAttributesList = getParametersList
exports.find = find
exports.Parameter = Parameter
exports.Potential = Potential
exports.AttributesWrapper = AttributesWrapper
