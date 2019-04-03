var category20 = d3.scale.category20();
window.cargo  =  window.cargo || {};
window.cargo.plugins  = window.cargo.plugins || {};
window.cargo.plugins.degroup =  {
	key: "memberships",

	height: 0,
	data : [],
	colorScale: function(i){
		return category20(i);
	},
	count : function(){
    	return d3.sum(data, function(d){return d.memberships.length});
	},
	processData: function(){
	

	},
	processIndex: function(d,i){
		

	},
	setBoxHeight: function(){
		
	},
	updateBoxes: function(d,i){
	

	},
	updateAdditionalGraphs:function(d,context){
		
	

	  		
		    
	  		
	},
	updateIndexLabel: function(){
		return '';
	},
	getYearTickPosition: function(){
		return padding.left;     
	},
	showOnlyHim: function(e,i){
		
	},
	showAll: function(e,i){
		
	},

}