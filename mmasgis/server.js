
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
  , mongoose = require('mongoose')
  , aw = require('./routes/middleware/Attribute').AttributesWrapper
  , ObjectId = mongoose.Types.ObjectId
  , pvList = require('./routes/middleware/obj_pvList_estesa');
  
//var ;
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
    res.redirect('/gmap.html');
});
/*app.get('/geo',function(req,res){
	res.redirect('/gmap.html')});*/
	
app.post('/classes4Filter',function(req,res){
	console.log('class4Filter')
	console.log('censimento dal client: '+req.body.censimento)
	req.censimento = req.body.censimento
	var AW = new aw(req,'localhost')
	AW.getClasses4Filter(req,AW,function(e,o){
		console.log('risposta 4filter')
		res.send(o,200)})
	})
app.post('/attributs',function(req,res){
	data = {}
	Id = ObjectId(req.body.pv__id)
	req.censimento = req.body.censimento
	//console.log(req.censimento)
	data.success = true
	data.attributs = {}
	data.attributs.params = {}
	data.attributs.params.data = []
	data.attributs.params.data.push({class:'stub',value:'param dal server'})
	data.attributs.brands = {}
	data.attributs.brands.data = []
	data.attributs.brands.data.push({class:'stub',value:'brand dal server'})
	data.attributs.potentials = {}
	data.attributs.potentials.data = []
	data.attributs.potentials.data.push({class:'stub',value:'pot dal server'})
	var AW = new aw(req,'localhost')
	AW.getLists(Id,AW,function(e,o){res.send(o,200)})
	//res.send(data,200)
	})
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
		console.time('total time')
		req.selection = JSON.parse(req.body.selection)//JSON.parse("[{\"utb\":{\"id\":11,\"classe\":\"regione\"}}]")
		var s = req.selection.replace('\\', '')
		var d ={data:s}
		var page = req.body.page
		var limit = req.body.limit
		var start = req.body.start
		req.limit = parseInt(limit)
		req.selection = JSON.parse(d.data)
		req.censimento = req.body.censimento
		req.censimento_id = req.body.censimento_id
		console.log(req.censimento_id)
		req.page = parseInt(req.body.limit)
		req.start =  parseInt(req.body.start)
		var results = {}
		obj.pvFetcher(req,function(err,out){
		results.data = out[1].data
		results.success = true
		results.total = out[1].count
		console.log('total ='+results.total)
		res.send(results,200)
		console.timeEnd('total time')
	})
	
	})
app.post('/login',function(req,res){ login.login(req,res,function(req){
		//console.dir(req)
	// adeguo i campi  di req per pvRetivier
	
	//console.log('credenziali inserite:%j %j',req.param('loginUsername', null), req.param('loginPassword',null))
	/*login.login(req,res,function(req,res){
		console.log('login ended')
		console.log(req.user)
	})*/
	
})})
app.get('/users', function(req,res){res.send({success:true,text:'no user list'},200)});
//app.get('/anagrafica',function(req,res){})
http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
