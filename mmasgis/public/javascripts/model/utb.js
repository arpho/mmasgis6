Ext.namespace('metmi');
Ext.define('utb',
	{
		extend: 'Ext.data.Model',
		fields: [
			{
				name :  'name',
				type : 'string'
			}
		],
	/*proxy : {
		type : 'rest',
		url : 'data/groups/'
	}*/
})
