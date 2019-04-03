
window.cargo  =  window.cargo || {};
window.cargo.plugins  = window.cargo.plugins || {};
window.cargo.plugins.memberships =  {
	key: "memberships",
	boxHeight: 15,
	height: 0,
	data : [],
	colorScale: function(i){
		return colores_google(i);
	},
	count : function(){
    	return d3.sum(data, function(d){return d.memberships.length});
	},
	processData: function(){
	  //Memberships.processData
      //clear all;
      var memberships = [];
      //find all other memberships by region and province
      var membershipsArray = data.map(function(d) {  

      	var map = d.memberships.map( function(z){ 

      		var area = z.area ? z.area.name : "AREA-NOT-FOUND";
      		return z.role + "-" + area  ;
      }); 
      return map;
  	})
      //and now we remove duplicates
      membershipsArray = d3.merge(membershipsArray);
      $.each(membershipsArray, function(i, el){
        if($.inArray(el, memberships) === -1) memberships.push(el);
      });
      //now we order them
      memberships.sort(function(a, b){ return d3.ascending(a, b);});
      
      this.data = memberships.map(function(d,i){
      	return {
      			i: i,
      			key: d,
      			pos: d.split('-')[0],
      			org: d.split('-')[1]
      		}
      	});

	},
	processIndex: function(d,i){
		//Memberiship.ProcessIndex
        //d.membershipsPosition = 
        var area = d.area ? d.area.name : "AREA-NOT-FOUND";
        var key = d.role + "-" + area ;
        d.membershipsPosition = this.data.filter(
        	function(d) { if (d.key === key)  return d;})[0];
        

	},
	setBoxHeight: function(){
		if (controls.height == "memberships")
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
				ty: scales.indexes(d.membershipsPosition.i)
			};
			return transform;

	},
	updatePreviouslGraphs:function(d,context){
	

	},
	updateAdditionalGraphs:function(d,context){
		if (controls.height != "memberships" && controls.height != "territory"){
        	
	       	$("svg.vis path").css('opacity',0);
        	return;
        }
        else if (controls.height == "memberships"){

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
		        .attr('opacity', 1)
		        .attr('d', function(d) {
		        	if (!d.after || !d.pre){
		        		return "";
		        	}
		        //Scale Left
		          var fromX = scales.years(d.end) ;	
		          var fromY = scales.indexes(d.membershipsPosition.i) + barHeight /2;

				//Jump!
		          var control1X = fromX + controlLenght;
		          var control1Y = fromY;

		        //Scale Right
		          var toX = scales.years(d.after.start) - 2;	
		          var toY = scales.indexes(d.after.membershipsPosition.i) + barHeight /2;
		        //Jump!
		          var contorl2X = toX - controlLenght;
		          var control2Y = toY;

		          //From here! http://www.sitepoint.com/html5-svg-cubic-curves/
		          var b = "M" + fromX + "," + fromY + " C" + control1X + "," + control1Y + " " + contorl2X + "," + control2Y + " " + toX + "," + toY;

		          return b;

		        }).attr('stroke', function(d) {
		          return window.cargo.plugins.territory.colorScale(d.parent);
		        });
		        

	        curves.exit().remove();
	    	}

	},
	updateLabels: function(){
		this.setBoxHeight();
        
	  var labels = vis.selectAll('text.membershipLabel')
	    .data(this.data, function(d,i){ return d.key;});

	  var texts = labels.enter()
	    .append('text')
	    .attr('class', 'membershipLabel')
	    
	    
      	.attr("x", function(){ return padding.left / 7;})
		.attr("y", function(d,i) {return (i)*(barHeight) + padding.top;});

	var main = texts.append('tspan').attr('class','main');
	var subs  = texts.append('tspan').attr('class','sub');;

	    
	  
	 

	 labels
	 	.transition()
      	.duration(transitionDuration)
      	.style("opacity", function(d) {
		    //On CarreerMeter hide years. 
	        if (controls.height == "memberships")  return 1;
	        	else return 0;
		      })
      	.attr('dy','.33em')
      	.attr("x", function(){ return padding.left / 7;})
      	.attr("y", function(d,i) {return (i)*(barHeight) + barHeight/2+ padding.top;});

    labels.selectAll('tspan.main')
      	.text(function(d) {
	    	if (controls.height == "memberships"){ 
      			return d.pos + " - ";
      		}
      		else {
      			return "";
      		}
	    	
	    });
	labels.selectAll('tspan.sub')
      	.text(function(d) {
	    	if (controls.height == "memberships"){ 
      			return d.org;
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