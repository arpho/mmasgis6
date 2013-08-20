var mongo = require('mongoskin');
/** implementa Attribute, siinterfaccia al database per ricavare la lista degli attributi di un pv.
 * @param family: specifica il tipo di attributo ricercato <'par','mar','pot'>
 * @param db: censimento a cui collegarsi
 * @param host: host di mongodb
@class Attribute */
function Attribute( family,db,host){
		this.family = family
		this.census = db
		this.host = host
		this.connectionString = this.host+':27017'+'/'+this.census
		this.classe_id = 'tc_cl'+this.family+'_id'
		
	}
	/**
	 * ritorna il documento di tc_cl+family relativo allo id cercato
	 * @param Id: int
	 * @param function: funzione di callback
	 * @method getClass*/
	function getClass( Id,callback){
		class_id = 'tc_cl'+this.family+'_id'
		query = {}
		query[class_id] = Id
		mongo.db(this.connectionString, {safe:false}).collection('tc_cl'+this.family).find(query).toArray(function(err, cl){callback(err,cl)})
	}
	/**
	 * ritorna il documento ditc_family relativo a tc_family_id: cioè il parametro
	 * @method getAttribute
	 * @param Id: tc_family_id
	 * @param function: funzione di callback
	 * */
	function getAttribute(Id,callback){
		field = 'tc_' +this.family+'_id'
		query = {}
		query[field] = Id
		mongo.db(this.connectionString, {safe:false}).collection('tc_par').find(query).toArray(function(err,att){callback(err,att)})
	}
Attribute.prototype.getClass = getClass
Attribute.prototype.getAttribute = getAttribute
exports.Attribute = Attribute
