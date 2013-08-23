/** insieme di funzionalità di servizio
 * @package Utility*/
 /**esamina una lista di oggetti, li distingue per categoria e crea una lista delle chiavi per ognuno
  * @class Collector*/
  function Collector(){
	  this.list = {}
  }
  /**aggiunge elementi a this.list
   * @method pushElement
   * * @param item
  * *@param field campo di controllo
  * @param key campo usato come chiave
  * */
function pushElement(item,field, key){
	if(item[field] in this.list){
		//console.log('classe '+item[field]+' presente')
		 this.list[item[field]].push(item[key])
		 //this.list
	}
	else{
		//console.log('classe '+item[field]+'  non presente')
		this.list[item[field]] = [item[key]]
	}
}
Collector.prototype.pushElement = pushElement
Collector.prototype.getList = function(){return this.list}
exports.Collector = Collector
