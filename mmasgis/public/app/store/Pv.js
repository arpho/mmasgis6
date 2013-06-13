
/**
* The Movies store
*/
Ext.define('MMASGIS.store.Pvs', {
extend: 'Ext.data.Store',
autoLoad: true,
autoSync: false,
fields: ['title', 'year'],
proxy: {
		type: 'rest',
		url: '/movies',
		model: 'MMASGIS.model.Pv',
		reader: {
		    type: 'json',
		    root: 'data',
		    successProperty: 'success'
		}
	}
})
