/**
genera le liste che contengono  i parametri disponibili e selezionabili in filterWindow
*@method makeGrid
*@param store
@param header
* @return Ext.grid.Panel
*/
function makeGrid(store,header){
	var grid = Ext.create('Ext.grid.Panel',{
		//title: texts.txt5+user.data.nome,
			viewConfig : {
												style : { overflow: 'auto' }
											},
			//tbar: myTopToolbar,
			store: store,
			columns: [{
				header: header,
				dataIndex:'testo'
			}
			]
		})
	return grid
	}
