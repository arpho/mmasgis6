/**esegue le funzioni comuni alle richieste con filtro e senza filtro
 * @method runPvList
 * @param PvList Object
 * @param express.response
 * @param express.request*/
function runPvList(obj,res,req){
		console.log('setting filter')
		console.log(req.filter)
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
		obj.pvFetcher(obj,req,function(err,out){
			results.data = out[1].data
			results.success = true
			results.total = out[1].count
			console.log('total ='+results.total)
			res.send(results,200)
		})
}
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
  var fabric =  require('./routes/middleware/connectionFactory').ConnectionFactory
  var ConnectionFactory = new fabric()
var pvListFiltered = require('./routes/middleware/obj_pvListFilteredCAP').PvFiltered;
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
//app.get('/parameter
/*app.get('/geo',function(req,res){
	res.redirect('/gmap.html')});*/
	
app.post('/attributs',function(req,res){
	req.censimento = req.body.censimento
	var AW = new aw(req,'localhost')
	var family = req.body.family
	var Id = ObjectId(req.body.pv__id)
	
	AW.getLists(Id,AW,function(e,o){res.send(o,200)})
	//AW.AWgetAllAttributs(AW,cl_id,function(e,o){res.send(o,200)})
})/*
app.get('/geoserver/wms',function(req,res){
	console.log('geoserver/wms');
	//console.log(req.query);
	res.redirect('/localhost:8080/'+req.query,200)})*/
//app.get('/wms',function(req,res){console.log('wms')})
app.post('/classes4Filter',function(req,res){
	req.censimento = req.body.censimento
	var AW = new aw(req,'localhost')
	AW.getClasses4Filter(req,AW,function(e,o){
		res.send(o,200)})
	})
app.post('/filterAttributs',function(req,res){
	data = {}
	var family = req.body.family
//	var Id = ObjectId(req.body.cl_id)
	req.censimento = req.body.censimento
	Id = ObjectId(req.body.pv__id)
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
	var family = req.body.family
	var cl_id = req.body.cl_id
	AW.AWgetAttributs(AW,cl_id,family,function(e,o){res.send(o,200)})
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
	var db;
		//console.time('total time')
		var filtro = false
		console.log(req.body.selection)
		//console.log(req.body.filter)
		req.selection = JSON.parse(req.body.selection)//JSON.parse("[{\"utb\":{\"id\":11,\"classe\":\"regione\"}}]")
		if ( typeof(req.body.filter)!=="undefined"){
			console.log('filtro')
			//richiedo la connessione al censimento
			ConnectionFactory.getConnection(ConnectionFactory,req.body.censimento,function(o){db = o
			obj = new pvListFiltered(req,db)
			})
			//req.filter = JSON.parse(req.body.filter)
			// i filtri non hanno bisogno di parsing sono formati meglio dal client
			console.log('setting filtro')
			console.log(req.body.filter)
			req.filter = req.body.filter
			filtro = true
			
		}
	console.log('richiesti pv filtro: '+filtro)
			runPvList(obj,res,req)
		
		//console.timeEnd('total time')
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
