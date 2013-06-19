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
			//console.log('login check, callback findOne')
			if (err) {
				console.log('errore')
			return next(err);
			}
			if (! user) {
				console.log('!user')
				var result = {}
				result.success = false
				result.errors = {reason:'login fallito! Prova ancora'}
				result.text = 'Not Found'
			return res.send(result, 200);
			}
			user.password ='' //oscuro la password
			req.user = user; // troverò user nelle prossime richieste
			var response = {}
			response.success = true
			user.last_login = new Date()
			console.log(new Date())
			response.user = user
			console.log('utente %s verificato',user.nome)
			res.send(response,200);
		})
	};
module.exports = loadUser;
module.exports = login;
