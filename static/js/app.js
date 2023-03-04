// assigning the url string to a constant
const url = "https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json"

// as the code starts from the init() function so writing the init() function first
function init(){

// selecting dropdown element from html
let dropdownMenu = d3.select("#selDataset");

// put the ids in the drop down list

// making API call to retrieve data 
d3.json(url).then(function(data) {

    // extracting IDs from JSON and assigning to a variable
    let ids = data.names;

    // filling up IDs on the drop down menu
    ids.forEach(element => {dropdownMenu.append("option").text(element).property("value", element);
});

// calling getData() function which will do the rest of the work for us
getData()});

}


// writing function to design bar chart
function bar_chart(current_selected_id){

// making API call to retrieve data 
d3.json(url).then( data => {

    // getting the whole samples list
    var samples = data.samples;

    // fetchiing the samples dictionary whose key matches our current selected ID 
    var result = samples.filter(idObject => idObject.id == current_selected_id)[0];

    // getting sample values, otu ids and labels slicing top 10 and reversing to get descending order
    var sample_values = result.sample_values.slice(0,10).reverse();
    var otu_ids = result.otu_ids.slice(0,10).reverse();
    var otu_labels = result.otu_labels.slice(0,10).reverse();

    // preparing for plotting
    var trace1 = {
        x: sample_values,
        y: otu_ids.map(otuID => `OTU ${otuID}`),
        text: otu_labels,
        name: "Greek",
        type: "bar",
        orientation: "h"
    };
    var data = [trace1];
    var layout = {
        title: "Top Ten OTUs for PatientID# " +current_selected_id,
        margin: {l: 100, r: 100, t: 100, b: 100}
    };
    Plotly.newPlot("bar", data, layout);

});}

// writing function to design bubble chart
function bubble_chart(current_selected_id){

    // making API call to retrieve data 
    d3.json(url).then( data => {

        // getting the whole samples list
        var samples = data.samples;

        // fetchiing the samples dictionary whose key matches our current selected ID 
        var result = samples.filter(idObject => idObject.id == current_selected_id)[0];
        
        // getting sample values, otu ids and labels
        var sample_values = result.sample_values;
        var otu_ids = result.otu_ids;
        var otu_labels = result.otu_labels;
        
        // preparing for plotting
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
            title: 'OTU ID Bubble Chart',
            showlegend: false,
            height: 600,
            width: 600
          };
          
          Plotly.newPlot('bubble', data, layout);
 
    });
}

// populating the demographic info chart
// creating a function
function demographic_info(current_selected_id){

// getting data from API call
    d3.json(url).then( data => {

    // getting metadata from the array
    let metadata = data.metadata;

    // filtering to get the data for our selected ID
    let result = metadata.filter(sampleObject => sampleObject.id == current_selected_id)[0];

    // selecting the header from HTML
    let meta_location = d3.select("#sample-metadata");

    // populating the HTML with each key, value pair
    meta_location.html("");
    Object.entries(result).forEach(([key, value]) => {
        meta_location.append("h6").text(`${key.toLocaleUpperCase()} : ${value}`)
    })

});}

// On change to the DOM, call getData()
d3.selectAll("#selDataset").on("change", getData);

// writing getData function to get the current selected item from dropdown menu
function getData(){
    let dropdownMenu = d3.select("#selDataset");
    let dataset = dropdownMenu.property("value");

// calling updatePlotly function, and passing it the current selected ID from dropdown menu
    updatePlotly(dataset);
}

function updatePlotly(new_data) {
    // calling all the required chart making functions and passing them --
    // -- the current selected ID from dropdown menu
    bar_chart(new_data);
    bubble_chart(new_data);
    demographic_info(new_data)
  }

// this function runs the app
init();