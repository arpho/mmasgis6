var Region = require('../../models/region');
var Provincia = require('../../models/provincia');
var User = require('../../models/user');
function getProvince(regioni,next)
/*
 * ritorna la lista dei cod_pro appartenenti alla lista delle regioni passate
 * @arg regioni:[{classe:'regione',id:int}]
 * @return [int]*/
{
	/*User.find({nome:'me'},function(err,user){
		console.log(user)})*/
	var regioni_id = []
	console.log('getProvince')
	console.log(regioni)
	for (var i=0;i<regioni.length;i++)
	{
		//console.log('inserisco'+regioni[i].id)
		regioni_id.push(Number(regioni[i].id))
		//console.log(regioni_id)
	}
	//console.log(regioni_id)
	//var province = null
	//next('test next prima DI FIND','should be prov')
	console.log('ora provincia.find')
	Provincia.find({codice_regione:{$in:regioni_id}},function(err,province){
		 if (err){console.log('errorre whoosh '+err);
		 console.log('this is callback')
		//next(err,province)
		 }
		if (!province){console.log('trovato nulla')}
		console.log('callback tc_istat_id')
		var out =[]
		for (var i=0;i<province.length;i++)
		{
			out.push(province[i].codice)
		}
		next(err,out)
	 })
	 //next()
	 //console.log('dopo find')
}
exports.getProvince = getProvince

