function print(content) {

  console.log(content);

}

var DataSet =[]
var CurrentSample = 0
var CurrentIndex = 0

var DropDown = d3.select("#selDataset")

d3.json("./static/js/samples.json").then((data) => {

  var samples = data.samples

  samples.forEach(sample=>{

      DropDown.append("option")
      .attr("value",sample.id)
      .text(sample.id)
  });

  DataSet = data
  CurrentSample = DataSet.samples[0]

  RefreshCharts()
  UpdateMeta()

 



});


DropDown.on('change', function() {

  id = document.getElementById("selDataset").value
  update_bar(parseInt(id))
  update_bubble()
  UpdateMeta()


})









// ---------Functions ------------------//

function RefreshCharts(){


  id = document.getElementById("selDataset").value
  update_bar(parseInt(id))
  update_bubble()

}


function update_bar(id) {



  var myData = []

  var i=0

  DataSet.samples.forEach(sample=>{


    if (sample.id == id)
    {  
    // Save the current sample in the memory
    CurrentIndex = i
    CurrentSample = sample



      var trace = {
        type:'bar',
        x: sample.sample_values.slice(0,11),
        y: sample.otu_ids.slice(0,11).map(item=>{return `OTU ${item}`}),
        orientation: 'h'
      }

      myData = [trace]


    }

    i += 1

  })

  Plotly.newPlot('bar', myData)

}


function update_bubble() {


  var trace = {

    x: CurrentSample.otu_ids,
    y: CurrentSample.sample_values,
    text: CurrentSample.otu_labels,
    mode: 'markers',

    marker: {
      size: CurrentSample.sample_values,
      color: CurrentSample.otu_ids,
      colorscale: [
        ['0.0', 'rgb(165,0,38)'],
        ['0.111111111111', 'rgb(215,48,39)'],
        ['0.222222222222', 'rgb(244,109,67)'],
        ['0.333333333333', 'rgb(253,174,97)'],
        ['0.444444444444', 'rgb(254,224,144)'],
        ['0.555555555556', 'rgb(224,243,248)'],
        ['0.666666666667', 'rgb(171,217,233)'],
        ['0.777777777778', 'rgb(116,173,209)'],
        ['0.888888888889', 'rgb(69,117,180)'],
        ['1.0', 'rgb(49,54,149)']
      ],
    
    }
  };
  
  var data = [trace];
  
  var layout = {
    title: 'Marker Size',
    height: 600,
    width: 1200
  };
  
  Plotly.newPlot('bubble', data, layout);

}


function UpdateMeta() {

  var meta = DataSet.metadata[CurrentIndex];
  var panel = d3.select("#sample-metadata")
  panel.selectAll("p").remove();


  Object.entries(meta).forEach(item =>
      {
        
        panel.append("p").text(`${item[0]}: ${item[1]}`)

        if (item[0] =='wfreq'){ 
          
          PlotGauge(item[1])}
  
  })

}


function PlotGauge(WashFreq) {

  //This code is written based on a tutorial at:
  //https://com2m.de/blog/technology/gauge-charts-with-plotly/
  
      // Trig to calc meter point
      var degrees = (9-WashFreq)/9*180,
          radius = .5;
      var radians = degrees * Math.PI / 180;
      var x = radius * Math.cos(radians);
      var y = radius * Math.sin(radians);
  
      // Path: may have to change to create a better triangle
      var mainPath = 'M -.0 -0.025 L .0 0.025 L ',
          pathX = String(x),
          space = ' ',
          pathY = String(y),
          pathEnd = ' Z';
      var path = mainPath.concat(pathX,space,pathY,pathEnd);
  
      var data = [{ type: 'scatter',
                  x: [0], y:[0],
                  marker: {size: 28, color:'850000'},
                  showlegend: false,
                  name: 'Wash Frequency',
                  text: WashFreq,
                  hoverinfo: 'text+name'},
      { values: [50/9, 50/9, 50/9, 50/9, 50/9, 50/9, 50/9, 50/9, 50/9, 50],
      rotation: 90,
      text: ['8-9','7-8','6-7','5-6','4-5','3-4','2-3','1-2','0-1',""],
      textinfo: 'text',
      textposition:'inside',
      marker: {colors:['rgba(14, 50, 0, .5)',
                      'rgba(14, 100, 0, .5)',
                      'rgba(14, 127, 0, .5)', 
                      'rgba(110, 154, 22, .5)',
                      'rgba(170, 202, 42, .5)', 
                      'rgba(202, 209, 95, .5)',
                      'rgba(210, 206, 145, .5)', 
                      'rgba(232, 212, 202, .5)',    
                      'rgba(255, 226, 255, .5)',
                      'rgba(255, 255, 255, 0)',
      ]},
      labels: ['161-180', 
      '141-160', 
      '121-140', 
      '101-120', 
      '81-100', 
      '61-80', 
      '41-60', 
      '21-40', 
      '0-20',
      ''],
      hoverinfo: 'label',
      hole: .5,
      type: 'pie',
      showlegend: false
      }];
  
      var layout = {
      shapes:[{
          type: 'path',
          path: path,
          fillcolor: '850000',
          line: {
              color: '850000'
          }
          }],
      title: '<b>Belly Button Washing Frequency</b> <br> Scrup per Week',
      height: 600,
      width: 600,
      xaxis: {zeroline:false, showticklabels:false,
                  showgrid: false, range: [-1, 1]},
      yaxis: {zeroline:false, showticklabels:false,
                  showgrid: false, range: [-1, 1]}
      };
  
      Plotly.newPlot('gauge', data, layout);
  }



