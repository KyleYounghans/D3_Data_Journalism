// Make the Browser Window Responsive
d3.select(window).on("resize", makeResponsive);

makeResponsive();

function makeResponsive() {

  // Clear SVG Area If Not Empty
  var svgArea = d3.select("body").select("svg");

  if (!svgArea.empty()) {
    svgArea.remove();
  }

  // SVG Wrapper Dimensions 
  var svgWidth = window.innerWidth - 30;
  var svgHeight = window.innerHeight - 30;

  margin = {
    top: 20,
    bottom: 80,
    right: 20,
    left: 80
  };

  var height = svgHeight - margin.top - margin.bottom;
  var width = svgWidth - margin.left - margin.right;
  
  // Append Div and Chart
  var $div = d3
  	.select("body")
  	.append("div")
  		.attr("id","schart")
  // Append SVG 
  var svg = d3
    .select("#schart")
    .append("svg")
    	.attr("height", svgHeight)
    	.attr("width", svgWidth);

  // Append Group Element
  var chartGroup = svg.append("g")
    .attr("transform", `translate(${margin.left}, ${margin.top})`);

  // Append a Div to Tooltips, 
  $div.append("div").attr("class", "tooltip").style("opacity", 0);

  // Read CSV
  d3.csv("./assets/data/data.csv", function(err, d3Data) {
  	if (err) throw err;

    // Data Set Up
    d3Data.forEach(function(data) {
      data.id = data.id;
      data.state = data.state;
      data.abbr = data.abbr;
      data.poverty = +data.poverty;
      data.povertyMoe = +data.povertyMoe;
      data.age = +data.age;
      data.ageMOE = +data.ageMOE;
      data.income = +data.income;
      data.incomeMOE = +data.incomeMOE;
      data.healthcare = +data.healthcare;
      data.healthcareLow = +data.healthcareLow;
      data.healthcareHigh = +data.healthcareHigh;
      data.obesity = +data.obesity;
      data.obesityLow = +data.obesityLow;
      data.obesityHigh = +data.obesityHigh;
      data.smokes = +data.smokes
      data.smokesLow = +data.smokesLow
      data.smokesHigh = +data.smokesHigh
    });

    // Create Chart Variables
	var xValue,
	   	xScale,
	  	xMap,
	  	xAxis;
	function xSelection(dataColumn){
	  xValue = (d) => {return d[dataColumn];},
	  xScale = d3.scaleLinear().range([0, width]),
	  xMap = (d) => {return xScale(xValue(d));},
	  xAxis = d3.axisBottom(xScale);		
	}

	var yValue,
	   	yScale,
	  	yMap,
	  	yAxis;
	function ySelection(dataColumn){
	  yValue = (d) => {return d[dataColumn];},
	  yScale = d3.scaleLinear().range([height, 0]),
	  yMap = (d) => {return yScale(yValue(d));},
	  yAxis = d3.axisLeft(yScale);
	}
	// Set Up X and Y:
	var nowx = 'age';
	var nowy = 'healthcare';
	xSelection(nowx);
	ySelection(nowy);

    // Append Axes
    chartGroup.append("g")
      .attr("class", "x-axis")
      .attr("transform", `translate(0, ${height})`)
      .attr("stroke", "#80babd")
      .call(xAxis);

    chartGroup.append("g")
      .attr("class", "y-axis")
      .attr("stroke", "#80babd")
      .call(yAxis);

// Create State Abbreviations
var abbrtext = (d) => {return d.abbr;};

 
// Set Up Tooltip
  var tooltip = d3.tip()
  .attr("class", "tooltip")
  .offset([75, -80])
  .html(function(d) {
    var state = d.state;
    var xpercent = d[nowx];
    var ypercent = d[nowy];
    return (`<strong>${state}<br><strong>${nowx}: ${xpercent}<br><strong>${nowy}: ${ypercent}`);
  });

  // Avoid Overlapping Dots
  xScale.domain([d3.min(d3Data, xValue)-.5, d3.max(d3Data, xValue)+.5]);
  yScale.domain([d3.min(d3Data, yValue)-.5, d3.max(d3Data, yValue)+.5]);

  // Create The Tooltip
  chartGroup.call(tooltip);
  
  // Create Scatterplots
  var dots = chartGroup.selectAll(".dot")
    .data(d3Data).enter();
  dots
  .append("circle")
  .attr("class", "dot")
  .attr("r", 15)
  .attr("cx", xMap)
  .attr("cy", yMap)
  .style("fill","#00adb5")
  
  dots
  .append("text")
  .attr("class", "states")
  .attr("x", (d) => {return xScale(d[nowx])})
  .attr("y", (d) => {return yScale(d[nowy])})
  .attr("font-size", 12)
  .attr("dy", "0.35em")
  .attr("dx","-0.60em")
  .text(abbrtext)
  .on("mouseover", (d) => {
    tooltip.show(d)})
  .on("mouseout", (d) => {
    tooltip.hide(d)});
        
// Set Up Labels
    chartGroup	
      .append("text")
      .attr("transform", "translate(" + width/2 + "," + (height + margin.top+18) + ")")
      .attr("class", "xaxis-text active")
      .attr("data-axis-name","age")
      .text("Age (Median)");
    chartGroup	
      .append("text")
      .attr("transform", "translate(" + width/2 + "," + (height + margin.top+35) + ")")
      .attr("class", "xaxis-text inactive")
      .attr("data-axis-name","income")
      .text("Household Income (Median)");
    chartGroup	
      .append("text")
      .attr("transform", "translate(" + width/2 + "," + (height + margin.top+53) + ")")
      .attr("class", "xaxis-text inactive")
      .attr("data-axis-name","poverty")
      .text("In Poverty (%)");
      //y label
    chartGroup
      .append("text") 
      .attr("transform", "translate(" + -margin.left*2/5 + "," + height/2 + ") rotate(270)")
      .attr("class", "yaxis-text active")
      .attr("data-axis-name", "healthcare")
      .text("Lacks Healthcare (%)");
    chartGroup
      .append("text")
      .attr("transform", "translate(" + -margin.left*3/5 + "," + height/2 + ") rotate(270)")
      .attr("class", "yaxis-text inactive")
      .attr("data-axis-name", "obesity")
      .text("Obesity (%)");
    chartGroup
      .append("text")
      .attr("transform", "translate(" + -margin.left*4/5 + "," + height/2 + ") rotate(270)")
      .attr("class", "yaxis-text inactive")
      .attr("data-axis-name", "smokes")
      .text("Smokes (%)");


    

function xlabelChange(clickedxAxis) {
  d3.selectAll(".xaxis-text")
  .filter(".active")
  .classed("active", false)
  .classed("inactive", true);
  clickedxAxis.classed("inactive", false).classed("active", true);
  }

  function ylabelChange(clickedyAxis){
    d3.selectAll(".yaxis-text")
    .filter(".active")
    .classed("active", false)
    .classed("inactive", true);
    clickedyAxis.classed("inactive", false).classed("active", true);
  }
  
  // Change Graph On Click
  d3.selectAll(".yaxis-text").on("click", function() {
    var clickedySelection = d3.select(this);
    var clickedySelectionInactive = clickedySelection.classed("inactive");
    var clickedyAxis = clickedySelection.attr("data-axis-name");
      if (clickedySelectionInactive){
        nowy = clickedyAxis;
        ySelection(nowy);
        yScale.domain([d3.min(d3Data, yValue)-1, d3.max(d3Data, yValue)+1]);
  
  svg.select(".y-axis")
  .transition()
  .duration(1800)
  .call(yAxis);

  d3.selectAll(".dot").each(function () {
    d3.select(this)
    .transition()
    .attr("cy", (d) => {
      return yScale(+d[nowy]);
    })
    .duration(1800);
  });

  d3.selectAll(".states").each(function () {
    d3.select(this)
    .transition()
    .attr("y", (d) => {
      return yScale(+d[nowy]);
    })
    .duration(1800);
  });
    ylabelChange(clickedySelection);
  }
})

  d3.selectAll(".xaxis-text").on("click", function() {
    var clickedxSelection = d3.select(this);
    var clickedxSelectionInactive = clickedxSelection.classed("inactive");
    var clickedxAxis = clickedxSelection.attr("data-axis-name");
    if (clickedxSelectionInactive) {
      nowx = clickedxAxis;
      xSelection(nowx);
      xScale.domain([d3.min(d3Data, xValue)-1, d3.max(d3Data, xValue)+1]);
      
    svg.select(".x-axis")
    .transition()
    .duration(1800)
    .call(xAxis);
    
    d3.selectAll(".dot").each(function () {
      d3.select(this)
      .transition()
      .attr("cx", (d) => {
        return xScale(+d[nowx]);
      })
      .duration(1800);
    });
    
    d3.selectAll(".states").each(function () {
      d3.select(this)
      .transition()
      .attr("x", (d) => {
         return xScale(+d[nowx]);
        })
        .duration(1800);
      });
      xlabelChange(clickedxSelection);
    }
  })
});
}