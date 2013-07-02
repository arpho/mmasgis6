Ext.namespace('metmi');
Ext.define('user',
	{
		extend: 'Ext.data.Model',
		fields: [
			{
				name :  '_id',
				type : 'string'
			},
			{
				name:'cliente_id',
				type : 'string'
			},
			{
				name: 'nazione',
				type : 'string'
			},
			{ 
				name:'enabled'
			},
			{ 
				name:'nome',
				type : 'string'
			},
			{
				name: 'utb',
				type : 'auto'
			},
			{
				name: 'funzionalità',
				type : 'auto'
			}
		],
		getLocals : function(){
			return this.data.nazione
		},
		getName : function(){
			return this.data.nome
		}
	/*proxy : 
		type : 'rest',
		url : 'data/groups/'
	}*/
})
