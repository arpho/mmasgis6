function showCensus(user){
	/*
	 * mostra la finestra per la scelta del censimento
	 * @param User:  istanza del modello extjs di User che nell'applicazione è memorizzato in metmi.user */
	var store = Ext.data.StoreManager.lookup('censusStore')
	var CensusGrid = Ext.create('Ext.grid.Panel',{
		title: texts.txt5+user.nome,
		viewConfig : {
											style : { overflow: 'auto' }
										},
		store: store,
		columns : [
			{
				header: 'censimento',
				dataIndex : 'censimento',
				align : "right", 
				}
			],
		dockedItems:[{
				xtype: 'toolbar',
				//pageSize: pageSize,
				store: Ext.data.StoreManager.lookup('censusStore'),
				dock: 'bottom',
				items:[
				{
					xtype: 'button',
					id: 'selctCensusButton',
					icon : 'images/accept.png',
					handler: function(){
						console.log('accept')
						console.log(CensusGrid.getSelectionModel( ).selected.items[0])
						alert(CensusGrid.getSelectionModel( ).selected.items[0].data.censimento)


					}
				}
				]
		}
		]
	})
	
	CensusGrid.on('itemclick', function(grid, rowIndex, columnIndex, e) {
		console.log('click')
}, this);
	
	CensusWindow = Ext.create('Ext.window.Window',
{
			title: texts.txt5+user.nome,
			height: 170,
			width : 130,
			layout: 'border',
			items: {
								region: 'center',
								layout: 'fit',
								items:CensusGrid
							}

});
store.load()
CensusWindow.show()
}

