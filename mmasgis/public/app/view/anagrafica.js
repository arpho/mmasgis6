/**
 * ritornalo statodicertificazione dello item
 * @method certificazione
 * 
 * @param item Pv
 * @return String
 * */
 //var getAttributes = function(Id)
function certificazione(item){
	var out
	if (item.certificato && item.pv_mt){out = 'certificato'}
	if ( ! item.certificato && item.pv_mt){out = 'non verificato'}
	if (! item.certificato && ! item.pv_mt){out = 'inserita'}
	//console.log('certificazione: '+out)
	return out
	}
function showAnagrafica(data,index,grid,record){
	var anagraficaWindow
	var parameters_store
	var potentials_store
	var brands_store
	var params = {}
	console.log(index)
	params.data = []
	params.data.push({class:'stub param ',value:'stub di anagrafica'})
	var potentials = {}
	potentials.data = []
	potentials.data.push({class:'stub pot ',value:'stub da anagrafica'})
	var brands = {}
	brands.data = []
	brands.data.push({class:'stub brand',value:'stub da anagrafica'})
	var item = record
	console.log('item')
	console.log(item)
	var getAttributes = function (Id){
		var out
		console.log(metmi.censimento)
		console.log(Id)
		Ext.Ajax.request({
					url : 'attributs/',
					method : 'POST',
					params : {
							pv__id : Id,
							censimento : metmi.censimento.census},
					success: function(response, opts) {
						var obj = Ext.decode(response.responseText);
						console.dir(obj.attributs.params);
						params.data = obj.attributs.params.data
						potentials.data = obj.attributs.potentials.data
						brands.data = obj.attributs.brands.data
						parameters_store.reload()
						potentials_store.reload()
						brands_store.reload()
						console.log(brands_store)
					}
			})
	}//
	//att.seeParameters()
	getAttributes(item.data._id)
	console.log(getAttributes)
	var myTopToolbar = new Ext.Toolbar({
        items : [ 
			{
			    xtype: 'button',
							icon: 'images/first16.png',
							id: 'firstButton',
							handler: function(){
									index = 0
									grid.getSelectionModel().select(index)
									item = data[0]
									getAttributes(item.data._id)
									item.data.certificazione = certificazione(item.data) 
									anagraficaWindow.items.items[1].items.items[0].items.items[3].items.items[0].setValue(item.data.value)
									formPanel.getForm().setValues(item.data)
								}
			},
		{
			xtype: 'button',
						icon: 'images/back16.png',
						//id: 'firstButton',
							handler: function(){
									index -= 1
									grid.getSelectionModel().select(index)
									item = data[index]
									getAttributes(item.data._id)
									item.data.certificazione = certificazione(item.data)  
									anagraficaWindow.items.items[1].items.items[0].items.items[3].items.items[0].setValue(item.data.value)
									formPanel.getForm().setValues(item.data)
								}
		},
		{
			    xtype: 'button',
							icon: 'images/next16.png',
							handler: function(){
									index += 1
									grid.getSelectionModel().select(index)
									item = data[index]
									console.log(item)
									getAttributes(item.data._id)
									item.data.certificazione = certificazione(item.data) 
									anagraficaWindow.items.items[1].items.items[0].items.items[3].items.items[0].setValue(item.data.value)
									formPanel.getForm().setValues(item.data)
								}
							//id: 'firstButton'
			},
		/*{
			xtype: 'button',
						icon: 'images/last16.png',
						//id: 'firstButton',
							handler: function(){
									index = data.length-1
									item = data[0]
									formPanel.getForm().setValues(item.data)
								}
		}*/
            //editBtn
        ]
	})
	var formPanel = Ext.create('Ext.form.Panel',{
	    //title: 'Anagrafica ',

	    //renderTo: Ext.getBody(),
			style: 'margin: 1px',
			height: 200,
			width : 1100,
			items : [{
						xtype: 'container',
						layout: 'hbox',
						items: [
								{
												xtype: 'textfield',
												fieldLabel: texts.txt29, 
												name: 'cod_mmas',
												labelAlign: 'left',
												cls : 'rounded-input',
												flex: 1
								},
								,{
									xtype:'checkboxfield',
									fieldLabel:texts.txt30,
									name: 'cliente',
									labelAlign: 'left',
									cls: 'field-margin',
								},
								{
												xtype: 'textfield',
												fieldLabel: texts.txt31, 
												name: 'cod_cliente',
												labelAlign: 'left',
												cls : 'rounded-input',
												flex: 1
								},
								{
												xtype: 'textfield',
												fieldLabel: texts.txt32, 
												name: 'potenziale',
												labelAlign: 'left',
												cls : 'rounded-input',
												flex: 1
								}
							]
				},{
						xtype: 'container',
						layout: 'hbox',
						items: [
								{
												xtype: 'textfield',
												fieldLabel: texts.txt33, 
												name: 'nome1',
												labelAlign: 'left',
												cls : 'rounded-input',
												flex: 3
								}
						]
								},{
						xtype: 'container',
						layout: 'hbox',
						items: [
								{
												xtype: 'textfield',
												fieldLabel: texts.txt35, 
												name: 'nome2',
												labelAlign: 'left',
												cls : 'rounded-input',
												flex: 3
								},
								{
												xtype: 'textfield',
												fieldLabel: texts.txt34, 
												name: 'cf_pi',
												labelAlign: 'left',
												cls : 'rounded-input',
												flex: 1
								}
						]
				},{
						xtype: 'container',
						layout: 'hbox',
						items: [
								{
												xtype: 'textfield',
												fieldLabel: texts.txt36, 
												name: 'indirizzo',
												labelAlign: 'left',
												cls : 'rounded-input',
												flex: 3
								}
						]
				},{
						xtype: 'container',
						layout: 'hbox',
						items: [
								{
												xtype: 'textfield',
												fieldLabel: texts.txt37, 
												name: 'comune',
												labelAlign: 'left',
												cls : 'rounded-input',
												flex: 3
								},
								{
												xtype: 'textfield',
												fieldLabel: texts.txt38, 
												name: 'provincia',
												labelAlign: 'left',
												cls : 'rounded-input',
												flex: 1
								},
								{
												xtype: 'textfield',
												fieldLabel: texts.txt39, 
												name: 'cap',
												labelAlign: 'left',
												cls : 'rounded-input',
												flex: 1
								}
						]
				},{
						xtype: 'container',
						layout: 'hbox',
						items: [
								{
												xtype: 'textfield',
												fieldLabel: texts.txt40, 
												name: 'telefono1',
												labelAlign: 'left',
												cls: 'field-margin',
												cls : 'rounded-input',
												flex: 3
								},
								{
												xtype: 'textfield',
												name: 'telefono2',
												labelAlign: 'left',
												cls: 'field-margin',
												cls : 'rounded-input',
												flex: 1
								},
								{
												xtype: 'textfield',
												name: 'telefono3',
												labelAlign: 'left',
												cls: 'field-margin',
												cls : 'rounded-input',
												flex: 1
								},
								{
												xtype: 'textfield',
												name: 'fax',
												fieldLabel: 'Fax',
												labelAlign: 'left',
												cls : 'rounded-input',
												flex: 1
								}
						]
				},{
						xtype: 'container',
						layout: 'hbox',
						items: [
							{
												xtype: 'textfield',
												name: 'email',
												fieldLabel: 'email',
												labelAlign: 'left',
												cls : 'rounded-input',
												flex: 1
								},{
												xtype: 'textfield',
												name: 'sito',
												fieldLabel: texts.txt41,
												labelAlign: 'left',
												cls : 'rounded-input',
												flex: 1
								}
						]
				},{
						xtype: 'container',
						layout: 'hbox',
						items: [{
												xtype: 'textfield',
												name: 'certificazione',
												fieldLabel: texts.txt42,
												labelAlign: 'left',
												cls : 'rounded-input',
												flex: 1
								},{
												xtype: 'textfield',
												name: 'data_aqggiornamento',
												fieldLabel: texts.txt43,
												labelAlign: 'left',
												cls : 'rounded-input',
												flex: 1
								}
						
						]
				}
			]

	})
	item.data.certificazione = certificazione(item.data)
	 parameters_store = makeStore(params,'data')
//console.log(parameters_store)
potentials_store = makeStore(potentials,'data')
brands_store = makeStore(brands,'data')
brands_grid = Ext.create("mmasgisRaid.app.view.AnagraphicGrid",{
		attributeText: texts.txt47,
		title : texts.txt47,
		store : brands_store,
		classText : texts.txt51,
	}).getGrid()

/*
var column = Ext.create('Ext.grid.column.Column', {xtype: 'actioncolumn',
				//width: 20,
				items: [{
			header:'Rimuovi',
					icon: 'images/delete.png',
					handler: function(grid, rowIndex, colindex) {console.log('dettagli')}}]});
console.log(column)
conbrands_grid.headerCt.grid.columns//.push(column)
console.log(brands_grid.headerCt)*/
brands_grid.on({cellClick : function(grid,row,column,e){console.log(e.data.values);console.log(e.data.values_id)}})
console.log(item.data)
	 formPanel.getForm().setValues(item.data)
	var tab = Ext.create('Ext.tab.Panel', {
    width: 1100,
    height: 200,
    activeTab: 0,
    items: [
        {// inserisco la grid dei parametri
            title: texts.txt45,
            items: Ext.create("mmasgisRaid.app.view.AnagraphicGrid",{
		attributeText: texts.txt45,
		title : texts.txt45,
		classText : texts.txt52,
		store : parameters_store
	}).getGrid()
        },
        {
            title: texts.txt46,
            items: 
		{// inserisco la grid dei potenziali
		    bodyPadding: 0,
		    items: Ext.create("mmasgisRaid.app.view.AnagraphicGrid",{
		attributeText: texts.txt54,
		title : texts.txt46,
		store : potentials_store,
		classText : texts.txt53,
	}).getGrid()
		}
        },
        { // inserisco la grid delle marche
            title: texts.txt47,
		    bodyPadding: 0,
		    items: brands_grid
        },
        {
            title: texts.txt48,
            items: [
		{ 
			xtype     : 'textareafield',
			grow      : true,
			name      : 'note',
			value : item.data.note,
			//fieldLabel: texts.txt48,
			anchor    : '100%'
		}
    ]
        }
    ],
    renderTo : Ext.getBody()
}); 
	anagraficaWindow = Ext.create('Ext.window.Window',
	{
		title: texts.txt55,
		tbar : myTopToolbar,
		height: 450,
		width:1114,
    layout: 'border',
    items:[ {
							region: 'center',
							items:formPanel
						},
						{
							region:'south',
							items:tab
						}
						]
	}
	);
	anagraficaWindow.show();
}
