//Define geojson data
earthquakeURL = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";
tectonicURL = "https://raw.githubusercontent.com/fraxen/tectonicplates/master/GeoJSON/PB2002_boundaries.json"; 

// Initialize & Create Two Separate LayerGroups: earthquakeLayer & tectonicLayer
var earthquakeLayer = new L.LayerGroup();
var tectonicLayer = new L.LayerGroup();


// Define variables for our tile layers
var satellite = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "mapbox.satellite",
    accessToken: API_KEY
});

var greyscale = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "mapbox.light",
    accessToken: API_KEY
});

var outdoors = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "mapbox.outdoors",
    accessToken: API_KEY
});


// Only one base layer can be shown at a time
var baseMaps = {
  "Satellite": satellite,
  "Greyscale": greyscale,
  "Outdoors":outdoors
};
// Overlays that may be toggled on or off
var overlayMaps = {
    "Tectonic Plates": tectonicLayer,
    "Earthquakes" : EarthquakeLayer
};  

// Create map object and set default layers
var myMap = L.map("map", {
    center: [37.09, -95.71],
    zoom: 4,
    layers: [satellite,EarthquakeLayer]
});


// Create a control for our layers, add our overlay layers to the map with default tile
L.control.layers(null, overlays).addTo(map);



// Define a markerSize function that will give each city a different radius based on its population
function markerSize(magnitude) {
    return magnitude * 4;
}
//Define a marker color function based on depth of the earthquake
//FYI: magnitude can tell depth of the earthquake
function markerColor(magnitude){
    switch (true) {
        case magnitude > 5:
            //Burgundy color
            return "#581845";
        case magnitude > 4:
            //Dark pink
            return "#900C3F";
        case magnitude > 3:
            //Red
            return "#C70039";
        case magnitude > 2:
            //Reddish orange
            return "#FF5733";
        case magnitude > 1:
            //Orange yellow
            return "#FFC300";
        default:
            //Yellow green or lime
            return "#DAF7A6";
        }
};
//Set up marker style based on eartquake maginitude
function markerStyle(feature){
    return {
        opacity: 1,
        fillOpacity: 1,
        fillColor: markerColor(feature.properties.mag),
        color: "#000000",
        radius: markerSize(feature.properties.mag),
        stroke: true,
        weight: 0.5
      };
} 



//Define data url
URL ="https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

// Retrieve URL (USGS Earthquakes GeoJSON Data) with D3
d3.json(URL, function(earthquakeData) {
    L.geoJSON(earthquakeData, {
        pointToLayer: function(feature, coordinates) {
        return L.circleMarker(coordinates);
        },
        style: markerStyle,
    // Function to Run Once For Each feature in the features Array
    // Give Each feature a Popup Describing the Place & Time of the Earthquake
        onEachFeature: function(feature, layer) {
            layer.bindPopup("<h4>Location: " + feature.properties.place + 
            "</h4><hr><p>Date & Time: " + new Date(feature.properties.time) + 
            "</p><hr><p>Magnitude: " + feature.properties.mag + "</p>");
        }
    // Add earthquakeData to myMap
    }).addTo(myMap);

    

    // Set Up Legend
    var legend = L.control({ position: "bottomright" });
    legend.onAdd = function() {
        var div = L.DomUtil.create("div", "info legend"), 
        labels = ["<strong>Magnitude Levels</strong>"]
        magnitudeLevels = [0, 1, 2, 3, 4, 5];

        div.innerHTML += "<h3>Magnitude</h3>"

        for (var i = 0; i < magnitudeLevels.length; i++) {
            div.innerHTML +=
                '<li style=\"background-color: ' + markerColor(magnitudeLevels[i] + 1) + '"></li> ' +
                magnitudeLevels[i] + (magnitudeLevels[i + 1] ? '&ndash;' + magnitudeLevels[i + 1] + '<br>' : '+');
        }
        return div;
    };
    // Add Legend to the Map
    legend.addTo(myMap);
});