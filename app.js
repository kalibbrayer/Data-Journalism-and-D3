var svgWidth = 960;
var svgHeight = 500;

var margin = {top: 20, right: 40, bottom: 60, left: 100};

var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;

// Create an SVG wrapper, append an SVG group that will hold our chart, and shift the latter by left and top margins.
var svg = d3
  .select('.chart')
  .append('svg')
  .attr('width', svgWidth)
  .attr('height', svgHeight)
  .append('g')
  .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

var chart = svg.append('g');

d3.csv('cleanedData.csv', function(err, cleanedData) {
  if (err) throw err;

  cleanedData.forEach(function(data) {
    data.povertyPercentage = +data.povertyPercentage;
    data.noCoveragePer = +data.noCoveragePer;
  });

  // Create scale functions
  var yLinearScale = d3.scaleLinear().range([height, 0]);

  var xLinearScale = d3.scaleLinear().range([0, width]);

  // Create axis functions
  var bottomAxis = d3.axisBottom(xLinearScale);
  var leftAxis = d3.axisLeft(yLinearScale);

  // Scale the domain
  xLinearScale.domain([
    7,
    d3.max(cleanedData, function(data) {
      return +data.povertyPercentage;
    }),
  ]);
  yLinearScale.domain([
    0,
    d3.max(cleanedData, function(data) {
      return +data.noCoveragePer * 1.2;
    }),
  ]);

  var toolTip = d3
    .tip()
    .attr('class', 'tooltip')
    .offset([80, -60])
    .html(function(data) {
      var bandName = data.State;
      var hairLength = +data.povertyPercentage;
      var numHits = +data.noCoveragePer;
      return (
        bandName + '<br> % Poverty: ' + hairLength + '<br> % No Care: ' + numHits
      );
    });

  chart.call(toolTip);

  chart
    .selectAll('circle')
    .data(cleanedData)
    .enter()
    .append('circle')
    .attr('cx', function(data, index) {
      return xLinearScale(data.povertyPercentage);
    })
    .attr('cy', function(data, index) {
      return yLinearScale(data.noCoveragePer);
    })
    .attr('r', '15')
    .attr('fill', 'pink')
    .on('click', function(data) {
      toolTip.show(data);
    })
    // onmouseout event
    .on('mouseout', function(data, index) {
      toolTip.hide(data);
    });

  chart
    .append('g')
    .attr('transform', `translate(0, ${height})`)
    .call(bottomAxis);

  chart.append('g').call(leftAxis);

  svg.selectAll(".dot")
  .data(cleanedData)
  .enter()
  .append("text")
  .text(function(data) { return data.Abbrv; })
  .attr('x', function(data) {
    return xLinearScale(data.povertyPercentage);
  })
  .attr('y', function(data) {
    return yLinearScale(data.noCoveragePer);
  })
  .attr("font-size", "9px")
  .attr("fill", "purple")
  .style("text-anchor", "middle");

  chart
    .append('text')
    .attr('transform', 'rotate(-90)')
    .attr('y', 0 - margin.left + 40)
    .attr('x', 0 - height / 2)
    .attr('dy', '1em')
    .attr('class', 'axisText')
    .text('Lacks Healthcare (%)');

  // Append x-axis labels
  chart
    .append('text')
    .attr(
      'transform',
      'translate(' + width / 2 + ' ,' + (height + margin.top + 30) + ')',
    )
    .attr('class', 'axisText')
    .text('In Poverty (%)');
});

