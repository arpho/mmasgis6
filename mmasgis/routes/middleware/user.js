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
		User.findOne({$and:[{nome: req.param('loginUsername', null)},{password: req.param('loginPassword', null)}]},function(err, user) {
			if (err) {
			return next(err);
			}
			if (! user) {
			return res.send('Not found', 404);
			}
			user.password ='' //oscuro la password
			req.user = user; // troverò user nelle prossime richieste
			next();
		})
	};
exports.loadUser = loadUser;
exports.login = login;
