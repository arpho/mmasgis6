var Census = require('../../models/census');
var async=require('async')
var user = require('../../models/user')
var customer = require('../../models/cliente')
var und = require("underscore");

function list(req,res,next){
	/*console.log('********************************************************************************************')
	console.log(req.session.user)
	console.log('********************************************************************************************')
	console.log("censimento_id in user "+req.session.user.censimenti_id)*/
	var census_list =[]
	async.parallel([function (callback){
				user.findOne({"_id":req.session.user._id},function(err,user){callback(null,user)})
				//callback()
				return user
			},
			function(callback){
				customer.findOne({"_id":req.session.user.cliente_id},function(err,customer)
				{callback(null,customer)})
				//callback()
				return customer
			}
			],
			function(err,results){
				//console.log(locals)
				//console.log('do something else upon completion of p1 and p2 '+locals.user);
				//console.log('results=%j', results);
				census_list = und.intersection(results[0].censimenti_id,results[1].censimenti_id)
				//console.log('censimento_id: '+census_list)
				Census.find({"_id":{$in:census_list}},function(err,census){
					if (err) {
						return next(err,res);
						}
						if (! census) {
						return res.send('Not found', 404);
						}
						next(census,res)
								
				})
			})
	}
module.exports = list
