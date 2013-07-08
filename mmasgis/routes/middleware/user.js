var User = require('../../models/user');
function loadUser(req, res, next) {
	User.findOne({nome: req.params.name}, function(err, user) {
	if (err) {
	return next(err);
	}
	if (! user) {
	return res.send('Not found', 404);
	}
	req.user = user;
	next();
	});
}

function login(req,res,next){
		User.findOne({nome: req.param('loginUsername', null),password: req.param('loginPassword', null)},function(err, user) {
			//console.log('login check, callback findOne')
			if (err) {
				console.log('errore')
			return next(err);
			}
			if (! user) {
				console.log('not found user')
			return res.send({'text':'Not found','success':false,errors:{reason:'wrong user name  and/or password'}}, 200);
			}
			user.password ='' //oscuro la password
			user.logged = true
			//user.last_login = new Date()
			req.user = user; // troverò user nelle prossime richieste
			next(req);
			//console.log(req.user)
			return res.send({'text':'found','success':true,'user':user}, 200)
		})
	};
module.exports = loadUser;
module.exports = login;
