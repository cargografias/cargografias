var elem= document.getElementById("selected-wrapper-2");
elem.addEventListener('build', function (e) {
   console.log('REFRESH VISUALIZATION',e);

  runViz(e);
}, false);

var datas = [4, 8, 15, 16, 23, 42];

var runViz = function(datas){
var x = d3.scale.linear()
    .domain([0, d3.max(datas)])
    .range([0, 420]);
var y = d3.scale.ordinal()
    .domain(datas)
    .rangeBands([0, 120]);

var chart = d3.select(".content")
  .append("svg:svg")
    .attr("class", "chart")
    .attr("width", 440)
    .attr("height", 140)
    .style("margin-left", "32px") // Tweak alignment…
  .append("svg:g")
    .attr("transform", "translate(10,15)");

chart.selectAll("line")
    .data(x.ticks(10))
  .enter().append("svg:line")
    .attr("x1", x)
    .attr("x2", x)
    .attr("y1", 0)
    .attr("y2", 120)
    .attr("stroke", "#ccc");

chart.selectAll("text.rule")
    .data(x.ticks(10))
  .enter().append("svg:text")
    .attr("x", x)
    .attr("y", 0)
    .attr("dy", -3)
    .attr("text-anchor", "middle")
    .text(String);

chart.selectAll("rect")
    .data(datas)
  .enter().append("svg:rect")
    .attr("y", y)
    .attr("width", x)
    .attr("height", y.rangeBand());

chart.selectAll("text.bar")
    .data(datas)
  .enter().append("svg:text")
    .attr("class", "bar")
    .attr("x", x)
    .attr("y", function(d) { return y(d) + y.rangeBand() / 2; })
    .attr("dx", -3)
    .attr("dy", ".35em")
    .attr("text-anchor", "end")
    .text(String);

chart.append("svg:line")
    .attr("y1", 0)
    .attr("y2", 120)
    .attr("stroke", "#000");



}
runViz(datas);
