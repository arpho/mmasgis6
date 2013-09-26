var mongoose = require('mongoose')
var rel_pv_par = require('../../schemas/rel_pv_par');
var rel_pv_mar = require('../../schemas/rel_pv_mar');
var rel_pv_pot = require('../../schemas/rel_pv_pot');
var cache = require('memory-cache');
var tc_par = require('../../schemas/tc_par');
var tc_mar = require('../../schemas/tc_mar');
var tc_pot = require('../../schemas/tc_pot');
var tc_clpar = require('../../schemas/tc_clpar');
var tc_clmar = require('../../schemas/tc_clmar');
var tc_clpot = require('../../schemas/tc_clpot');
var tc_rel_clmar_mar = require('../../schemas/tc_rel_clmar_mar');
var coll =  require('./Utility').Collector;
var async = require('async')
var PvSchema = require('../../schemas/pv');

/** implementa Brand, si interfaccia al database per ricavare la lista degli attributi di un pv.
 * @param req: richiesta express
 * @param conn: connessione mongoose
@class Brand */
function Brand( req,conn){
		this.family = 'mar'
		this.census = req.censimento
		this.conn = conn
		this.Rel = this.conn.model('rel_pv_mar', rel_pv_mar); // modello delle relazioni
		this.Tc = this.conn.model('tc_mar', tc_mar) // modello degli aatributi
		this.Tc_cl = this.conn.model('tc_clmar', tc_clmar) // modello delle classi degli attributi
		this.Tc_rel_clmar_mar = this.conn.model('tc_rel_clmar_mar',tc_rel_clmar_mar)
	}
/** ottiene la lista dei brand che trattano la classe marca
 * @method getBrands
 * @param istanza di Brand
 * @param int: tc_clmar_id
 * @param Function callback
 * */
function getBrands(obj,Id,next){
	obj.Tc_rel_clmar_mar.find({tc_clmar_id:Id},function(e,o){
		//devo estrarre tc_mar_id dai risultati e poi fare un'altra query per ottenere il nome dei marchi
		var brand_id = []
		for ( var i=0;i<o.length;i++){
			var id = o[i].tc_mar_id
			brand_id.push(id)
		}
		//ottengo la lista degli attributi per i brand
		obj.Tc.find({tc_mar_id:{$in:brand_id}},function(e,o){next(e,o)})
		})
}

/** implementa Parameter, siinterfaccia al database per ricavare la lista degli attributi di un pv.
 * @param req: richiesta express
 * @param conn: connessione mongoose
@class Parameter */
function Parameter( req,conn){
		this.family = 'par'
		this.census = req.censimento
		this.conn = conn
		this.Rel = this.conn.model('rel_pv_par', rel_pv_par); // modello delle relazioni
		this.Tc = this.conn.model('tc_par', tc_par) // modello degli aatributi
		this.Tc_cl = this.conn.model('tc_clpar', tc_clpar) // modello delle classi degli attributi
	}
	
	/**
	 * ritorna i parametri relativi ad una classe di attributi
	 * @method getAttributs
	 * @param Id tc_cl_id
	 * @param istanza dell'oggetto a cui siamo interessati: Parameter, Potential,Brand
	 * @return [mongoose.model.attribut*/
	 function getAttributs(obj,Id,next){
		 field = 'tc_cl'+obj.family+'_id'
		 var query = {}
		 query[field] = Id
		 obj.Tc.find(query,function(e,o){next(e,o)})
	 }
	/**
	 * ritorna la lista degli item in tc_cl+family
	 * @param Id: int
	 * @param function: funzione di callback
	 * @method getClass*/
	function getClasses(next){
		//console.log('classes: '+this.family)
		if(cache.get('classes'+this.census+this.family)==null){
			this.Tc_cl.find({},null,{sort: {ordine: 1}},function(err,out){
					cache.put('classes'+this.census+this.family,out,5*60*1000)
					next(err,out)
			})//.sort({ordine:1})
		}
		else{ //console.log('trovato: '+'classes'+this.census+this.family)
			next(null,cache.get('classes'+this.census+this.family))}
	}
	/**
	 * ritorna la lista degli item in tc_par 
	 * @method getAttribute
	 * @param function: funzione di callback
	 * */
	function getParameters(next){
		if (cache.get('parameters'+this.census+this.family)==null){
			this.Tc.find({},null,{sort: {ordine: 1}},function(err,out){
				cache.put('parameters'+this.census+this.family,out,5*60*1000)
				next(err,out)})//.sort({ordine:1})
		}
		else{ next(null,cache.get('parameters'+this.census+this.family))}
	}
	/**
	 * ritorna la lista degli item in tc_pot 
	 * @method getAttribute
	 * @param function: funzione di callback
	 * */
	function getPotentials(next){
		console.time('getPotentials')
		this.Tc.find({},null,{sort: {ordine: 1}},function(err,out){ console.timeEnd('getPotentials');
			next(err,out)})//.sort({ordine:1})
	}
	/** ritorna le relazioni con il pv
	 * @method getRelations
	 * @param referenced_pv: ObjectId del pv*/
	function getRelations(Id,next){
		this.Rel.find({referenced_pv:Id},function(e,o){next(e,o)}).sort({ordine:1})}
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
	 * ritorna la lista delle marche del pv con il testo di classe e tipologia marca
	 * @method getBrandsList
	 * @param referenced_pv: ObjectId del pv
	 * @param funzione di callback
	 * */
	 function getBrandsList(Id,obj,next){
			async.parallel([
				function(callback){obj.getClasses(callback)},
				function(callback){obj.getAttributes(callback)},
				function(callback){obj.getRelations(Id,callback)}
			],function(err,results){
				classes = results[0]
				services = results[1]
				relations = results[2]
				var collector =	new coll()
				// rimuovo i marchi ripetuti in relations
				var collected_relations 
				for( i in relations){
					collector.pushElement(relations[i],'tc_clmar_id','tc_mar_id')
				}
				collected_relations = collector.getList() // :: {tc_clmar_id:[tc_mar_id]}
				//console.log()
				var out = []
				/*for (var i=0;i<relations.length;i++){
					cl = find(classes,'tc_clmar_id',relations[i]['tc_clmar_id'])
					classTest = cl.testo
					ser = find(services,'tc_mar_id',relations[i]['tc_mar_id'])
					serTest = ser.testo
					item = {class:classTest,class_id:cl.tc_clmar_id,value:serTest,value_id:ser.tc_mar_id}
					out.push(item)
				}*/
				for (k in collected_relations){
					var item = {}
					cl = k
					clText = find(classes,'tc_clmar_id',k).testo
					values_id = collected_relations[k] // 
					valuesText = []
					// ricavo i valori testo relativi ai tc_mar_id
					for (i in values_id){
						ser = find(services,'tc_mar_id',values_id[i])
						valuesText.push(ser.testo)
					}
					item.class = clText
					item.class_id = cl
					item.values = valuesText
					item.value = valuesText
					item.values_id = values_id
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
	this.census = req.censimento
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
	this.conn = conn
	this.Parameter = new Parameter(req,conn)
	this.Potential = new Potential(req,conn)
	this.Brand = new Brand(req,conn)
}

/**ottiene le liste di attributi da inviare ad anagrafica
 * @param _id ObjectId di pv*/
 function getLists(Id,obj,next){
	 //console.log(obj.Parameter)
	 var conn = this.conn
	 var pv = conn.model('Pv',PvSchema)
		 async.parallel([
				function(callback){obj.Parameter.getAttributesList(Id,obj.Parameter,callback)},
				function(callback){obj.Potential.getPotentialsList(Id,obj.Potential,callback)},
				function(callback){obj.Brand.getBrandsList(Id,obj.Brand,callback)},
				function(callback){ pv.findOne({_id:Id},function(e, pv){callback(e,pv)})}// caricare il pv noninfluisce sui tempi di risposta perchè è più veloce delle altre operazioni
				],function(err,results){
					data = {}
					data.success = true
					data.attributs = {}
					data.attributs.params = {}
					data.attributs.params.data = results[0]
					data.attributs.potentials = {}
					data.attributs.potentials.data = results[1]
					data.attributs.brands = {}
					data.attributs.brands.data = results[2]
					data.pv = results[3]
					next(err,data)})
		}
		
/**ottiene la lista delle classi di parametri, potenziali e marchi di un censimento
 * @method getClasses4Filter
 * @param express request
 * @param Function callback
 * @param istanza di AttributesWrapper
 * @return {success:boolean,parameters: extjs4.model.metmi.attributs,potentials:extjs4.model.metmi.attributs,brands:extjs4.model.metmi.attributs}*/
function getClasses4Filter(req,obj,next){
		async.parallel([
			function(callback){obj.Parameter.getClasses(callback)},
			function(callback){obj.Potential.getClasses(callback)},
			function(callback){obj.Brand.getClasses(callback)}
		],function(err,results){
			var out = {}
			out.success = false
			if(!err){
				//console.log(results[1])
				out.success = true
				out.brands = {}
				out.potentials = {}
				out.parameters = {}
				out.brands.data = results[2]
				out.potentials.data = results[1]
				out.parameters.data = results[0]
				next(null,out)
				}
			else{
			next(err,out)}})
}


/**recupera gli attributi relativi ad una classe
 * @method AWgetAttributs
 * @param istanza di AttributesWrapper
 * @param tc_cl_id id della classe
 * @param family: <'par','pot','mar'>
 * @param Function callback
 * @return mongoose.model.attribut
 * */
 function AWgetAttributs(obj,Id,family,next){
	 tc = {}
	 tc.par = function(Id,next){obj.Parameter.getAttributs(obj.Parameter,Id,next)}
	 tc.pot = function(Id,next){obj.Potential.getAttributs(obj.Potential,Id,next)}
	 tc.mar = function(Id,next){obj.Brand.getBrands(obj.Brand,Id,next)  }
	 
	 tc[family](Id,next)
 }
 /** ottiene tutti gli attributi di un pv
  * @method AWgetAllAttributs
  * @param AttributesWrapper instance
  * @param ObjectId del pv
  * @param callback Function
  * @return {success: true,attributs:{params:{data:[]},potentials:{data:[]},brands:{data:[]}}} */
 function AWgetAllAttributs(self,Id,next){
	 var getParameters = function(id,cb){self.AWgetAttributs(self,id,'par',cb)}
	 var getPotentials = function(id,cb){self.AWgetAttributs(self,id,'pot',cb)}
	 var getbrands = function(id,cb){self.AWgetAttributs(self,id,'mar',cb)}
	 async.parallel([
				 function(callback){getParameters(Id,callback)},
				 function(callback){getPotentials(Id,callback)},
				 function(callback){getbrands(Id,callback)}
			 ],function(err,results){
				 var out = {}
				 out.success = true
				 out.attributs = {}
				 out.attributs.params = {}
				 out.attributs.params.data = results[0]
				 out.attributs.potentials = {}
				 out.attributs.potentials.data = results[1]
				 out.attributs.brands = {}
				 out.attributs.brands.data = results[2]
				 next(null,out)
			 })
	 }
AttributesWrapper.prototype.AWgetAttributs = AWgetAttributs
AttributesWrapper.prototype.AWgetAllAttributs = AWgetAllAttributs
AttributesWrapper.prototype.getLists = getLists
AttributesWrapper.prototype.getClasses4Filter = getClasses4Filter
Potential.prototype.getClasses = getClasses
Potential.prototype.getAttributes = getPotentials
Potential.prototype.getRelations = getRelations
Potential.prototype.getPotentialsList = getPotentialsList
Potential.prototype.getAttributs = getAttributs
Brand.prototype.getClasses = getClasses
Brand.prototype.getAttributes = getParameters
Brand.prototype.getBrandsList = getBrandsList
Brand.prototype.getRelations = getRelations
Brand.prototype.getAttributs = getAttributs
Brand.prototype.getBrands = getBrands
Parameter.prototype.getClasses = getClasses
Parameter.prototype.getRelations = getRelations
Parameter.prototype.getParameters = getParameters
Parameter.prototype.getAttributesList = getParametersList
Parameter.prototype.getAttributs = getAttributs
exports.find = find
exports.Parameter = Parameter
exports.Potential = Potential
exports.Brand = Brand
exports.AttributesWrapper = AttributesWrapper
