var Region = require('../../models/region');
var Provincia = require('../../models/provincia');
function getProvince(regioni,next)
/*
 * ritorna la lista dei cod_pro appartenenti alla lista delle regioni passate
 * @arg regioni:[{classe:'regione',id:int}]
 * @return [int]*/
{
	var regioni_id = []
	console.log('getProvince')
	console.log(regioni)
	for (var i=0;i<regioni.length;i++)
	{
		//console.log('inserisco'+regioni[i].id)
		regioni_id.push(Number(regioni[i].id))
		//console.log(regioni_id)
	}
	console.log(regioni_id)
	var province = null
	Provincia.find({codice_regione:'p'},function(err,province){
		 if (err){console.log('errorre whoosh '+err);
		 return next(err,province)
		 }
		 if (!province){console.log('trovato nulla')}
		 console.log('callback tc_istat_id')
		 return next(err,province)
	 })
	 //next()
	 //console.log('dopo find')
}
exports.getProvince = getProvince

