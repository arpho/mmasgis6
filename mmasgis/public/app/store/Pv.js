Ext.create('Ext.data.Store',{
	model : 'Pv',
	storeId : 'PvStore',
        pageSize: 200,
        buffered: true,
        purgePageCount:0,
        totalProperty: 'total'
})
