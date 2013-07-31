function selectionNormalizer(selection){
	/*normalizza la lista delle utb selezionate eliminando  il campo layers che no permette la codifica json
	 * #method {selectionNormalizer}
	 * @param {object}:: {utbs:[utb]}
	 * @return {object}::{utbs:[utb]}
	 * @note utb::{id:int,classe:<'regione','comune','provincia','cap'>*/
	var out = []
	for (var i=0;i<selection.utbs.length;i++){
		var item = {}
		var utb = {}
		utb.id = selection.utbs[i].id
		utb.classe = selection.utbs[i].classe
		item.utb = utb
		out.push(item)
		}
	return out
	}
function showCensus(user){
	/*
	 * mostra la finestra per la scelta del censimento
	 * @param User:  istanza del modello extjs di User che nell'applicazione è memorizzato in metmi.user */
	var store = Ext.data.StoreManager.lookup('censusStore')
	var CensusGrid = Ext.create('Ext.grid.Panel',{
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
				store: Ext.data.StoreManager.lookup('censusStore'),
				dock: 'bottom',
				items:[
				{
					xtype: 'button',
					id: 'selectCensusButton',
					icon : 'images/accept.png',
					handler: function(){
						//console.log(CensusGrid.getSelectionModel( ).selected.items[0])
						//alert(CensusGrid.getSelectionModel( ).selected.items[0].data.censimento)
						items = CensusGrid.getSelectionModel().getSelection()
						
						if (items.length==0){
							alert(texts.txt28)
						}
						else{
							console.log('raw selection')
							console.log(selected)
							var s = selectionNormalizer(selected)
							console.log('normalized selection')
							console.log(s)
							showPv(user,Ext.JSON.encode(s),items[0].data.censimento)
						}


					}
				}
				]
		}
		]
	})
	
	CensusGrid.on('itemclick', function(grid, rowIndex, columnIndex, e) {
		//console.log('click')
}, this);
	
	CensusWindow = Ext.create('Ext.window.Window',
{
			title: texts.txt5+user.data.nome,
			height: 170,
			width : 230,
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

