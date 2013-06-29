Ext.namespace('metmi');
var selected = []
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
})
Ext.define('My.model.Contact', {
    extend: 'Ext.data.Model',
    fields: ['name']
});

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
			showLogin()
			console.log('onReady')
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
        
        var selected_list = Ext.create('Ext.grid.Panel', { title: 'utb selezionate',
        store: utb_store,//Ext.data.StoreManager.lookup('metmiUtbStore')
        data : selected,
        columns:[
			{
				header:'classe',
				dataIndex:'classe',
			},
			{
				header:'nome',
				dataIndex:'nome'
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
            items: [{
                region: 'north',
                //contentEl: 'header',content read from html in gsp
                html: "This is my temp header",
                id: 'mainHeader'
            }, {
                region: 'east',
                width: 200,
                //html: 'This is East',
                collapsible: true,
                items: selected_list
            }, {
                region: 'south',
                //contentEl: 'footer',
                //content read from html in gsp
                html: "This is my temp footer content",
                height: 30,
                margins: '0 5 5 5',
                bodyPadding: 2,
                // internal text padding
                id: 'mainFooter'
            }, {
                id: 'map',
                //content injected by the controller
                collapsible: false,
                region: 'center',
                layout: 'fit',
                margins: '5',
                border: true,
                //items: [map],
                tbar: [{
                    xtype: 'button',
                    text: 'My Menu ...',
                    tooltip: 'zzz',
                    menu: {
                        items: [{
                            text: 'My Create Button',
                            id: 'CreateButton',
                            tooltip: 'yyyy' //no workie
                        }]
                    } //eo CR menu
                }, '-', {
                    text: 'Admin',
                    disabled: true
                }, '-', '->', '-', {
                    id: 'search',
                    name: 'search',
                    emptyText: 'enter search term',
                    xtype: 'trigger',
                    triggerCls: 'x-form-search-trigger',
                    onTriggerClick: function () {
                        if (this.getRawValue().length > 0) {
                            Ext.MessageBox.show({
                                title: 'Search Feature',
                                msg: 'Coming soon ... ',
                                icon: Ext.MessageBox.INFO,
                                animateTarget: 'search',
                                buttons: Ext.MessageBox.OK
                            });
                        } else {
                            Ext.MessageBox.show({
                                title: 'Invalid Input',
                                msg: 'Search term cannot be empty.',
                                icon: Ext.MessageBox.WARNING,
                                animateTarget: 'search',
                                buttons: Ext.MessageBox.OK
                            });
                        }
                    },
                    // eo onTrigger
                    enableKeyEvents: true,
                    listeners: {
                        specialkey: function (field, e) {
                            if (e.ENTER === e.getKey()) {
                                field.onTriggerClick();
                            }
                        }
                    }
                } //eo search
                ] //eo tbar
            }]
            // eo Viewport.items
        })//.add(map);
// genero la mappa con leaflet

var map = L.map('map-body').setView([41.9, 12.48], 7);

L.tileLayer('http://{s}.tiles.mapbox.com/v3/jcsanford.map-vita0cry/{z}/{x}/{y}.png', {
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

function highlightFeature_regioni(e) {
	console.log(e)
    var layer = e.target;
    var feature = layer.feature
    if (!feature.properties.selected){
	    console.log('feature not selected')
	    feature.properties.selected = true
    }
    else{
	    console.log('feature already selected')
	    feature.properties.selected = false
    }
    var utb = {'classe':'regione','id': feature.id,'nome':feature.properties.NOME_REG}
    selected.push(utb)
    //console.log(selected)

    layer.setStyle({
        weight: 5,
        color: '#666',
        dashArray: '',
        fillOpacity: 0.7
    });
    


    if (!L.Browser.ie && !L.Browser.opera) {
        layer.bringToFront();
    }
}

var myStyle = function(feature){
	switch(feature.properties.zona){
		case 'nord': return {fillColor: "#ff7800",color: "#000"}; break;
		case 'centro': return {fillColor: "#ff78ff",color: "#000"}; break;
		case 'sud': return {fillColor: "#007800",color: "#000"}; break;
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
    popup
        .setLatLng(e.latlng)
        
        .setContent("You clicked the map at " + e.latlng.toString())
        .openOn(map);
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

			layer.bindPopup(popupContent);
		}
function onEachFeature_province(feature, layer) {
			var popupContent = "<p>I started out as a GeoJSON " +
					feature.geometry.type + ", but now I'm a Leaflet vector! my id is: province "+feature.id+"</p>";
					console.log(feature.id)

			if (feature.properties && feature.properties.popupContent) {
				popupContent += feature.properties.popupContent;
			}

			layer.bindPopup(popupContent);
		}


    }
});
