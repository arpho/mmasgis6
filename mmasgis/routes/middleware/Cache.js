
/*astrae il comportamento di una cache
 * @class Cache
 * @constructor default*/
function Cache(){
this.cache = {}
}
/* ritorna un ogggetto della cache
 * @param key STring
 * @return {success: boolean true se trova l'oggetto, value : se l'oggetto esiste ne ritorna il valore}
 * */
Cache.prototype.getRecord = function(key){
	var out = {}
	out.success = false
	if(key in this.cache){
		out.success = true
		out.value = this.cache[key]
		}
	return out
	}
	
	/*inserisce un nuovo oggetto in cache o ne modifica il valore
	 * @method putRecord
	 * @param key
	 * @param value*/
Cache.prototype.putRecord = function(key,value){
	this.cache[key] = value
	}
exports.Cache = Cache
