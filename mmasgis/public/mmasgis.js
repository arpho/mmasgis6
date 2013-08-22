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
/*Ext.define('My.model.Contact', {
	extend: 'Ext.data.Model',
	fields: ['name']
});*/

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
		
		//Ext.onReady(function(){
	//creo l'oggetto utente
	metmi.utente = new User(metmi.user)
	//console.log(metmi.utente)
	if (!metmi.utente.isLogged()){
			showLogin(function(u){
				metmi.user = Ext.ModelManager.create(u,'user')
				texts = locals[metmi.user.getLocals()]
				//.setTooltip(texts.msg1)
				var tip = Ext.create('Ext.tip.ToolTip', {
					target: 'pvButton',
					html: texts.txt1
				});
				selected_list.setTitle(texts.txt2)
				selected_list.columns[0].setText(texts.txt25)
				selected_list.columns[1].setText(texts.txt26)
				selected_list.columns[2].setText(texts.txt27)
				//console.log(Ext.get('pvButton'))//.qtip= 'ciao0'
				Ext.gritter.add(
														{
															title: texts.txt0, 
															text: metmi.user.getName()
														});
				}) // a login eseguito  memorizza l'utente loggato in metmi.user
//			console.log('onReady')
		}
//})
		var map = {
					xtype: 'gmappanel',
					id: 'mymap',
					zoomLevel: 6,
					gmapType: 'map',
					mapConfOpts: ['enableScrollWheelZoom','enableDoubleClickZoom','enableDragging'],
					mapControls: ['GSmallMapControl','GMapTypeControl'],
					setCenter: {
						lat:41.9,// 39.26940,
						lng: 12.48//-76.64323
					},
					maplisteners: {
						click: function(mevt){
							Ext.Msg.alert('Lat/Lng of Click', mevt.latLng.lat() + ' / ' + mevt.latLng.lng());
							var input = Ext.get('ac').dom,
								sw = new google.maps.LatLng(36.68,12.04),
								ne = new google.maps.LatLng(47,13)
								bounds = new google.maps.LatLngBounds(sw,ne);
							var options = {
								location: mevt.latLng,
								radius: '1000',
								types: ['geocode']
							};
						}
					}
				}

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
			header:'Rimuovi',
					icon: 'images/delete.png',
					handler: function(grid, rowIndex, colindex) {
				//console.log(rowIndex)
				var classe_layer = selected_list.data.utbs[rowIndex].classe
				var layer = selected_list.data.utbs[rowIndex].layer
				//console.log(selected_list.data.utbs[rowIndex])
					//console.log()
					selected.utbs.splice(rowIndex,1)
					selected_list.getStore().reload()
							//alert('click!'+rowIndex);
					layer.setStyle({ // deseleziono la feature e ne ripristino il colore sulla mappa
							weight: 5,
							color: '#000',
							dashArray: '',
							fillOpacity: 0,
							weight: 1,
							opacity: 1,
					});
					L.geoJson(regioni, {

			style:selectionStyle
		})
					}
				}]
			}
		]
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
				id: 'map',
				//content injected by the controller
				collapsible: false,
				region: 'center',
				layout: 'fit',
				margins: '5',
				border: true,
				//items: [map],
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
								showPv(user,Ext.JSON.encode(s),censimento,censimento_id)
					}
					},/*/*
					{
						xtype: 'button',
						icon: 'images/icon1616.png',
						id: 'AnagraphicButton',
						disabled: false,
						handler: function(){
							
							
							showAnagrafica([1,2],0)
							
					}
					}*/
					
				] //eo tbar
			}]
			// eo Viewport.items
		})//.add(map);
// genero la mappa con leaflet

var map = L.mapbox.map('map-body', 'arpho.map-nw38cgmq').setView([41.9, 12.48], 7);

L.mapbox.tileLayer('arpho.map-nw38cgmq', {
			maxZoom: 18,
			attribution: 'Tiles Courtesy of <a href="http://www.mapbox.com/" target="_blank">MapBox</a>. Map data (c) <a href="http://www.openstreetmap.org/" target="_blank">OpenStreetMap</a> contributors, CC-BY-SA.'
		}).addTo(map);
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
L.geoJson(regioni, {

			style:myStyle,/* function (feature) {
				return feature.properties && feature.properties.style;
			},*/

			onEachFeature: onEachFeature,

			pointToLayer: function (feature, latlng) {
				return L.circleMarker(latlng, {
					radius: 8,
					fillColor: "#ff7800",
					color: "#000",
					weight: 1,
					opacity: 1,
					fillOpacity:1
				});
			}
		}).addTo(map);
		
/*L.geoJson(province, {

			style: function (feature) {
				return feature.properties && feature.properties.style;
			},

			//onEachFeature: onEachFeature_province,

			pointToLayer: function (feature, latlng) {
				return L.circleMarker(latlng, {
					radius: 8,
					fillColor: "#ff7800",
					color: "#000",
					weight: 1,
					opacity: 1,
					fillOpacity: 0.8
				});
			}
		}).addTo(map);*/

var popup = L.popup();
function onMapClick(e) {
	console.log('click')
	console.log(e.latlng)
	console.log(e)
	console.log(map)
	//popup
//		.setLatLng(e.latlng)
		
		//.setContent("You clicked the map at " + e.latlng.toString())
//		.openOn(map);
}
map.on('click', onMapClick);
var geojson;
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
