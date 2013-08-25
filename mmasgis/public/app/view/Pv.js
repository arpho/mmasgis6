var store = null
var totalCount = 0
function showPv(user,selection,censimento,censimento_id){
	/*
	 * mostra la finestra per la scelta del censimento
	 * @param User:  istanza del modello extjs di User che nell'applicazione è memorizzato in metmi.user */
	store = Ext.data.StoreManager.lookup('PvStore')
	
	var myTopToolbar = new Ext.Toolbar({
		items : [ 
				{xtype: 'tbtext', text: totalCount}
			]
	})
	var PvGrid = Ext.create('Ext.grid.Panel',{
		//title: texts.txt5+user.data.nome,
		viewConfig : {
											style : { overflow: 'auto' }
										},
		//tbar: myTopToolbar,
		store: store,
		listeners : {
	
			     itemdblclick: function(dv, record, item, index, e) {
				console.log(PvGrid)
				console.log(record)
				console.log('anagrafica')
							showAnagrafica(PvGrid.store.data.last.value,index,PvGrid,record)
							//console.log(PvGrid.store.data.first.value)
							//console.log(dv)
						}
		},
		columns : [
				{ 
					name: 'potenziale',
					header : texts.txt21b,
					dataIndex : 'potenziale'
				},
				{
					name :  'nome1',
					header : texts.txt8,
					dataIndex : 'nome1',
				},{
					name :  "cap",
					header : texts.txt9,
					dataIndex : 'cap'
				},
				{
					name :  "certificato",
					header : texts.txt10,
					dataIndex : 'certificato'
				},
				{
					name : "cf_pi",
					header : texts.txt11,
					dataIndex : 'cf_pi',
				},
				{
					name : "cliente",
					header : texts.txt12,
					dataIndex : 'cliente',
				},
				{
					name : "cod_cliente",
					header : texts.txt13,
					dataIndex : 'cod_cliente'
				},
				{
					name : "cod_mmas",
					header : texts.txt14,
					dataIndex : 'cod_mmas',
				},
				{
					name : "comune",
					header : texts.txt15,
					dataIndex : 'comune'
				},{
					name : "data_aggiornamento",
					header : texts.txt16,
					dataIndex : "data_aggiornamento",
				},
				{
					name : "email",
					header : 'email',
					dataIndex : 'email'
				},
				{
					name : "fax",
					header : 'fax',
					dataIndex : 'fax'
				},{
					name : "indirizzo",
					header : texts.txt18,
					dataIndex : 'indirizzo'
				},{
					name : "ins_data",
					header : texts.txt19,
					dataIndex : "ins_data"//{ type: Date, default: Date.now },
				},
				{
					name : "ins_utente",
					header : texts.txt20,
					dataIndex : 'ins_utente'
				},
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
					icon : 'images/group.png',
					enabled : false,
					handler: function(){
						//console.log(CensusGrid.getSelectionModel( ).selected.items[0])
						alert(CensusGrid.getSelectionModel( ).selected.items[0].data.censimento)
						console.log(selected)
					}
				},
					{xtype: 'tbtext', text: totalCount}
		]
		}
		]
	})
	PvGrid.on('itemclick', function(grid, rowIndex, columnIndex, e) {
		//console.log('click')
}, this);
	
	PvWindow = Ext.create('Ext.window.Window',{
			title: texts.txt17,
			height: 270,
			width : 1430,
			layout: 'border',
			items: {
								region: 'center',
								layout: 'fit',
								items:PvGrid
							}
	});
	var seen = []
	store.getProxy().extraParams.selection = JSON.stringify(selection)
	store.getProxy().extraParams.censimento = censimento
	store.getProxy().extraParams.censimento_id = censimento_id
	store.load({
		callback : function(records, options, success) {
									totalCount = store.totalCount
									PvGrid.dockedItems.items[1].items.items[1].setText(texts.txt49 +store.totalCount)
								}
		}
		)
		
		console.log(PvGrid)
	
	
	PvWindow.show()
}

