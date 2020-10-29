var limits = []
var colors = [
              "#ffffb2",
              "#f6e2a2",
              "#edc692",
              "#e5aa83",
              "#dc8d73",
              "#d37164",
              "#cb5554",
              "#c23845",
              "#b91c35",
              "#b10026"
]


// Creating map object
var myMap = L.map("map", {
  center: [20, 0],
  zoom: 3
});


RefreshMap()



function markerSize(mag) {
  return 1000 * 2**mag;
}


  function RefreshMap() {

    myMap.eachLayer(function (layer) {
      
      myMap.removeLayer(layer)
  });

      // Adding tile layer to the map
      L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
        attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
        maxZoom: 18,
        id: "dark-v10",
        accessToken: API_KEY
      }).addTo(myMap);


  var url = `https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_month.geojson`

  
  // Grab the data with d3
  d3.json(url).then(function(response) {

      EarthQuakes = response.features

 

      var depths = EarthQuakes.map(Earthquake => {return Earthquake.geometry.coordinates[2]})
      var depths_extents = d3.extent(depths)

      var limit = 0

      step = (Math.log10(depths_extents[1]) - 0)/10



      while (limit <= Math.log10(depths_extents[1])) {

        limits.push(limit);
        limit += step;

      }


    // Loop through data
      EarthQuakes.forEach(Earthquake => {

          var coordinates = [Earthquake.geometry.coordinates[1], Earthquake.geometry.coordinates[0]]
          var depth = Earthquake.geometry.coordinates[2]
          var magnitude = Earthquake.properties.mag
          var title = Earthquake.properties.title
          var type = Earthquake.properties.type

          L.circle(coordinates, {
              fillOpacity: 0.75,
              color: colorcode(depth),
              fillColor: colorcode(depth),
              // Setting our circle's radius equal to the output of our markerSize function
              // This will make our marker's size proportionate to its population
              radius: markerSize(magnitude)
            }).bindPopup(`<h1>" ${title} "</h1> <hr> <h3>${type} at Depth: ${ depth}</h3>`).addTo(myMap);


      })


      // Set up the legend
      var legend = L.control({ position: "bottomright" });
      legend.onAdd = function() {
        var div = L.DomUtil.create("div", "info legend");

        var labels = [];
        // Add min & max
        var legendInfo = "<h1>   Depth (km)</h1> <hr> <h3> (Log. Scale) </h3>" +
          "<div class=\"labels\">" +
            "<div class=\"min\">" + d3.min(depths) + "</div>" +
            "<div class=\"max\">" + d3.max(depths) + "</div>" +
          "</div>";

        div.innerHTML = legendInfo;

        limits.forEach(function(limit, index) {
          labels.push("<li style=\"background-color: " + colors[index] + "\"></li>");
        });

        div.innerHTML += "<ul>" + labels.join("") + "</ul>";
        return div;
      }
    

      // Adding legend to the map
      legend.addTo(myMap);

})

};



function colorcode(mydepth) {

  for (i=0; i < limits.length; i++) {



      if (limits[i] < Math.log10(mydepth) && Math.log10(mydepth) < limits[i+1]) {

      
        return colors[i]

      
      }
      else if (mydepth < 0) {

        return colors[0]

      }

  }

}


