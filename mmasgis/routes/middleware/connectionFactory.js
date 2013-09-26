MongoClient = require('mongodb').MongoClient;
/**crea connessioni a mongoDb con il driver nativo
 * @class ConnectionFactory
 * @implementa un meccanismo di cache*/
function ConnectionFactory(){
        this.dbs = {}
}

/**ritorna una connessione al database, la crea se non è già stato fatto
 * @method getConnection
 * @param instanza di ConnectionFactory
 * @param string::censimento
 * @param callback
 * @return MongoClient.connection
 * */
 function getConnection(self,censimento,next){
         if (censimento in self.dbs){
                 console.log('cache')
                 next(self.dbs[censimento])
         }
         else{
                 var DB
                 console.log('no cache')
                 MongoClient.connect("mongodb://localhost:27017/"+censimento, function(err, db){
                                                                                                Db = db
                                                                                                self.dbs[censimento] = Db
                                                                                                next(Db)
                                                                                        
                                                                                })
         }
         
 }
ConnectionFactory.prototype.getConnection = getConnection
exports.ConnectionFactory = ConnectionFactory
