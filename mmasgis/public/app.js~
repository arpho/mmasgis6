/**
 * The MMASGIS application class.
 */
Ext.namespace('metmi');


Ext.onReady(function(){
	//creo l'oggetto utente
	metmi.utente = new User(metmi.user)
	console.log(metmi.utente)
	if (!metmi.utente.isLogged()){
			showLogin()
			console.log('utente non loggato')
		}
})
