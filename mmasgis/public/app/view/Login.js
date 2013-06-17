function loadData(user){
	/*imposta la visibilità degli elementi della gui*/
	console.log('loadData')
	console.debug(user)
	Ext.get('utenti-button').setVisible(user.isAdmin())
	Ext.get('group_button').setVisible(user.isAdmin())
	
	if (user.isLogged()){
		
		
		if (user.isEnabled()){
			console.log('carico gli store')
			var contact_store = Ext.data.StoreManager.lookup('bbContactsStore')
			contact_store.getProxy().extraParams.session_id = user.user.session_id
			if (!BB.user.user.superuser){
				contact_store.getProxy().extraParams.group_id = user.user.group_id
			}
			console.log('logged user')
			console.log(user)
			console.log('gruppo')
			console.log(BB.user.user.group_id)
			contact_store.load();
			console.debug(Ext.data.StoreManager.lookup('bbContactsStore'))
			var company_store = Ext.data.StoreManager.lookup('bbCompaniesStore')
			company_store.getProxy().extraParams.session_id = user.user.session_id
			if (!BB.user.user.superuser){
				company_store.getProxy().extraParams.group_id = user.user.group_id
			}
			company_store.load();
			Ext.get('utenti-button').setVisible(user.isAdmin())
		}
	}
	
}
function showLogin(store){
	var win = null
	var login = new Ext.FormPanel({
		labelWidth:80,
	url:'data/login/', 
	frame:true, 
	title:'Please Login', 
	defaultType:'textfield',
	monitorValid:true,
				items:[{ 
		fieldLabel:'Username', 
		name:'loginUsername', 
		allowBlank:false 
	    },{ 
		fieldLabel:'Password', 
		name:'loginPassword', 
		inputType:'password', 
		allowBlank:false 
	    }],
				buttons:[{ 
		text:'Login',
		formBind: true,	 
		// Function that fires when user clicks the button 
		handler:function(){ 
									var pwd=login.getForm().findField('loginPassword').getValue()
									var user=login.getForm().findField('loginUsername').getValue()
									//console.debug()
									login.getForm().setValues({'loginPassword':hex_sha1(pwd)})
		    login.getForm().submit({ 
			method:'POST', 
			waitTitle:'Connecting', 
			waitMsg:'Sending data...',
			extraParams:{'loginPassword':hex_sha1(pwd),'loginUsername':user},
 
			// Functions that fire (success or failure) when the server responds. 
			// The one that executes is determined by the 
			// response that comes from login.asp as seen below. The server would 
			// actually respond with valid JSON, 
			// something like: response.write "{ success: true}" or 
			// response.write "{ success: false, errors: { reason: 'Login failed. Try again.' }}" 
			// depending on the logic contained within your server script.
			// If a success occurs, the user is notified with an alert messagebox, 
			// and when they click "OK", they are redirected to whatever page
			// you define as redirect. 
 
			success:function(){ 
				Ext.gritter.add(
														{
															title: 'Benvenuto', 
															text: this.result.user.user
														});
				win.close()
				this.result.user.logged = true // per qualche motivo il server non setta user.logged, lo faccio io
				console.log('result user')
				console.log(this.result.user)
				BB.user = new User(this.result.user)
				console.log('BB.user')
				console.log(BB.user)
				loadData(BB.user)
			//	store.add({user:this.result.user.user,admin:this.result.user.admin,enabled:this.result.user.enabled,logged:this.result.user.logged,superuser:this.result.user.superuser,password:this.result.user.password})
				//store.sync()
				//console.log('store')
				//console.debug(store.last())
			},

			// Failure function, see comment above re: success and failure. 
			// You can see here, if login fails, it throws a messagebox
			// at the user telling him / her as much.  
 
			failure:function(form, action){ 
				if(action.failureType == 'server'){ 
					obj = Ext.util.JSON.decode(action.response.responseText); 
					Ext.Msg.alert('Login Failed!', obj.errors.reason); 
				}else{
					Ext.Msg.alert('Warning!', 'Authentication server is unreachable : ' + action.response.responseText); 
				} 
			    login.getForm().reset(); 
			} 
		    }); 
		} 
	    }] 
	})
	win = new Ext.Window({
					layout:'fit',
					width:300,
					height:150,
					closable: false,
					resizable: false,
					plain: true,
					border: false,
					items: [login]
	});
/*	store.sync()
	var lastUser = store.last()
	console.log('last user')
	console.debug(lastUser.data.logged)
	if (lastUser.data.logged){
		console.log(' ultimoutente loggato '+lastUser.data.user)
		Ext.Msg.alert(' ultimoutenteloggato '+lastUser.data.user)
		var User = Ext.ModelManager.create(lastUser.data,'User')
		console.log('lastUser')
		console.debug(User)
		//BB.user = new User(this.result.user)
	}
	else{
		Ext.Msg.alert(' no logged')
		
	}*/
	win.show();
}
