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
	console.log("user "+req.param('loginUsername', null))
	console.log("passwd "+req.param('loginPassword', null))
		User.findOne({nome: req.param('loginUsername', null),password: req.param('loginPassword', null)},function(err, user) {
			console.log('login check, callback findOne')
			if (err) {
				console.log('errore')
			return next(err);
			}
			console.log(user)
			if (! user) {
				console.log('!user')
			return res.send({'text':'Not found','success':false,errors:{reason:'wrong user name  and/or password'}}, 200);
			}
			console.log(user)
			user.password ='' //oscuro la password
			req.user = user; // troverò user nelle prossime richieste
			next(user);
		})
	};
module.exports = loadUser;
module.exports = login;
