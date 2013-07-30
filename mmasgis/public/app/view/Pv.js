var store = null
function showPv(user){
	/*
	 * mostra la finestra per la scelta del censimento
	 * @param User:  istanza del modello extjs di User che nell'applicazione è memorizzato in metmi.user */
	store = Ext.data.StoreManager.lookup('PvStore')
	console.log('user')
	console.log(user)
	console.log('store')
	console.log(store)
	var PvGrid = Ext.create('Ext.grid.Panel',{
		title: texts.txt5+user.data.nome,
		viewConfig : {
											style : { overflow: 'auto' }
										},
		store: store,
		columns : [
			{
				header: 'censimento',
				dataIndex : 'label',
				align : "right", 
				}
			],
		dockedItems:[{
				xtype: 'toolbar',
				//pageSize: pageSize,
				store: store,
				dock: 'bottom',
				items:[
				{
					xtype: 'button',
					//id: 'PvButton',
					icon : 'images/accept.png',
					handler: function(){
						//console.log(CensusGrid.getSelectionModel( ).selected.items[0])
						alert(CensusGrid.getSelectionModel( ).selected.items[0].data.censimento)
						console.log(selected)
					}
				}
		]
		}
		]
	})
	
	PvGrid.on('itemclick', function(grid, rowIndex, columnIndex, e) {
		//console.log('click')
}, this);
	
	PvWindow = Ext.create('Ext.window.Window',{
			title: texts.txt5+user.nome,
			height: 270,
			width : 730,
			layout: 'border',
			items: {
								region: 'center',
								layout: 'fit',
								items:PvGrid
							}
	});
	
	console.log(' end store')
	console.log(store)
	store.load()
	PvWindow.show()
}

