Ext.namespace('metmi');
Ext.QuickTips.init();

 selected.utbs = []
var locals ={}
locals.it = it
var layers = {}

Ext.define('utb',
	{
		extend: 'Ext.data.Model',
		fields: [
			{
				name :  'id',
				type : 'string'
			},
			{
				name:'classe'
			},
			{
				name: 'tag'
			},
			{ 
				name:'subtag'
			},
			{ 
				name:'nome'
			}
		],
	/*proxy : {
		type : 'rest',
		url : 'data/groups/'
	}*/
})
var utb_store = Ext.create('Ext.data.Store',
			{
	storeId: 'metmiUtbStore',
	model:'utb',
	data: selected,
	proxy: {
		type: 'memory',
		reader: {
			type: 'json',
			root: 'utbs'
		}
}})
Ext.define('My.view.Contact', {
	extend: 'Ext.form.Panel',
	title: 'Contact',
	renderTo: Ext.getBody(),
	items: [{
		xtype: 'textfield',
		fieldLabel: 'Name',
		name: 'name',
		allowBlank: false
	}],
	buttons: [{
		xtype: 'button',
		text: 'Save',
		action: 'save',
		formBind: true

	}]
});


Ext.define('My.controller.Contact', {
	extend: 'Ext.app.Controller',
	views: ['Contact'],

	init: function () {
		this.control({
			'viewport > #mainContent': { //search by ID
				render: this.onMainReady
			},
			'viewport #CreateButton': { //search by ID
				click: this.create
			},
			'[action=save]': { //any save button
				click: this.saveClick
			}
		});
	},

	saveClick: function (button) {
		var panel = button.up('form');
		var form = panel.getForm();
		var record = form.getRecord();
		form.updateRecord(record);

		console.log(record.get('name'));

	},

	create: function () {
		var main = Ext.ComponentQuery.query('#mainContent')[0];
		var contact = Ext.create('My.model.Contact');

		var panel = this.getView('Contact').create();
		var form = panel.getForm();

		form.loadRecord(contact);
		main.add(panel);
	},

	onMainReady: function () {
		console.log('do something');
	}
});

Ext.application({
	
	
	name: 'My',
	controllers: ['Contact'],
	launch: function () {
		showRegions = showRegioni
		showCAPs = showCap
		showProvinces = showProvince
		showTowns = showComuni
		//Ext.onReady(function(){
	//creo l'oggetto utente
	metmi.utente = new User(metmi.user)
	if (!metmi.utente.isLogged()){
			showLogin(function(u){
				metmi.user = Ext.ModelManager.create(u,'user')
				texts = locals[metmi.user.getLocals()]
				//.setTooltip(texts.msg1)
				var tip = Ext.create('Ext.tip.ToolTip', {
					target: 'pvButton',
					html: texts.txt1
				});
				refreshTexts()
				//console.log(Ext.get('pvButton'))//.qtip= 'ciao0'
				Ext.gritter.add(
														{
															title: texts.txt0, 
															text: metmi.user.getName(),
															region:'left',
															time: 800,
															x: 0
														});
				}) // a login eseguito  memorizza l'utente loggato in metmi.user
//			console.log('onReady')
		}
//})

		Ext.QuickTips.init();
		
		var selected_list = Ext.create('Ext.grid.Panel', { title: texts.txt3,
		store: utb_store,//Ext.data.StoreManager.lookup('metmiUtbStore')
		data : selected,
		flex:true,
		columns:[
			{
				header:texts.txt25,
				dataIndex:'classe',
				renderer: function(v){
					var out = ''
					switch(v){
						case 'regione':
							out = texts.txt22;
							break;
						case 'provincia':
							out = texts.txt23;
							break;
						case 'comune':
							out = texts.txt24;
							break;
						case 'cap':
							out = texts.txt9;
							break;
					}
					return out
				}
			},
			{
				header:texts.txt26,
				dataIndex:'nome'
			},
			{
				xtype: 'actioncolumn',
				//width: 20,
				items: [{
					header:texts.txt58,
					icon: 'images/delete.png',
					handler: function(grid, rowIndex, colindex) {
				//console.log(rowIndex)
				var classe_layer = selected_list.data.utbs[rowIndex].classe
				var feature = selected_list.data.utbs[rowIndex].feature
				//var layer = selected_list.data.utbs[rowIndex].layer
				//console.log(selected_list.data.utbs[rowIndex])
					console.log(classe_layer)
					//console.log(layer)
					console.log(select)
					select.removeFeatures([feature])
					selected.utbs.splice(rowIndex,1)
					selected_list.getStore().reload()
					}
				}]
			}
		],
		tbar: [
					{
						xtype: 'button',
						icon: 'images/icon1616.png',
						id: 'pvButton',
						disabled: false,
						handler: function(){
							if (selected.utbs.length ==0){
								alert(texts.txt21)
							}
							else{
								console.log(metmi)
								showCensus(metmi.user)
							}
					}
					},					{
						xtype: 'button',
						icon: 'images/icon1616.png',
						id: 'stubButton',
						disabled: false,
						handler: function(){
								alert('test')
								var s = [{utb:{classe:'regione',id:9}}]
								var censimento = 'saloni'
								var censimento_id = '520124179c8a82a68e7c7d6d'
								metmi.censimento = {census:'saloni',id:censimento_id}
								showPv(metmi.user,Ext.JSON.encode(s),censimento,censimento_id)
					}
					},{
						xtype: 'button',
						id: 'radioRegioni',
						handler: showRegioni,
						tooltip:texts.txt71,
						text: texts.txt72
					},{
						xtype: 'button',
						id: 'radioCap',
						handler: showCap,
						tooltip:texts.txt73,
						text: texts.txt74
					},{
						xtype: 'button',
						id: 'radioProvince',
						handler: showProvince,
						tooltip:texts.txt75,
						text: texts.txt76
					},{
						xtype: 'button',
						id: 'radioComuni',
						handler: showComuni,
						tooltip:texts.txt77,
						text: texts.txt78
					}
				] //eo tbar
	})
		My.app = this; //reference to app instance
		Ext.create('Ext.container.Viewport', {
			layout: {
				type: 'border'
			},
			defaults: {
				split: true
			},
			items: [, {
				region: 'east',
				width: 270,
				//html: 'This is East',
				collapsible: true,
				items: selected_list
			},  {
				id: 'gmap',
				height: 771,
				//content injected by the controller
				collapsible: false,
				region: 'center',
				layout: 'fit',
				//margins: '5',
				border: false,
				//items: [map],
				
			}]
			// eo Viewport.items
		})//.add(map);
// genero la mappa con leaflet


		//regioni.onEachFeature = onEachFeature
		
//console.log(regioni)
//console.log(cap)

function selectFeature(e){
	var layer = e.target
	var feature = layer.feature
}
var getPosition = function(l,id){
	/*ritorna la posizione nella lista dell'elemento il cui id è 0 a quello richiesto
	 * @param l:[{position:int}]
	 * @param id: int
	 * @return: int */
	 var n = 0
	 while (l[n].position!=id){
		 n += 1
	 }
	 return n
 }
 
function highlightFeature_regioni(e) {
	//console.log(e)
	var layer = e.target;
	var feature = layer.feature
	if (!feature.properties.selected){
		//console.log('feature not selected')
		feature.properties.selected = true
		
		var n = selected.utbs.length
		var utb = {'classe':'regione','id': feature.id+1,'nome':feature.properties.NOME_REG,'layer':layer,'position':n} //per le regioni  c'è un offset di 1
		selected.utbs.push(utb)
		console.log(selected)
		Ext.get('pvButton').setVisible(true)
		//Ext.get('pvButton').disable()
		//console.log(n)
		//console.log(feature)
		layers.regione = layer
		feature.properties.position = n// memorizzo la posizione nella lista delle utb selezionate per poterla rimuovere semplicemente
		//console.log(feature)
		layer.setStyle({
				weight: 5,
				color: '#666',
				dashArray: '',
				fillOpacity: 0.7
		});
	}
	else{
		//console.log('feature already selected')
		console.log(feature)
		feature.properties.selected = false
		selected.utbs.splice(getPosition(selected.utbs,feature.properties.position),1)
		selected_list.getStore().reload()
		layer.setStyle({ // deseleziono la feature e ne ripristino il colore sulla mappa
				weight: 5,
				color: '#000',
				dashArray: '',
				fillOpacity: 0,
				weight: 1,
				opacity: 1,
		});
	}
	
	//console.log(selected.utbs)
	selected_list.getStore().reload()

	
	


	if (!L.Browser.ie && !L.Browser.opera) {
		layer.bringToFront();
	}
}

var myStyle = function(feature){
	switch(feature.properties.zona){
		case 'nord': return {/*fillColor: "#ff7800",*/color: "#000"}; break;
		case 'centro': return {/*fillColor: "#ff78ff",*/color: "#000"}; break;
		case 'sud': return {/*fillColor: "#007800",*/color: "#000"}; break;
	}
}
var selectionStyle= function(feature){
		if (feature.properties.selected)
		{
			return{ // deseleziono la feature e ne ripristino il colore sulla mappa
					weight: 5,
					color: '#000',
					dashArray: '',
					fillOpacity: 0,
					weight: 1,
					opacity: 1,
			}
		}
		return {
					weight: 5,
					color: '#666',
					dashArray: '',
					fillOpacity: 0.7
			}
	}

 function showRegioni(){
	 control.protocol = OpenLayers.Protocol.WFS.fromWMSLayer(regioni)
							Ext.getCmp('radioRegioni').toggle(true);
							Ext.getCmp('radioComuni').toggle(false);
							Ext.getCmp('radioCap').toggle(false);
							Ext.getCmp('radioProvince').toggle(false);
					regioni.setVisibility(true)
					comuni.setVisibility(false)
					province.setVisibility(false)
					cap.setVisibility(false)
					//map.setBaseLayer(regioni)
					//map.addLayer(regioni);
							}
 function showCap (){
	 control.protocol = OpenLayers.Protocol.WFS.fromWMSLayer(cap)
							Ext.getCmp('radioRegioni').toggle(false);
							Ext.getCmp('radioComuni').toggle(false);
							Ext.getCmp('radioCap').toggle(true);
							Ext.getCmp('radioProvince').toggle(false);
					regioni.setVisibility(false)
					comuni.setVisibility(false)
					province.setVisibility(false)
					cap.setVisibility(true)
					//map.setBaseLayer(cap)
					//map.addLayer(cap);
							};
function refreshTexts(){
	selected_list.setTitle(texts.txt2)
	selected_list.columns[0].setText(texts.txt25)
	selected_list.columns[1].setText(texts.txt26)
	selected_list.columns[2].setText(texts.txt27)
	Ext.getCmp('radioRegioni').setText(texts.txt72)
	Ext.getCmp('radioRegioni').setTooltip(texts.txt71)
	Ext.getCmp('radioProvince').setText(texts.txt76)
	Ext.getCmp('radioProvince').setTooltip(texts.txt75)
	Ext.getCmp('radioComuni').setText(texts.txt78)
	Ext.getCmp('radioComuni').setTooltip(texts.txt77)
	Ext.getCmp('radioCap').setText(texts.txt74)
	Ext.getCmp('radioCap').setTooltip(texts.txt73)
}
 function showComuni(){
	 control.protocol = OpenLayers.Protocol.WFS.fromWMSLayer(comuni)
							Ext.getCmp('radioRegioni').toggle(false);
							Ext.getCmp('radioComuni').toggle(true);
							Ext.getCmp('radioCap').toggle(false);
							Ext.getCmp('radioProvince').toggle(false);
					regioni.setVisibility(false)
					comuni.setVisibility(true)
					province.setVisibility(false)
					cap.setVisibility(false)
					//map.setBaseLayer(comuni)
							}
function showProvince(){
	 control.protocol = OpenLayers.Protocol.WFS.fromWMSLayer(province)
							Ext.getCmp('radioRegioni').toggle(false);
							Ext.getCmp('radioComuni').toggle(false);
							Ext.getCmp('radioCap').toggle(false);
							Ext.getCmp('radioProvince').toggle(true);
					regioni.setVisibility(false)
					comuni.setVisibility(false)
					province.setVisibility(true)
					cap.setVisibility(false)
					//map.setBaseLayer(province)
							}
function onEachFeature(feature, layer) {
	layer.on({
		//mouseover: highlightFeature,
		click: highlightFeature_regioni,
		/*mouseout: function(e) {
	geojson.resetStyle(e.target);
},*/
})
			var popupContent = "<p>I started out as a GeoJSON " +
					feature.geometry.type + ", but now I'm a Leaflet vector! my id is: "+feature.id+"</p>";
					//console.log(feature.id)

			if (feature.properties && feature.properties.popupContent) {
				popupContent += feature.properties.popupContent;
			}

			//layer.bindPopup(popupContent); // mostra il fumetto
		}
function onEachFeature_province(feature, layer) {
			var popupContent = "<p>I started out as a GeoJSON " +
					feature.geometry.type + ", but now I'm a Leaflet vector! my id is: province "+feature.id+"</p>";
//					console.log(feature.id)

			if (feature.properties && feature.properties.popupContent) {
				popupContent += feature.properties.popupContent;
			}

			layer.bindPopup(popupContent);
		}


	}
});


