Ext.define("mmasgisRaid.app.view.filterPanel",{
	/** Definisco il trio di grid che costituirà i pannelli della finestra filtri
	 * @param tipo di attributo <'parametri','potenziali','marche'>
	 * @param larghezza pannello
	 * @param altezza pannello
	 * @param store relativo alla classe  degli attributi da caricare*/
	attributsList:[{testo:'stub0',cl:1,id:2},{testo:'stub1',cl:1,id:3}],
	censimento : 'saloni',
	 family: 'stubFamily',
	 title : 'stub',
		width: 600,
		height: 400,
		store: store,
		
	 
	constructor	: function(options){
		Ext.apply(this,options || {});
		//console.log(this.store)
			// normalizzo attributsList, aggiungo il campo selected a tutti i suoi elementi
			for (var i=0;i<this.attributsList.length;i++){
				this.attributsList[i].selected = false
			}
				this.available = {}
				this.selected = []
				this.availableStore 
				this.selectedStore
		},
		getAttributs: function(){
			return this.attributsList
		},
		/**ritorna gli attributi selezionati
		 * @method getSelected
		 * @return [attribut]*/
	getSelected : function(){
			var out = {}
			out.data = []
			for (var i=0;i<this.available.data.length;i++){
				if (this.available.data[i].selected){out.data.push(this.available.data[i])}
			}
		return out
		},// eof getSelected
	refreshGrids : function(tc_cl,obj){
				// distribuisco gli attributi nelle due liste dei selezionati e non 
					/*for (var i = 0;i<available.data.length;i++){
						if (available.data[i].selected){
							selected.data.push(available.data[i])
						}
						else{
							notSelected.data.push(available.data[i])
						}*/
					//aggiorno gli store
					obj.availableStore.reload()
					obj.availableStore.filterBy(function(rec){return ((!rec.data.selected)&&(rec.data.tc_cl_id==tc_cl))})
					obj.selectedStore.reload()
					obj.selectedStore.filterBy(function(r){return (r.data.selected)})
				},
		
	resetPanel : function(){
		for(var i=0;i<this.available.data.length;i++){
			this.available.data[i].selected = false
		}
		},
	getList: function(){return this.available},
	
	getPanel: function(){
			var selected = {} 
			selected.data = []
			var notSelected = {}
			notSelected.data = []
			/** verifica che un array
			contenga oggetti della classe tc_cl
			* @method isClassLoaded
			* @param Array: lista da esaminare
			* @param int: tc_cl_id
			* @return boolean */
			var isClassLoaded = function(l,tc_cl){ 
				var found = false
				for(var i=0;((i<l.length) &&(!found));i++){
					if (l[i].tc_cl_id ==tc_cl){
						found = true
					}
				}
				return found
			}
			var visualizedClass /* memorizza il campo tc_cl_id
			 degli attributi visualizzati da availableStore,
			 *  viene modificato selezionando gli item della prima lista*/
			var available = this.available//this.available // è la lista che contiene tutti
			// gli attributi ottenuti dal server a cui aggiungo
			// il campo selected, contiene tutti gli attributi che vengono caricati dal server 
			/* ad ogni attributo è aggiunto il campo selected
			 *  che permette di discernere cosa è visualizzato
			 *  nella lista degli attributi selezionati e cosa in quella degli attributi selezionabili*/
			 available.data = []
			 
			 //mmasgisRaid.app.view.filterPanel.available.data = []
			this.availableStore = makeStore( available,'data')
			this.selectedStore = makeStore(available,'data')
			var attributsPanel
			var obj  = this // lo uso per passare il riferimento alla classe dentro le funzioni
			 var unselectAttribut = function(Id,family){
				 field = 'tc_'+family+'_id'
				 for (var i=0;i<obj.available.data.length;i++){
					 if (obj.available.data[i]['attribut_id']==Id){
						 obj.available.data[i].selected = false
					}
				}
				 }
			/**
			 * aggiorna le grid del pannello,applicando i filtri sugli store
			 * @param tc_cl_id: int id della classe di parametri da visualizzare in availableStore
			 * @method refreshGrids
			 * */
			 //console.log(this.refreshGrids)
			var refreshGrids = function(tc_cl){
				selected.data = [] // resetto la lista degli attributi selezionati
				notSelected.data = []
				// distribuisco gli attributi nelle due liste dei selezionati e non 
					/*for (var i = 0;i<available.data.length;i++){
						if (available.data[i].selected){
							selected.data.push(available.data[i])
						}
						else{
							notSelected.data.push(available.data[i])
						}*/
					
					//aggiorno gli store
					console.log('refreshGrids')
					this.availableStore.reload()
					this.availableStore.filterBy(function(rec){return ((!rec.data.selected)&&(rec.data.tc_cl_id==tc_cl))})
					this.selectedStore.reload()
					this.selectedStore.filterBy(function(r){return (r.data.selected)})
				}
				var cloj = this.refreshGrids
				refreshGrids = function(tc_cl){ cloj(tc_cl,obj)}
			var classesGrid = makeGrid(this.store,texts.txt57)/*Ext.create('Ext.grid.Panel',{
		//title: texts.txt5+user.data.nome,
			viewConfig : {
												style : { overflow: 'auto' }
											},
			//tbar: myTopToolbar,
			store: this.store,
			columns: [{
				header: texts.txt57,
				dataIndex:'testo'
			}
			]
		})*/
		
			var attributsPanel = Ext.create('Ext.panel.Panel', {
		title: this.title,
		width: this.width,
		height: this.height,
		
		layout: {
			type: 'hbox', // Arrange child items vertically
			align: 'stretch', // Each takes up full width
			//padding: 5
		},

		
		items : [
		{
			xtype: 'grid',
			columns: [
			{
				header: texts.txt57,
				dataIndex:'testo',
				
				},{
					xtype: 'actioncolumn',
					width: 30,
					items: [{
							header: texts.txt59,
							tooltip: texts.txt60,
							icon:  'images/accept.png',
							handler: function(grid, rowIndex, colindex){//console.log(grid.getStore().data.items[rowIndex])
								var item = grid.getStore().data.items[rowIndex].data
								if(!isClassLoaded(available.data,item.tc_cl_id)){ // implemento un meccanismo di cache per le classi già caricate
									Ext.Ajax.request({
										url : 'attributs/',
										method : 'POST',
										params :{
												censimento : metmi.censimento.census,
												family : item.class,
												cl_id : item.tc_cl_id
											},
										success : function(response, opts) {
													var obj = Ext.decode(response.responseText);
													for (var i=0;i<obj.length;i++){
														// normalizzo gli item
														obj[i].selected = false
														var clField = 'tc_cl'+item.class+'_id'
														var field = 'tc_'+item.class+'_id'
														obj[i].classText = item.testo
														obj[i].tc_cl_id = item.tc_cl_id//obj[i][clField]
														obj[i].attribut_id = obj[i][field]
														obj[i].class = item.class
														visualizedClass = item.tc_cl_id//obj[i][clField]
													}
													available.data = available.data.concat(obj)
													//availableStore.reload()
													refreshGrids(visualizedClass)
												}
									}) //eof ajax
								}
								else{
									console.log('cache ok')
									visualizedClass = item.tc_cl_id
								refreshGrids(visualizedClass)
									}
							}
						}
						]
				}
			],
			listeners:{
					itemdblclick: function(dv, record, item, index, e) {
					}
				},
			store: this.store,//Ext.create('Ext.data.ArrayStore', {}), // A dummy empty data store
			flex: 1
		},{
			xtype: 'grid',
			columns:[
				{
					header: texts.txt61,
					dataIndex: 'testo'
				},{
					xtype: 'actioncolumn',
					width: 30,
					items: [{
							header: texts.txt62,
							icon : 'images/add.png',
							tooltip : texts.txt63,
							handler : function(grid, rowIndex, colindex){
								var storeItem = grid.getStore().data.items[rowIndex]
								//seleziono lo item
								for (var i=0;i<available.data.length;i++){
									if ((obj.available.data[i].attribut_id ==storeItem.data.attribut_id) &&(obj.available.data[i].tc_cl_id ==storeItem.data.tc_cl_id)){
										obj.available.data[i].selected = true
									}
								}
								//available.data[rowIndex].selected = true
								//console.log(available.data[rowIndex])
								refreshGrids(visualizedClass)
								}
							}]
				}
				
				],
					store: this.availableStore,
					flex : 1 
		},{
			xtype : 'grid',
			columns : [
					{
						header : texts.txt66,
						dataIndex : 'testo',
						renderer : function(value,rec){
							var text = rec.record.data.classText//+':'+value
							out = text.split(" ")
							result = ""
							for (var i=0;i<out.length;i++){
								result += out[i].slice(0,3)+'.' //tronco le parole della classe al terzo carattere
							}
							result += ': '+value
							return result}
					},{
						xtype: 'actioncolumn',
						items : [{
								header : 'rimuovi',
								icon : 'images/delete.png',
								tooltip : texts.txt67,
								handler : function(grid, rowIndex, colindex){
									var item = grid.getStore().data.items[rowIndex]
									unselectAttribut(item.data.attribut_id,item.data.class)
									refreshGrids(visualizedClass)
								}
							}
							]
					}
				],
			store : this.selectedStore,
			flex: 1
		}
		
		]
	})//eof create panel
	// aggiungo il listener alla grid delle classi
		var classesGrid = attributsPanel.items.items[0]
		/*classesGrid.on({
	click: function() { console.log('click'); }
		})*/
		attributsPanel.stubArpho = function(){}
		return attributsPanel
	} //eof getpanel
	}) //eof define
	 

