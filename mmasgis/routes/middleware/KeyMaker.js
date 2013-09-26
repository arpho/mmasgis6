/*genera la chiave usata per archiviare le pv nella cache
@class KeyMaker
* @constructor Object::{censimento,user::{_id,utb_user,utb_customer,filtro}
 */
function KeyMaker(par){

	this.par = par
	this.user = par.user
	this.censimento = par.censimento
	this.selection = JSON.stringify(par.selection)
	this.utb_user = JSON.stringify(this.user.utb_user)
	this.utb_customer = JSON.stringify(this.user.utb_customer)
	this.filter = JSON.stringify(par.filter)
}

//var km = new KeyMaker(data)
KeyMaker.prototype.getKey = function(){
	return 'user:'+this.user._id+','+'censimento:'+this.censimento+','+
	'selection:'+this.selection+','+'utb_user:'+this.utb_user+','+
	'utb_customer:'+this.utb_customer+'filter:'+this.filter
}
exports.KeyMaker = KeyMaker

function FilteredKeyMaker(par){
	//FilteredKeyMaker.prototype = new FilteredKeyMaker(par)
}
FilteredKeyMaker.prototype.constructor = FilteredKeyMaker
exports.FilteredKeyMaker = FilteredKeyMaker
