var Census = require('../../models/census');

function list(req,res,next){
		Census.find({},function(err,census){
			if (err) {
		return next(err,res);
		}
		if (! census) {
		return res.send('Not found', 404);
		}
		next(census,res)
			})
	}
module.exports = list
