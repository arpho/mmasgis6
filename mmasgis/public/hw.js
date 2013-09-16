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
		control = new OpenLayers.Control.GetFeature({
                protocol: OpenLayers.Protocol.WFS.fromWMSLayer(regioni),
                box: true,
                hover: true,
                multipleKey: "shiftKey",
                toggleKey: "ctrlKey"
            });
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
	function handleMapClickReg(evt)
{
var lonlat = map.getLonLatFromViewPortPx(evt.xy);
//alert("latitude : " + lonlat.lat + ", longitude : " + lonlat.lon);
console.log('regioni')
 
}
function handleMapClickPro(evt)
{
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
                protocol: OpenLayers.Protocol.WFS.fromWMSLayer(regioni),
                box: true,
                toggle: true,
                //multipleKey: "shiftKey",
                toggleKey: "ctrlKey"
            });
            control.events.register("featureunselected", this, function(e) {
	            removeFeaturesFromGrid(e.feature.fid);
                select.removeFeatures([e.feature]);
                //console.debug(e.feature);
                
            });
            //map.addControl(selectionControl);//CONTROLLO PER PAN E DRAG SULLA MAPPA
            map.addControl(control);
            control.activate()
			dragpan = new OpenLayers.Control.DragPan();
			map.addControl(dragpan);
			//selectionControl.deactivate()
			//dragpan.deactivate(); 
            //selectionControl.activate(); // attiva selectionControl
            //REGISTRO EVENTI PER SELEZIONARE CON CLICK IN E DESELEZIONARE CON CLICK OUT
            control.events.register("featureselected", this, function(e) {
				console.log('selected')
				select.addFeatures([e.feature]);
				//addFeaturesToGrid(e.feature);			
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
	    
		map.addControl(new OpenLayers.Control.LayerSwitcher());
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
