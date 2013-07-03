
/**
 * Module dependencies.
 **/

var express = require('express')
  , routes = require('./routes')
  , user = require('./routes/user')
  , http = require('http')
  , path = require('path')
  , login = require('./login')
  , census = require('./routes/middleware/census');
var dbURL = 'mongodb://localhost/mmasgis';
var db = require('mongoose')
db.connect('localhost','mmasgis');

var app = express();

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

app.get('/', function(req,res){
    res.redirect('/index.html');
});
app.get('/census',function(req,res){
	//res.send('ciao census',200)
	census(req,res,function(c,res){
		var result = {}
		result.success = true
		result.data = c
		res.send(result,200)
		})
})
app.post('/login',function(req,res){ login.login(req,res)},function(req,res,next){
	
	login.login(req,res,function(req,res){
		console.log('login ended')
		console.log(req.user)
	})
	console.log('credenziali inserite:%j %j',req.param('loginUsername', null), req.param('loginPassword',null))
})
app.get('/users', user.list);

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
