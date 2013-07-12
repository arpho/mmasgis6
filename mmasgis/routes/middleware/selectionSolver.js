var tc_istat = require('./tc_istat_id')
var pv = require('../../models/pv')
var async=require('async')
var und = require("underscore");

function getPv(query,censimento,next)
{
	var mongoose = require('mongoose')
	mongoose.connection.close()
	mongoose.connect('localhost',censimento);// switch database to the census
	pv.find(query,next)
}

function getPvFromProvincia(selezione,censimento,next)
{
	var province = []//selezione.provincia
	//console.log('dimensione selezione'+selezione.provincia.length)
	for (var i=0;i<selezione.provincia.length;i++){province.push(selezione.provincia[i].id);console.log('@#*'+province[i])}
	console.log('province inviate'+province + Object.prototype.toString.call(province))
	var istat = []
	var pv_list =[]
	async.series([
		function(callback)
		{
			tc_istat.getIstat(province,function(err,out) // ottengo la lista dei codici istat
			{
				istat = out
				console.log('prima funzione in getPvfromProvincia '+province)
				//console.log('istat: '+istat)
				callback(err,out)
				//next(err,out)
			})
		},
		function(callback)
		{
			console.log('seconda funzione in getPvfromProvincia')
			//console.log('istat: '+istat)
			getPv({tc_istat_id:{$in:istat}},censimento,function(err,out)
				{
					pv_list = out
					//console.log('out'+out)
					callback(err,out)
					
				})
		}
	],function(err,results)
	{
		console.log('optional function di getPvFromProvincia')
		next(err,results[1])
	})
}
function getPvFromRegione(regioni,censimento,next)
{
	//var next = next
	var province = []
	var istat = []
	var pv_list = []
	/*ritorna i pv residenti in una lista di regioni*/
	async.series([
			function(callback)
			{
						tc_istat.getProvince(regioni,function(err,out) //ottengo la lista delle province
						{
							province = out
							callback(err,out)
						})
			},
		function(callback)
		{
			console.log('seconda funzione serie')
			//console.log(province)
			tc_istat.getIstat(province,function(err,out) // ottengola lista dei codici istat
			{
				istat = out
				callback(err,out)
				next(err,out)
			})
		},
		function(callback)
		{
			getPv({tc_istat_id:{$in:istat}},censimento,function(err,out)
				{
					pv_list = out
					callback(err,out)
					
				})
		}
		
	], function(err,results)
	{
		//console.log('optional function')
		//console.log(pv_list)
		next(err,pv_list)
	})
}
function getPvList(req,res,selection,censimento,next){
	getPvFromRegione(selection.regione,censimento,next)
}
exports.getPvList = getPvList
exports.getPvFromProvincia = getPvFromProvincia
