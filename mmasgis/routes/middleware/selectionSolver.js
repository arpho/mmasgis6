var tc_istat = require('./tc_istat_id')
var pv = require('../../models/pv')
var async=require('async')
var und = require("underscore");

function getPv(query,censimento,next)
{
	var mongoose = require('mongoose')
	mongoose.disconnect()
	mongoose.connect('localhost',censimento);// switch database to the census 
	pv.find(query,next)
}

function getPvFromId(selezione,censimento,next)
{
	var Pv = []
	for (var i=0;i<selezione.pv.length;i++){Pv.push(selezione.pv[i].id)}
	getPv({pv_id:{$in:Pv}},censimento,function(err,out)
	{
		next(err,out)
	})
}

function getPvFromComune(selezione,censimento,next)
{
	/*@param: [{classe:'comune',id:int}]
@param: String nome censimento*/
	var cod_istat = []
	//console.log('selezione:'+selezione[0].id)
	for (var i=0;i<selezione.comune.length;i++){cod_istat.push(selezione.comune[i].id)}
	getPv({tc_istat_id:{$in:cod_istat}},censimento,function(err,out)
	{
		next(err,out)
	})
}

function getPvFromCap(selezione,censimento,next)
{
	var cap = []
	for ( var i=0;i<selezione.cap.length;i++){cap.push(selezione.cap[i].id)}
	getPv({cap:{$in:cap}},censimento,function(err,out)
	{
		next(err,out)
	})
	
}
function getPvFromProvincia(selezione,censimento,next)
{
	var province = []//selezione.provincia
	console.log('dimensione selezione'+selezione.provincia.length)
	for (var i=0;i<selezione.provincia.length;i++){province.push(selezione.provincia[i].id);/*console.log('@#*'+province[i])*/}
	//console.log('province inviate'+province + Object.prototype.toString.call(province))
	console.log('province inviate')
	console.log(province)
	var istat = []
	var pv_list =[]
	async.series([
		function(callback)
		{
			tc_istat.getIstat(province,function(err,out) // ottengo la lista dei codici istat
			{
				istat = out
				console.log('prima funzione in getPvfromProvincia '+province)
				console.log('istat: '+istat)
				callback(err,out)
				//next(err,out)
			})
		},
		function(callback)
		{
			//console.log('seconda funzione in getPvfromProvincia')
			//console.log('istat: '+istat)
			getPv({tc_istat_id:{$in:istat}},censimento,function(err,out)
				{
					pv_list = out
					//console.log('out'+out)
					callback(null,out)
					
				})
		}
	],function(err,results)
	{
		//console.log('optional function di getPvFromProvincia')
		next(err,results[1])
	})
}
function getPvFromRegione(regioni,censimento,next)
{/*
@param:[{classe:'regione',id:int}]
* @param String nome censimento
*/
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
			//console.log('seconda funzione serie')
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
					mongoose.disconnect()
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
exports.getPvFromComune = getPvFromComune
exports.getPvFromCap = getPvFromCap
exports.getPvFromId = getPvFromId
exports.getPv = getPv
