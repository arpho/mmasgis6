Ext.namespace('metmi');
var texts = {}
var selected = {}
var metmi = {}
metmi.censimento = null
metmi.wms_ip = 'localhost'
metmi.user = {
		'user': 'system',
		'logged': true,
		'enabled': true,
		'logged': false,
		cliente_id: '51bec492bb6a95360d2b8c47' //renault
	};
var map,
regioni,
comuni,
province,
cap;
var layerBlank;
