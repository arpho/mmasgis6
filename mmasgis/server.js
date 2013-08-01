
/**
 * Module dependencies.
 **/
var express = require('express')
  , routes = require('./routes')
  , user = require('./routes/user')
  , http = require('http')
  , path = require('path')
  , login = require('./login')
  , census = require('./routes/middleware/census')
  , pvList = require('./routes/middleware/obj_pvList_estesa');
var obj = new pvList.obj2(null) 
var dbURL = 'mongodb://localhost/mmasgis';
var db = require('mongoose')
db.connect('localhost','mmasgis');

var app = express();
app.use(express.cookieParser());
app.use(express.session({secret: '1234567890QWERTY'}));

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
	console.time('all jobs');
	census(req,res,function(c,res){
		var result = {}
		result.success = true
		result.data = c
		res.send(result,200)
		})
		console.timeEnd('all jobs');
})
app.post('/pv',function(req,res){
		console.time('total')
		//req.session.user = req.user
		console.log('@selection in /pv')
		console.log('req.body')
		console.log(req.body.selection+'request')
		console.log("[{\"utb\":{\"id\":11,\"classe\":\"regione\"}}]"+'test')
		req.selection = JSON.parse(req.body.selection)//JSON.parse("[{\"utb\":{\"id\":11,\"classe\":\"regione\"}}]")
		var s = req.selection.replace('\\', '')
		var d ={data:s}
		console.log('data')
		console.log(d)
		req.selection = JSON.parse(d.data)
		console.log('itemzero')
		console.log(req.selection[0])
		console.log('@selection parsed^2 in /pv')
		console.log(req.selection)
		req.censimento = req.body.censimento
		req.page = req.body.limit
		req.start = req.body.limit * req.body.start
		var results = {}
		obj.pvFetcher(req,function(err,out){
		console.log(out[1].data.length)
		results.data = out[1].data
		results.success = true
		results.total = out[1].count
		console.log('total ='+results.total)
		return res.send(results,200)
		console.timeEnd('total')
	})
	
	})
app.post('/login',function(req,res){ login.login(req,res,function(req){
		console.dir(req)
	console.log('login ended')
	// adeguo i campi  di req per pvRetivier
	
	//console.log('credenziali inserite:%j %j',req.param('loginUsername', null), req.param('loginPassword',null))
	/*login.login(req,res,function(req,res){
		console.log('login ended')
		console.log(req.user)
	})*/
	
})})
app.get('/users', user.list);

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
