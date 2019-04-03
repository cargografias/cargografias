window.cargo  =  window.cargo || {};
window.cargo.plugins  = window.cargo.plugins || {};
window.cargo.plugins.territory =  {
	key: "territory",
	boxHeight: 27,
	height: 0,
	data : [],
	counter:[],
	colorScale: function(i){
		return colores_google(i);
	},
	count : function(){
    	return territories.length;
	},
	processData: function(){
	  this.counter =[];
	  this.data = [];
	  //territories.processData
      //clear all;
      var territories = [];
      //find all other territories by region and province
      var territoriesArray = data.map(function(d) {
      	var map = d.memberships.map( function(z){
      		var area = z.area ? z.area.name : "AREA-NOT-FOUND";
      		return  area.capitalize() + "-" + z.role ;
      });
      return map;
  	})
      //and now we remove duplicates
      territoriesArray = d3.merge(territoriesArray);
      $.each(territoriesArray, function(i, el){
        if($.inArray(el, territories) === -1) territories.push(el);
      });
      //now we order them
      territories.sort(function(a, b){ return d3.ascending(a, b);});

      //now we count instances
      var counter = territories.reduce(function (acc, curr) {
      	var key  = curr.split('-')[0];
		  if (typeof acc[key] == 'undefined') {
		    acc[key] = 1;
		  } else {
		    acc[key] += 1;
		  }
		  return acc;
		}, {});


      this.data = territories.map(function(d,i){
      	var group = d.split('-')[0];
      	return {
      			index: i,
      			label : group,
      			key : d,
      			count: counter[group]
      		};

      	});
      var i = 0;
      for(x in counter){
      	this.counter.push({
      		label:x,
      		name: x,
      		index:i,
      		count:counter[x],
      		firstIndex: this.data.filter(
      			function(d,i) {
      				if (d.label === x)
      				return d;
      		})[0].index
      	});
      	i++;
      };


	},
	processIndex: function(d,i){
		var area = d.area ? d.area.name : "AREA-NOT-FOUND";
        var key = area.capitalize() + '-' + d.role;
        d.territoryPosition  = this.data.filter(
        	function(d) { if (d.key === key)  return d;})[0].index;

	},
	setBoxHeight: function(){
		if (controls.height == "territory")
		{
 			hei = (this.data.length * this.boxHeight)+100;
    		barHeight = (hei - padding.top - padding.bottom) / this.data.length;
		 }
	},
	updateBoxes: function(d,i){
		this.setBoxHeight();

            //Overwrites years
            //depends on total of type of memberships
		 scales.indexes = d3.scale.linear()
              .domain([ 0,  this.data.length - 1 ])
              .range([ padding.top, hei - padding.bottom - barHeight ]);

			var transform = {
				tx: scales.years(d.start),
				ty: scales.indexes(d.territoryPosition)
			};
			return transform;

	},
updatePreviouslGraphs:function(){

	  this.setBoxHeight();


	  var backgroundG = vis.select('g.backgroundContainer');
	  if (backgroundG.empty()){
	  	backgroundG = vis.append('g').attr('class', 'backgroundContainer');
	  }


	  var groupBackgrounds =
	  backgroundG.selectAll('rect.backgroundGroup')
	    .data(this.counter, function(d,i){ return d.index;});

	  groupBackgrounds.enter()
	    .append('rect')
	    .attr('class', 'backgroundGroup')
      	.attr("x", function(){ return padding.left / 8.5 ;})
		.attr("y", function(d,i) {return (d.firstIndex)*(barHeight) + padding.top;})




	 groupBackgrounds
	 	.transition()
      	.duration(transitionDuration)
      	.style("opacity", function(d) {
		    //On CarreerMeter hide years.
		    if (controls.height == "territory"){
	         return 1;
	     	}
	     	else {
	     		return 0;
	     	}
		})

		.attr('width', '100%')
		.attr('height', function(d,i){ return ((d.count)*(barHeight)+20) + 'px'})
		.attr("x", function(){ return padding.left / 8.5;})
		.attr("y", function(d,i) {return (d.firstIndex)*(barHeight) + padding.top;})


	 groupBackgrounds.exit().remove();

},
updateAdditionalGraphs:function(d,context){


		if (controls.height != "memberships" && controls.height != "territory"){
        	$("svg.vis path").css('opacity',0);
        	return;
        }
        else if (controls.height == "territory"){



			var curves = d3.select(context)
				.selectAll('path.curves')
		        .data(d.memberships, function(d,i){ return i;});

	        curves.enter()
		        .append('path')
		        .attr('class', 'curves bezier')
		       	.attr('index',d.position)
		        .style('opacity', 0)
		        .attr('fill', 'none')
		        .attr('stroke', 'red')
		        .attr('stroke-width', '2px');

	        var controlLenght = 20;




	        curves
		        .transition()
		        .duration(transitionDuration)
		        .style('opacity', 1)
		        .attr('d', function(d) {
		        	if (!d.after || !d.pre){
		        		return "";
		        	}
		        //Scale Left
		          var fromX = scales.years(d.end) ;
		          var fromY = scales.indexes(d.territoryPosition) + barHeight /2;

				//Jump!
		          var control1X = fromX + controlLenght;
		          var control1Y = fromY;

		        //Scale Right
		          var toX = scales.years(d.after.start) - 2;
		          var toY = scales.indexes(d.after.territoryPosition) + barHeight /2;
		        //Jump!
		          var contorl2X = toX - controlLenght;
		          var control2Y = toY;

		          //From here! http://www.sitepoint.com/html5-svg-cubic-curves/
		          var b = "M" + fromX + "," + fromY + " C" + control1X + "," + control1Y + " " + contorl2X + "," + control2Y + " " + toX + "," + toY;

		          return b;

		        }).attr('stroke', function(d) {
		          return window.cargo.plugins.territory.colorScale(d.parent);
		        });

		       console.log('nice draw')

	        curves.exit().remove();
    	}
	},
	updateLabels: function(){

	  this.setBoxHeight();

	  var labels = vis.selectAll('text.territoryLabel')
	    .data(this.counter, function(d,i){ return d.name;});

	  labels.enter()
	    .append('text')
	    .attr('class', 'territoryLabel')
      	.attr("x", function(d,i){ return padding.left / 7;})
		.attr("y", function(d,i) {return (d.firstIndex)*(barHeight) + padding.top;})




	 labels
	 	.transition()
      	.duration(transitionDuration)
      	.style("opacity", function(d) {
		    //On CarreerMeter hide years.
		    if (controls.height == "territory"){
	         return 1;
	     	}
	     	else {
	     		return 0;
	     	}
		}).attr('dy','.33em')
      	.attr("x", function(){ return padding.left / 7;})
      	.attr("y", function(d,i) {return (d.firstIndex)*(barHeight) + barHeight/2+ padding.top;})
      	.text(function(d,i) {
      		if (controls.height == "territory"){
      			return d.label;
      		}
      		else {
      			return "";
      		}


	    });



	 labels.exit().remove();





	},
	updateIndexLabel: function(){
		return '';
	},
	getYearTickPosition: function(){
		return padding.left;
	},
	showOnlyHim: function(e,i){
		if (controls.height == "territory" || controls.height =="memberships"){

			$("svg.vis path[index!=" + i + "]").css('opacity',0.2);
  			$("svg.vis path[index=" + i + "]").css('opacity',1);
  		}
  		else {
  			$("svg.vis path").css('opacity',0);
  		}
	},
	showAll: function(e,i){
		if (controls.height == "territory" || controls.height =="memberships"){
			$("svg.vis path").css('opacity',1);
		}
		else {

			$("svg.vis path").css('opacity',0);
		}
	},

}
