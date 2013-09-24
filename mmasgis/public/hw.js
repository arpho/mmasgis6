var opacity = 1;
Ext.BLANK_IMAGE_URL = './extjs/resources/themes/images/default/tree/s.gif';
var url = "http://"+metmi.wms_ip+":7070/geoserver/wms"
Ext.onReady(function() {
	    //var gsat = new OpenLayers.Layer.Google("SATELLITE", {type: google.maps.MapTypeId.SATELLITE, sphericalMercator:true, 'maxExtent': _bounds}),
		//var gmap = new OpenLayers.Layer.Google("Google Streets", {visibility: false});
		
		var ghyb = new OpenLayers.Layer.Google(
	    "Google Hybrid",
	    {"type": google.maps.MapTypeId.HYBRID, numZoomLevels: 20}
	);
		    var options = {
			controls: [],
			//sphericalMercator:true,
			//projection: new OpenLayers.Projection('EPSG:900913'), // senza la proiezione mi stampa metà layer
			units: "m",
			numZoomLevels: 22,            
			maxResolution: 156543.0339,
			maxExtent: new OpenLayers.Bounds(-20037508.34, -20037508.34,
					     20037508.34, 20037508.34)
		    };
		    var panZoom = new OpenLayers.Control.PanZoom();
		 map = new OpenLayers.Map('map', {
				div: "gmap",
				projection: "EPSG:900913",
				displayProjection: "EPSG:4326",
				//zoomOffset: 5
		controls: [
		    panZoom,
		    new OpenLayers.Control.Navigation()
		]
            });
		     regioni		 = new OpenLayers.Layer.WMS(
		    "regioni",
		    url,
		    {
			layers: "metmi-italy:reg2011_g" ,
			transparent: "true",
			format: "image/png",
			srs:'EPSG:900913', // old: 'EPSG:2077'
			//zoomOffset: 4,
		    },
		    {opacity: opacity,isBaseLayer: false,}
		);
		
	 comuni	 = new OpenLayers.Layer.WMS(
	    "comuni",
	    url,
	    {
		layers: "com2011_g" ,
		transparent: "true",
		format: "image/png",
		srs:'EPSG:900913', // old: 'EPSG:2077'
		//zoomOffset: 3
	    },
	    {opacity: opacity,isBaseLayer: false,}
	);
	 province = new OpenLayers.Layer.WMS(
	    "province",
	    url,
	    {
		layers: "metmi-italy:prov2011_g" ,
		transparent: "true",
		format: "image/png",
		srs:'EPSG:900913', // old: 'EPSG:2077'
		//zoomOffset: 3,
	    },
	    {opacity: opacity,isBaseLayer: false,}
	);
	 cap = new OpenLayers.Layer.WMS(
	    "cap",
	    url,
	    {
		layers: "metmi-italy:CapCR2006" ,
		transparent: "true",
		format: "image/png",
		srs:'EPSG:900913', // old: 'EPSG:2077'
		//zoomOffset: 3
	    },
	    {opacity: opacity,isBaseLayer: false}
	);
	
	control = new OpenLayers.Control.GetFeature({
                protocol: OpenLayers.Protocol.WFS.fromWMSLayer(regioni),
                //box: ,
                multiple:true,
                hover: false,
                multipleKey: "shiftKey",
                toggleKey: "ctrlKey"
            });
	function handleMapClickReg(evt){
var lonlat = map.getLonLatFromViewPortPx(evt.xy);
 console.log('Regioni')
}
function handleMapClickPro(evt){
var lonlat = map.getLonLatFromViewPortPx(evt.xy);
//alert("latitude : " + lonlat.lat + ", longitude : " + lonlat.lon);
console.log('Province')
 
}
				//LAYER VETTORIALE IN OVERLAY PER LA SELEZIONE
		select = new OpenLayers.Layer.Vector("Selezioni", {styleMap: 
		new OpenLayers.Style(OpenLayers.Feature.Vector.style["select"])
            });
		map.addLayers([ghyb,regioni,province,comuni	,cap,select])
		//regioni		.events.register('click', map, handleMapClickReg);
		selectionControl = new OpenLayers.Control.GetFeature({
                protocol: OpenLayers.Protocol.WFS.fromWMSLayer(cap),
                box: true,
                toggle: true,
                //multipleKey: "shiftKey",
                toggleKey: "ctrlKey"
            });
            control.events.register("featureunselected", this, function(e) {
	            //removeFeaturesFromGrid(e.feature.fid);
		    console.log('unselect')
	            console.log(e)
		    var id = {}
			id.com = function(){return e.feature.attributes.PRO_COM}
			id.reg = function(){return e.feature.attributes.COD_REG}
			id.pro = function(){return e.feature.attributes.COD_PRO}
			id.Cap = function(){return e.feature.attributes.nome}
		    var family =  e.feature.fid.substring(0,3)
		    //devo trovare l'elemento corrispondente alla feature deselezionata e rimuoverlo da selected_utbs
		    var found = false
		    var Id = id[family]()
		    var j 
		    for (var i=0;((i< selected.utbs.length)&& !found);i++){
			    if((selected.utbs[i].classe== {'reg':'regione','com':'comune','Cap':'cap','pro':'provincia'}[family]) &&(selected.utbs[i].id == Id)){
				found = true
				j = i
			    }
		    }
			selected.utbs.splice(j,1)
		    //{classe:{'reg':'regione','com':'comune','Cap':'cap','pro':'provincia'}[family]
                select.removeFeatures([e.feature]);
		Ext.data.StoreManager.lookup('metmiUtbStore').reload()
                //console.debug(e.feature);
                
            });
            //map.addControl(selectionControl);//CONTROLLO PER PAN E DRAG SULLA MAPPA
            map.addControl(control);
	    var panel_type1 = new OpenLayers.Control.Panel({
		
    displayClass: 'Panel1'
});
    //map.addControl(panel_type1);
    var _aBtn1 = new OpenLayers.Control.Button({
    displayClass: 'first',
    trigger: function() {
        alert('Button of OpenLayers.Control.TYPE_BUTTON type is pressed');
    }
});
//panel_type1.addControls([_aBtn1]);
            var button = new OpenLayers.Control.Button({
    displayClass: "MyButton",visible:true, trigger: function(){console.log('bottone')}
});
comuni.setVisibility(false)
cap.setVisibility(false)
province.setVisibility(false)
regioni.setVisibility(false)
var layer = new OpenLayers.Layer.Vector();
/*var panelControls = [new OpenLayers.Control.Button({
    displayClass: "CAPbutton",visible:true,  trigger: function(){showCAPs()}
}),
new OpenLayers.Control.Button({
    displayClass: "TwonButton",visible:true, trigger: function(){showTowns()}
}),
new OpenLayers.Control.Button({
    displayClass: "provinceButton",visible:true, trigger: function(){showProvinces()}
}),
  new OpenLayers.Control.Button({
    displayClass: "RegionButton",visible:true,  trigger: function(){showRegions()}
}),
 new OpenLayers.Control.Navigation(),
];
var toolbar = new OpenLayers.Control.Panel({
   displayClass: 'olControlEditingToolbar',
   defaultControl: panelControls[0]
});
//toolbar.addControls(panelControls);
//map.addControl(toolbar);
            */
            
            
            control.activate()
			dragpan = new OpenLayers.Control.DragPan();
			//map.addControl(button);
			//map.addControl(dragpan);
			//selectionControl.deactivate()
			//dragpan.deactivate(); 
            //selectionControl.activate(); // attiva selectionControl
            //REGISTRO EVENTI PER SELEZIONARE CON CLICK IN E DESELEZIONARE CON CLICK OUT
            control.events.register("featureselected", this, function(e) {
//				console.log('selected'+e.feature.fid)
				var family = e.feature.fid.substring(0,3)
		//		console.log(e)
				var nome = {}
				nome.reg = function(){return e.feature.attributes.NOME_REG}
				nome.pro = function(){return e.feature.attributes.NOME_PRO}
				nome.com = function(){return e.feature.attributes.NOME_COM}
				nome.Cap = function(){return e.feature.attributes.nome1}
				var id = {}
				id.com = function(){return e.feature.attributes.PRO_COM}
				id.reg = function(){return e.feature.attributes.COD_REG}
				id.pro = function(){return e.feature.attributes.COD_PRO}
				id.Cap = function(){return e.feature.attributes.nome}
				select.addFeatures([e.feature])
				console.log(e.feature.attributes)
				selected.utbs.push({classe:{'reg':'regione','com':'comune','Cap':'cap','pro':'provincia'}[family],nome:nome[family](),id:id[family](),feature:e.feature});
				//console.log(selected)
				//addFeaturesToGrid(e.feature);			
				Ext.data.StoreManager.lookup('metmiUtbStore').reload()
            });
		//map.addControl(selectionControl);
		//selectionControl.activate();
		dragpan = new OpenLayers.Control.DragPan();
		map.addControl(dragpan);
		selectionControl.deactivate()
		province.events.register('click', map, handleMapClickPro);
		map.setCenter(new OpenLayers.LonLat(12.48,41.9).transform(
		new OpenLayers.Projection("EPSG:4326"),
		map.getProjectionObject()
	    ), 7); // imposta il centro mappa e lo zomm
	    
		//map.addControl(new OpenLayers.Control.LayerSwitcher());
		map.events.register('zoomend', this, function (event) {
				
				var zLevel = map.getZoom();
				console.log(zLevel)
				/*if( zLevel <= 6 ){	
					map.addLayer(regioni);
					//map.setBaseLayer(regioni);
					selectionControl.protocol = OpenLayers.Protocol.WFS.fromWMSLayer(regioni);
					//info.layers = [regioni];
					map.removeLayer(province);
					map.removeLayer(comuni);
					map.removeLayer(cap);
        		}*/
			})
		}) //eof onready
					/*
		var point = new OpenLayers.LonLat( 41.9,12.48);
		map.setCenter(point)*/
