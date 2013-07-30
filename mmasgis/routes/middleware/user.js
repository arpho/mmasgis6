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
		User.findOne({nome: req.param('loginUsername', null),password: req.param('loginPassword', null),enabled:true},function(err, user) {
			//console.log('login check, callback findOne')
			if (err) {
				console.log('errore')
			return next(err);
			}
			if (! user) {
				console.log('not found user')
			return res.send({'text':'Not found','success':false,errors:{reason:'wrong user name  and/or password, or you are not enabled'}}, 200);
			}
			user.password ='' //oscuro la password
			user.logged = true
			console.log('language: '+req.headers["accept-language"][0]+req.headers["accept-language"][1]) //console.log(Ext.get('html')[0].getAttribute('lang'))
			//user.last_login = new Date()
			req.session.user =  req.user = user; // troverò user nelle prossime richieste
			next(req);
			//console.log(req.user)
			return res.send({'text':'found','success':true,'user':user}, 200)
		})
	};
module.exports = loadUser;
module.exports = login;
