Ext.create('Ext.data.Store',{
	model : 'Pv',
	storeId : 'PvStore',
        pageSize: 1000,
        buffered: true,
        totalProperty: 'total'
})
