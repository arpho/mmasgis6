Ext.namespace('metmi');
Ext.define('Pv',
	{
	extend: 'Ext.data.Model',
	idProperty: '_id',
	fields: [
			{
					name: 'pv_id',
					type: 'int'
				},{
					name :  "cap",
				},
				{
					name :  "certificato"
				},
				{
					name : "cf_pi",
				},
				{
					name : "cliente",
					type : 'boolean',
				},
				{
					name : "cod_cliente",
				},
				{
					name : "codice",
				},
				{
					name : "cod_mmas",
					type : 'int',
				},
				{
					name : "comune",
				},
				{
					name : "data_aggiornamento",
					type : "date"//{ type: Date, default: Date.now },
				},
				{
					name : "email",
				},
				{
					name : "fax",
				},
				{
					name :  'potenziale'
				},
				{
					name : "indirizzo",
				},{
					name : "ins_data",
					type : "date"//{ type: Date, default: Date.now },
				},
				{
					name : "ins_utente", 
					type : 'int'
				},
				{
					name : "mod_data",
					type : "date" //{ type: Date, default: Date.now },
				},
				{
					name : "mod_utente",
					type: 'int',
				},
				{
					name : "nome1",
				},
				{
					name : "nome2",
				},
				{
					name : "note",
				},
				{
					name : "pref_mmas",
				},
				{
					name : "provincia",
				},
				{
					name : "pv_id",
					type : "int",
				},
				{
					name : "pv_mt",
					type : 'boolean',
				},
				{
					name : "sito",
				},
				{
					name : "tc_istat_id",
					type : 'int',
				},
				{
					name : "tc_stato_id",
					type : 'boolean',
				},
				{
					name : "tel1",
				},
				{
					name : "tel2",
				},
				{
					name : "tel3",
				},
				{
					name : "owner",
				}
	],

	proxy : {
		type : 'rest',
		url : 'pv/',
		actionMethods: {
					create : 'PUT',
					read   : 'POST',
					update : 'POST',
					destroy: 'DELETE'
				},
		autoload: false,
		reader:{
				type: 'json',
				root: 'data',
				totalProperty: 'total'
			},
	}

	}
	);
