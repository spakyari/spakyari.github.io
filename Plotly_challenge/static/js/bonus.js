




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