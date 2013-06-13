var map = L.map('map').setView([41.9, 12.48], 7);

L.tileLayer('http://{s}.tiles.mapbox.com/v3/jcsanford.map-vita0cry/{z}/{x}/{y}.png', {
			maxZoom: 18,
			attribution: 'Tiles Courtesy of <a href="http://www.mapbox.com/" target="_blank">MapBox</a>. Map data (c) <a href="http://www.openstreetmap.org/" target="_blank">OpenStreetMap</a> contributors, CC-BY-SA.'
		}).addTo(map);
		//regioni.onEachFeature = onEachFeature
		
console.log(regioni)
console.log(cap)
L.geoJson(regioni, {

			style: function (feature) {
				return feature.properties && feature.properties.style;
			},

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
	console.log(e.latlng)
    popup
        .setLatLng(e.latlng)
        .setContent("You clicked the map at " + e.latlng.toString())
        .openOn(map);
}
map.on('click', onMapClick);

function onEachFeature(feature, layer) {
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

