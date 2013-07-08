Ext.namespace('metmi');
Ext.define('Census',
	{
	extend: 'Ext.data.Model',
	idProperty: '_id',
	fields: [
			{
				name : 'censimento',
				type : 'string'
			},
			{
				name: 'label',
				type:'string'
			},
			{
				name : 'date',
				type : 'date'
			}
	],

	proxy : {
		type : 'rest',
		url : 'census/',
		actionMethods: {
					create : 'PUT',
					read   : 'GET',
					update : 'POST',
					destroy: 'DELETE'
				},
		autoload: true,
		reader:{
				type: 'json',
				root: 'data',
				totalProperty: 'total'
			},
	}

	}
	);
