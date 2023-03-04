const url = "https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json"

function init(){

// selecting dropdown element
let dropdownMenu = d3.select("#selDataset");

// put the ids in the drop downlst

d3.json(url).then(function(data) {

    let ids = data.names;

    ids.forEach(element => {
        dropdownMenu.append("option").text(element).property("value", element);

    });

getData()
  });
}



function bar_chart(sample){


d3.json(url).then( data => {

    var samples = data.samples;
    var result = samples.filter(sampleObject => sampleObject.id == sample)[0];
    var sample_values = result.sample_values;
    var otu_ids = result.otu_ids;
    var otu_labels = result.otu_labels;

    var trace1 = {
        x: sample_values.slice(0,10).reverse(),
        y: otu_ids.slice(0,10).map(otuID => `OTU ${otuID}`).reverse(),
        text: otu_labels.slice(0,10).reverse(),
        name: "Greek",
        type: "bar",
        orientation: "h"
    };
    var data = [trace1];
    var layout = {
        title: "Top Ten OTUs for Individual " +sample,
        margin: {l: 100, r: 100, t: 100, b: 100}
    };
    Plotly.newPlot("bar", data, layout);

});}

function bubble_chart(sample){

    d3.json(url).then( data => {
        var samples = data.samples;
        var result = samples.filter(sampleObject => sampleObject.id == sample)[0];
        var sample_values = result.sample_values;
        var otu_ids = result.otu_ids;
        var otu_labels = result.otu_labels;
    
        var trace1 = {
            x: otu_ids,
            y: sample_values,
            text: otu_labels,
            mode: 'markers',
            marker: {
              color: otu_ids,
              size: sample_values
            }
          };
          
          var data = [trace1];
          
          var layout = {
            title: 'Bubble Chart Hover Text',
            showlegend: false,
            height: 600,
            width: 600
          };
          
          Plotly.newPlot('bubble', data, layout);
 
    });
}


function demographic_info(sample){
d3.json(url).then( data => {

    let metadata = data.metadata;
    let result = metadata.filter(sampleObject => sampleObject.id == sample)[0];
    let meta_location = d3.select("#sample-metadata");
    meta_location.html("");
    Object.entries(result).forEach(([key, value]) => {
        meta_location.append("h6").text(`${key.toLocaleUpperCase()} : ${value}`)
    })

});}

// On change to the DOM, call getData()
d3.selectAll("#selDataset").on("change", getData);

function getData(){
    let dropdownMenu = d3.select("#selDataset");
    let dataset = dropdownMenu.property("value");

    updatePlotly(dataset);
}

function updatePlotly(new_data) {
    bar_chart(new_data);
    bubble_chart(new_data);
    demographic_info(new_data)
  }

init();