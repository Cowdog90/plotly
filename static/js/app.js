//Function used to load the JSON file

function init() {
    var subject = d3.select("#selDataset");
    d3.json("samples.json").then((importedSamples) => {
    var subjectID = importedSamples.names;
    subjectID.forEach(name => {
        subject.append("option")
        .text(name)
        .property("value", name);
    });
           
    var initialID = 0;
    demos(initialID)
    graphs(initialID)
   });
};


// Function to run when user changes ID
function changeID() {

// Store value entered by user    
var newID = d3.select("#selDataset").property("value");


// Get values and new index   
d3.json("samples.json").then((importedSamples) => {
   var subjectID = importedSamples.names;
   var index = subjectID.findIndex(function(i){
   return i === newID
});
/

// Run demos and graphs function with new values
demos(index)
graphs(index)
});
};


// Get subject id metadata
function getIDMetaData (id) {
//Metadata
var demographicInfo = d3.select("#sample-metadata");
demographicInfo.html("");
   d3.json("samples.json").then(function(data){
       var metadata = data.metadata[`${id}`];
       Object.entries(metadata).forEach(([key, value]) => {
           demographicInfo.append("h6")
           .text(`${key}: ${value}`);
       });
   });
};

// Functions to obatain plots    
function graphs(id) {    

  d3.json("samples.json").then((graphsData) => {    
   
       var graphSamples = graphsData.samples[`${id}`]; 
       console.log("samples", graphSamples);

    // Bubble Chart
    var bubbleX = graphSamples.otu_ids;
    var bubbleY = graphSamples.sample_values;

    var bubbleTrace = {
        x: bubbleX,
        y: bubbleY,
        mode: "markers",
        text: graphSamples.otu_labels,
        marker: {
            color: graphSamples.otu_ids,
            size: graphSamples.sample_values,
            colorscale: "colorful"
        }
    };
    
    var bubbleData = [bubbleTrace];
    var bubblebarLayout = {
        title: "OTU IDs",
        };
    Plotly.newPlot("bubble", bubbleData, bubblebarLayout);

});   
           
   // Bar Chart
       var barX = graphSamples.sample_values.slice(0, 10).reverse();
       var barY = graphSamples.otu_ids.slice(0, 10).map(y => `OTU ${y} `).reverse();
       
       var barTrace = {
           x: barX,
           y: barY,
           type: "bar",
           orientation: "h"
       };
       
       console.log("bar_x", barX);
       console.log("bar_y", barY);
       
       var barData = [barTrace];
       var barLayout1 = {
           title: "Top 10 OTUs per Subject",
           };
       Plotly.newPlot("bar", barData, barLayout1);
       
       
   
       
       //Gauge Plot
       
       d3.json("samples.json").then(function(bubbleData){
           var metabubbleData = bubbleData.metadata[`${id}`];
       
       var frequency = metabubbleData.wfreq
       console.log("washing frequncy: ", frequency)
       
       var gaugeData = [
           {
               domain: { x: [0, 1], y: [0, 1] },
               value: frequency,
               title: { text: "Belly Button Washing Frequency" },
               type: "indicator",
               mode: "gauge+number",
               gauge: {
                   axis: { range: [null, 9] },
                   bar: { color: "rgb(31, 119, 180)" },
               }
           }
       ];
       
       var gaugeData = [gaugeTrace];
       var gaugeLayout = { width: 600, height: 500, margin: { t: 0, b: 0 } };
       Plotly.newPlot('gauge', gaugeData, gaugeLayout);        
   
   });
   
};       
    

   init();