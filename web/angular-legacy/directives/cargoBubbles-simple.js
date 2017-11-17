
'use strict';

/* Directives */

/* based on http://bl.ocks.org/mbostock/4063269 */

angular.module('cargoApp.directives').
  directive('ngCargobubbles', function() {
    return {
      template: '<div id="bubbles"></div>',
      controller: ['$scope', '$http', function($scope) {
          console.log('controller');
      }],
      link: function($rootScope, $scope, iElement, iAttrs, ctrl) {

        
        var startBubbles = function(data){
          
          $("#bubbles").html('');

          var diameter = 960/2,
                format = d3.format(",d"),
                color = d3.scale.category20c();

            var bubble = d3.layout.pack()
                .sort(null)
                .size([diameter, diameter])
                .padding(1.5);

            var svg = d3.select("#bubbles").append("svg")
                .attr("width", diameter)
                .attr("height", diameter)
                .attr("class", "bubble");

            
            var node = svg.selectAll(".node")
                .data(bubble.nodes(classes(data))
                .filter(function(d) { return !d.children; }))
              .enter().append("g")
                .attr("class", "node")
                .attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; });

            node.append("title")
                .text(function(d) { return d.className + ": " + d.position; });

            node.append("circle")
                .attr("r", function(d) { return d.r; })
                .style("fill", function(d) { return color(d.packageName); });

            node.append("text")
                .attr("dy", ".3em")
                .style("text-anchor", "middle")
                .text(function(d) { return d.className; });

            node.append("text")
                .attr("dy", "16")
                .style("text-anchor", "middle")
                .style("font-size", "10px")
                .text(function(d) { return "("+d.position+")"; });


            // Returns a flattened hierarchy containing all leaf nodes under the root.
            function classes(root) {
              var classes = [];

              function recurse(name, node) {

                if (node.children) node.children.forEach(function(child) { recurse(node.name, child); });
                else classes.push({packageName: name, className: node.name, position: node.position, value: node.size});
              }

              recurse(null, root);
              return {children: classes};
            }

            d3.select(self.frameElement).style("height", diameter + "px");
          
         };


         $rootScope.yearObserver.push(startBubbles);



      }
    }
 });


