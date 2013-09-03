Ext.define('attribute',
	{
		extend: 'Ext.data.Model',
		fields: [
		{
			name : 'class'
		},
		{
			name : 'values'
		},{
			name : 'values_id'
		},
		{
			name : 'value'
		},{
			name : 'tc_cl_id',
			type : Number
		},{
			name: 'testo' // campo usato per i filtri e per le esportazioni
		},{
			name: 'attribut_id',
			type : Number
		},{
			name : 'selected',
			type : Boolean 
		},{
			name : 'classText'
		}
		]
	})
