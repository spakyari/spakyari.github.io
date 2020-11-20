var myMap1 = L.map("mapid1", {
  center: [37, -118],
  zoom: 6
});

var myMap2 = L.map("mapid2", {
  center: [37, -118],
  zoom: 6
});

var myMap3 = L.map("mapid3", {
  center: [37, -118],
  zoom: 6
});

url = ['/api/v1.0/past30days/','/api/v1.0/predict/','/api/v1.0/target/']
map = [myMap1, myMap2, myMap3]

var today = new Date();
var myDate

function mapTime(){
  
  var dd = String(today.getDate()).padStart(2, '0');
  var mm = String(today.getMonth() + 1).padStart(2, '0');
  var yyyy = today.getFullYear();
  var hours = today.getHours();
  var min = today.getMinutes();
  var sec = today.getSeconds();

  myDate = yyyy + '-' + mm + '-' + dd + ' ' + hours + ':' + min + ':' + sec;
}

refreshMap(map[0], url[0])
refreshMap(map[1], url[1])
refreshMap(map[2], url[2])

dropdown = d3.select("#quakeDate")

dropdown.on("change", function(){
  
  d3.event.preventDefault();
  // today = document.getElementById("quakeDate").value
  myDate = `${document.getElementById("quakeDate").value} 00:00:00`
  console.log(myDate)
  
  
  refreshMap(map[0],url[0])
  refreshMap(map[1],url[1])
  refreshMap(map[2],url[2])

})

function chooseColor(depth) {
  switch (true) {
  case depth > 2.0:
    return "#ff0000";
  case depth > 4.0 :
    return "#ff8000" ;
  case depth > 6.0:
    return "#ffbf00";
  case depth > 8.0:
    return "#ffff00";
  case depth > 8.5:
    return "#40ff00";
  default:
    return "#4000ff";
  }
}

// Adding tile layer
function refreshMap(myMap, API){

  myMap.eachLayer(function (layer) {
      
    myMap.removeLayer(layer)
});

  
  L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
    attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
    tileSize: 512,
    maxZoom: 18,
    zoomOffset: -1,
    id: "mapbox/streets-v11",
    accessToken: API_KEY
  }).addTo(myMap);



  // Use this link to get the geojson data.
  var link = `https://predictquake.herokuapp.com${API}${myDate}`;

  console.log(link)
  // Function that will determine the color based on the depth of an earthquake


  console.log('before loop')
  // Grabbing our GeoJSON data..
  d3.json(link, function(data) {

    console.log('in loop')

    console.log(data)

    EarthQuakes = data.features


    // Loop through data
    EarthQuakes.forEach(Earthquake => {

        var coordinates = [Earthquake.geometry.coordinates[1], Earthquake.geometry.coordinates[0]]
        var magnitude = Earthquake.properties.mag
        var title = Earthquake.properties.title


        L.circle(coordinates, {
            fillOpacity: 0.75,
            color: "#b91c35",
            fillColor: "#b91c35",
            // Setting our circle's radius equal to the output of our markerSize function
            // This will make our marker's size proportionate to its population
            radius: 1000 * 2** magnitude
          }).bindPopup(`<h1>" ${title} "</h1><br> <h2> Magnitude ${magnitude}`).addTo(myMap);

    })

  })

}


// var legend = L.control({position: 'bottomright'});

// legend.onAdd = function() {

//   var div = L.DomUtil.create('div', 'info legend'),
//       depth = [2.0, 3.0, 4.0, 5.0, 6.0, 7.0, 8.0]
//       labels = [];

//   // loop through our density intervals and generate a label with a colored square for each interval
//   for (var i = 0; i < depth.length; i++) {
//       div.innerHTML +=
//           '<i style="background:' + chooseColor(depth[i] + 1) + '"></i> ' +
//           depth[i] + (depth[i + 1] ? '&ndash;' + depth[i + 1] + '<br>' : '+');
//   }

//   return div;
// };

// legend.addTo(myMap1);
