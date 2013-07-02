Ext.namespace('BB');
Ext.define('User',
	{
	extend: 'Ext.data.Model',
	fields: [
			{
				name : 'id',
				type : 'string'
			},
			{
				name : 'user',
				type : 'string'
			},
			{
				name : 'logged',
				type : 'boolean'
			},
			{
				name : 'superuser',
				type : 'boolean'
			},
			{
				name : 'enabled',
				type : 'boolean'
			},
			{
				name : 'logged_in',
				type : 'date'
			},
			{
				name : 'nazione',
				type : 'string'
			},
			{
				name : 'cliente_id'
			},
			{
				name : 'session_id'
			},
			{
				name : 'group'
			}
    ],
    isLogged: function(){
				return this.data.logged
    },
    isEnabled: function(){
				return this.enabled
	},
    proxy : {
        type : 'rest',
        url : 'users/'
    }

	}
	);
