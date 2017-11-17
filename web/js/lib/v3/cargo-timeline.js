
var wid, hei;
var transitionDuration = 800;
var started = false;
var data = [];
var memberships = [];
var scales = {};
var totals = {};
var maxYear, minYear = 0;
var vis;
var padding = { top: 40, right: 30, bottom: 30, left: 240 }
var barHeight = 10;
var defaultPopPercent = .08;
var boxHeight = 35;
var totalmemberships = 0 ;
var waitStart = false;
var controls = {
  display: "aligned",
  height: "fixed"
}





function setVisSize() {

  wid = $(window).width() - 2;
  hei = ($(window).height()/1.5) - 100;

  $(".vis").attr("width", wid).attr("height", hei);
  $(".vis .background").attr("width", wid).attr("height", hei);

}

// $(window).resize(reloadTimeline);

function reloadTimeline(callback){
  if (!started){
    setVisSize();
    setBasicsParams();
    started = true;
  }
  // started = true;
  // setBasicsParams();
  // setVisSize();
  // process data for scales, etc.
  processData();
  drawstarting();
  addInteractionEvents();


  var defaultFilterCallback = function() {
      setControl($("#controls #layoutControls #layout-timeline"), "display", "timeline", false);
      setControl($("#controls #heightControls #height-area"), "height", "contiguous", true);
      setControl($("#controls #groupControls #group-name"), "group", "name", true);
  };
  if (!callback){
    callback = defaultFilterCallback;
  }


  setTimeout(callback, 500);


}


function setBasicsParams(){

  //remove old svg
  //TODO: is it another way of doing this?
  d3.select("div.vis svg").remove();

  vis = d3.select("div.vis")
    .append("svg:svg")
    .attr("class", "vis");

  totals.area = d3.sum(data, function(d) { return d3.sum(d.memberships, function(p){ return p.Land_area_million_km2; }) });
  totals.population = d3.sum(data, function(d) { return d3.sum(d.memberships, function(p){ return p.Estimated_Population; }) });

  totals.popPercent = d3.sum(data, function(d) {
    if (isNaN(d.Percent_World_Population)) return defaultPopPercent;
    else return d.Percent_World_Population;
    });
  //Append Fonts!
  vis
    .append('def')
    .append('style')
    .attr("type", "text/css")
    .text('@import url(http://fonts.googleapis.com/css?family=RobotoDraft:400,500,700,400italic);')



}




/************************************************************
 * Process the data once it's imported
 ***********************************************************/

function processData() {


    maxYear = d3.max(data, function(d) {  return d3.max(d.memberships, function(inner) {  return inner.end    }) });
    minYear = d3.min(data, function(d) {  return d3.min(d.memberships, function(inner) {  return inner.start; }) });
    scales.years = d3.scale.linear()
      .domain([ minYear,maxYear])
      .range([ padding.left, wid - padding.right ]);



    totalmemberships = d3.sum(data, function(d){return d.memberships.length});



    if (controls.height == "memberships")
    {
        hei = (totalmemberships* boxHeight) + 100;
    }
    else{

        hei = (data.length * boxHeight)+100;
    }


    barHeight = (hei - padding.top - padding.bottom) / data.length;

    scales.indexes = d3.scale.linear()
      .domain([ 0,  totalmemberships- 1 ])
      .range([ padding.top, hei - padding.bottom - barHeight ]);


    scales.colorsScale = d3.scale.category20();


    scales.politicians = function(a) {
      return barHeight ;
    }

    scales.areas = function(a) {
      var percentage = a / totals.area;
      var range = hei - padding.top - padding.bottom;
      return range * percentage;
    }

    scales.popPercents = function(a) {
      if (isNaN(a)) a = defaultPopPercent;
      var percentage = a / totals.popPercent;
      var range = hei - padding.top - padding.bottom;
      return range * percentage;
    }


    //clear all;
    memberships = [];
    //find all other memberships by region and province
    var membershipsArray = data.map(function(d) { return d.memberships.map( function(z){ return z.role + "-" + z.organization.name }); })
    //and now we remove duplicates
    membershipsArray = d3.merge(membershipsArray);
    $.each(membershipsArray, function(i, el){
      if($.inArray(el, memberships) === -1) memberships.push(el);
    });
    //now we order them
    memberships.sort(function(a, b){ return d3.ascending(a, b);});





    // calculate ordering items
    var y_area = padding.top;
    // Height
    var y_popPercent = padding.top;
    for(i = 0; i < data.length; i++) {
      data[i].position = i;
      //Check sort by date
      d = data[i].memberships = data[i].memberships.sort(function(a, b){ return d3.ascending(a.start, b.start); });
      for (var j = 0; j < d.length; j++) {
        d[j].area_y = y_area;

        y_area += scales.areas(d[j].Land_area_million_km2);

        d[j].popPercent_y = y_popPercent;
        if (isNaN(d[j].Percent_World_Population)) y_popPercent += scales.popPercents(defaultPopPercent);
        else y_popPercent += scales.popPercents(d[j].Percent_World_Population);

        d[j].politician = data[i];
        d[j].parent = i;

        d[j].position = j;
        //Post Position
        d[j].membershipsPosition = memberships.indexOf(d[j].role + "-" + d[j].organization.name);


        //Save previous year reference to be uses on carrear compare

        if (j -1 >=0){
          d[j].pre = d[j-1];
        }
        else{
         d[j].pre = {start:0, pre:0, tx:0} ;
        }


      };


    }




}

/************************************************************
 * Initial rendering of the vis
 ***********************************************************/

function drawstarting() {

  // background
  vis.append("svg:rect")
    .attr("class", "background")
    .attr("x", 0)
    .attr("y", 0)
    .attr("width", wid)
    .attr("height", hei);

  // year ticks
  vis.selectAll("line")
    .data(scales.years.ticks(10))
    .enter().append("svg:line")
      .attr("class", "tickLine")
      .attr("x1", padding.left)
      .attr("x2", padding.left)
      .attr("y1", padding.top)
      .attr("y2", hei - padding.bottom);

  // empire containers
  vis.selectAll("g")
    .data(data)
    .enter()
    .append("svg:g")
      .each(function(politician, j){

        var memberships = d3.select(this)
        .selectAll('g')
        .data(politician.memberships);

        memberships.enter()
        .append("svg:g")
        .attr("class", "barGroup")
        .attr("index", function(d, i) { return j; })
        .attr("membership", function(d, i) { return i; })

        .attr("transform", function(d, i) { return "translate(" + (i*100) + ", " + (j*barHeight) + ")"; })
        .append("svg:rect")
        .attr("class", function(d) {
          //TODO: change to type and region?
          return "bar " + d.post.cargotipo.toLowerCase()  + " " + d.organization.level.toLowerCase() + " " + d.role.toLowerCase();
        })
        .attr("x", 0)
        .attr("y", 0)
        // .attr("ry", 10)
        // .attr("rx", 10)
        .attr("width", function(d) { return scales.years(d.end) - scales.years(d.start); })
        .attr("height", barHeight)
         // peak lines
        .selectAll("g.barGroup")
        .append("svg:line")
        .attr("class", "peakLine")
        //TODO: What should we do with peaks?
        //.attr("x1", function(d) { return scales.years(d.Peak) - scales.years(d.start); })
        //.attr("x2", function(d) { return scales.years(d.Peak) - scales.years(d.start); })
        .attr("x1", function(d) { return scales.years(d.start) - scales.years(d.start); })
        .attr("x2", function(d) { return scales.years(d.start) - scales.years(d.start); })

        .attr("y1", 0)
        .attr("y2", barHeight);



        d3.select(this)
          .append('svg:text')
          .attr('class', 'group')
          .attr('class', 'itemLabel')
          .attr('dy','.33em')
          .attr("x", padding.left / 9)
          .attr("y", (j+1)*(barHeight/2) )
          .text(function(d) {
            return d.name;

          });


      });



  // bar labels
  vis.selectAll("g.barGroup")
    .append("svg:text")
      .attr("class", "barLabel")
      .attr("x", function(d) {
        return scales.years(d.start); })
      .attr("y", 0);




  // tick labels
  vis.selectAll("text.rule")
    .data(scales.years.ticks(10))
    .enter().append("svg:text")
      .attr("class", "rule")
      .attr("x", padding.left)
      .attr("y", 20)
      .attr("dy", 0)
      .attr("text-anchor", "middle")
      .text(function(d) { return formatYear(d); });



  //axis y dimension. This can be done with any posible feed!
  var heightMemberships = (hei - padding.top - padding.bottom) / memberships.length;
  vis.selectAll('text.membershipLabel')
    .data(memberships)
    .enter()
    .append('svg:text')
    .attr('class', 'membershipLabel')
    .attr('dy','.33em')
    .attr("x", padding.left / 7)
    .attr("y", function(d,i) { return (i+1.5)*heightMemberships })
    .text(function(d) {
      return d;
    });



}

/************************************************************
 * Redraw the vis with transition
 ***********************************************************/

function redraw() {

  $("#infobox").hide();

  var visCenter = (wid - padding.left - padding.right) / 2 + padding.left;

  //reload height
  hei = ($(window).height()/1.5);

  if (controls.height == "memberships")
  {
     if(memberships.length > 3){
      hei = (totalmemberships * boxHeight/2)+75 ;

     }else {
      hei = (totalmemberships* boxHeight) +75;
    }

  }
  else{
     if(data.length > 3){
      hei = (data.length * boxHeight)
     }else {
      hei = (data.length * boxHeight)+75;
    }
  }

  d3.selectAll('.vis')
    .transition()
    .attr('height', hei);

  d3.selectAll('.background')
    .transition()
    .attr('height', hei);





  // year ticks
  vis.selectAll("line.tickLine")
    .transition()
      .duration(transitionDuration)
      .style("opacity", function(d) {
        //On CarreerMeter hide years.
        if (controls.display == "aligned")  return 0;
        else return 1;
      })
      .attr("x1", function(d, i) {
        if (controls.display == "timeline") return scales.years(d);
        else if (controls.display == "centered") return visCenter;
        //On CarreerMeter move years to left
        else return padding.left;
      })
      .attr("x2", function(d) {
        if (controls.display == "timeline") return scales.years(d);
        else if (controls.display == "centered") return visCenter;
        //On CarreerMeter move years to left
        else return padding.left;
      })
      .attr("y1", padding.top)
      .attr("y2", hei - padding.bottom);





  // empire containers
  vis.selectAll("g.barGroup")
    .transition()
      .duration(transitionDuration)
      .style("fill-opacity", function(d) {
        //if (controls.height == "population" && isNaN(d.Percent_World_Population)) return .4;
        //else
        return 1;
      })
      .attr("transform", function(d, i) {
        var tx, ty;
        //timeline modes.
        //TimeLine
        if (controls.display == "timeline") tx = scales.years(d.start);
        //TODO: What we should do with Peaks
        //else if (controls.display == "centered") tx = visCenter - (scales.years(d.Peak) - scales.years(d.start));
        else if (controls.display == "centered")
          tx = visCenter - (scales.years(d.start) - scales.years(d.start));


        //Carreer comparsion
        else if (controls.display == "aligned") {
          var first = scales.years.ticks()[0];
          if (d.position=== 0) tx = padding.left;
          else {



            tx = d.pre.tx +
            //width of the previous
            (scales.years(d.pre.end)- scales.years(d.pre.start)) +
            //distance between previous
            (scales.years(d.start) - scales.years(d.pre.end))
          }
        }





        if (controls.height == "memberships") {
            barHeight = (hei - padding.top - padding.bottom) / memberships.length;
            //Overwrites years
            //depends on total of type of memberships
            scales.indexes = d3.scale.linear()
              .domain([ 0,  memberships.length - 1 ])
              .range([ padding.top, hei - padding.bottom - barHeight ]);

          ty = scales.indexes(d.membershipsPosition);
        }
        else {
          barHeight = ((hei - padding.top - padding.bottom) / data.length);
          //depends on politicans
            scales.indexes = d3.scale.linear()
                .domain([ 0,  data.length - 1 ])
                .range([ padding.top, hei - padding.bottom - barHeight]);
          if (controls.height == "contiguous")  ty = scales.indexes(d.parent);
          else if (controls.height == "area") ty = d.area_y;
          else if (controls.height == "population") ty = d.popPercent_y;
          else ty = scales.indexes(i);
        }






        d.tx = tx;
        d.ty = ty;
        return "translate(" + tx + ", " + ty + ")";
      });



  // bars height!
  vis.selectAll("g.barGroup rect.bar")
    .transition()
      .duration(transitionDuration)
      .style("fill-opacity", function(d) {
        //if (controls.height == "population" && isNaN(d.Percent_World_Population)) return .25;
        //else
        return 1;
      })
      .style('fill', function(d){
         //Carreer comparsion
        if (controls.display == "aligned" && controls.height == "contiguous") {
          return scales.colorsScale(d.parent);
        }
        else if (controls.height == "memberships") {
          return scales.colorsScale(d.membershipsPosition);
        }
      })
      .attr("height", function(d) {
        if (controls.height == "contiguous") {
          return scales.politicians(d.parent);
        }
        else if (controls.height == "area") return scales.areas(d.Land_area_million_km2);
        else if (controls.height == "population") return scales.popPercents(d.Percent_World_Population);
        else return barHeight;
      });

    vis.selectAll("svg image")
        .attr("xlink:href",function(d){

          if (controls.height == "memberships"){ return '';}
          else return d.image;
        })
        .attr('width', 75)
        .attr('height', 75)
        .attr("x", padding.left / 7)
        .attr("y", function(d,i) {return (i)*barHeight/2;})

    vis.selectAll('svg text.itemLabel')
          .attr("x", padding.left / 7)
          .attr("y", function(d,i) {return (i)*barHeight + (barHeight/2) + padding.top;})
          .text(function(d,i) {
            if (controls.height == "memberships"){ return '';}
            else{ return d.name;}
          });

    vis.selectAll('text.membershipLabel')
          .attr("y", function(d,i) {return (i)*barHeight + (barHeight/2) + padding.top;})
          .text(function(d,i) {
            if (controls.height == "memberships"){ return d;}
            else{ return '';}
          });




 // labels
  vis.selectAll("g.barGroup")
    .selectAll("svg text")
      .attr("class", "barLabel")
      .attr("x", function(d) {
        return 0; })
      .attr("y", 0)
      .attr("dx", ".66em")
      .attr("dy", ".33em")
      .style("fill", function(d) { if (d.Contiguous === false) return "#0ff"; })
      .text(function(d) {
        //if (d.)
        if (controls.height == "memberships"){
          return d.politician.name; //TODO: when do we add the years? + "(" + d.start + "-"+ d.end + ")"  ;
        }
        else {
          return d.role; //TODO: when do we add the years? + "(" + d.start + "-"+ d.end + ")"  ;
        }
      });



  // bar labels
  var labelHeight = 0;
  vis.selectAll("g.barGroup text.barLabel")
    .transition()
      .duration(transitionDuration)
      .attr("y", function(d) {
        if (controls.height == "contiguous") {
          return scales.politicians(d.parent)/2;
        }
        else if (controls.height == "area") return scales.areas(d.Land_area_million_km2)/2 - labelHeight;
        else if (controls.height == "population") return scales.popPercents(d.Percent_World_Population)/2 - labelHeight;
        else return barHeight/2;
      });




  // peak lines
  vis.selectAll("g.barGroup line.peakLine")
    .transition()
      .duration(transitionDuration)
      .attr("y2", function(d) {
        if (controls.height == "contiguous") {
          return scales.areas(d.Land_area_million_km2);
        }
        else if (controls.height == "area") return scales.areas(d.Land_area_million_km2);
        else if (controls.height == "population") return scales.popPercents(d.Percent_World_Population);
        else return barHeight;
      });

  // tick labels
  vis.selectAll("text.rule")
    .transition()
      .duration(transitionDuration)
      .style("opacity", function(d) {
        //On CarreerMeter hide years.
        if (controls.display == "aligned")  return 0;
        else return 1;
      }).attr("x", function(d) {
        if (controls.display == "timeline") return scales.years(d);
        else if (controls.display == "centered") return visCenter;
        else return padding.left;
      })
      .attr("y", 20)
      .attr("dy", 0);

}

/************************************************************
 * Add interaction events after initial drawing
 ***********************************************************/
function addInteractionEvents() {

  // bar group hover
  $("g.barGroup").hover(function(e) {
    showInfoBox( e, $(this).attr("index"),  $(this).attr("membership")  );
    }
  );
  $(".vis .background, .vis .mouseLine").hover(function(e) {
    showInfoBox( e, null);
  });




}

/************************************************************
 * Display info box for data index i, at mouse
 ***********************************************************/
function showInfoBox(e, i, j) {


  //TODO: Cambiar por angular?

  if (i == null) $("#infobox").hide();
  else {
    //TODO: Can we move this to angular?
    var politician = data[i];
    var membership = politician.memberships[j];



    var info = "<span class='title'>" + politician.name + "</span>";
    info += "<br />";
    info += "<img src='" + politician.image + "'>" ;
    info += "<br />" + membership.role ;
    info += "<br />" + membership.organization.name ;
    info += "<br />" + formatYear(membership.start) + " - " + formatYear(membership.end);


    //Initial pos;
    var infoPos;
    if (i <= data.length/2) infoPos = { left: e.pageX, top: e.pageY };
    else infoPos = { left: e.pageX-200, top: e.pageY-80 };

    var classes = "bar " + membership.post.cargotipo.toLowerCase()  + " " + membership.organization.level.toLowerCase() + " " + membership.role.toLowerCase();
    //clear all clases
    document.getElementById('infobox').className = '';

    $("#infobox")
      .addClass(classes)
      .html(info)
      .css(infoPos)
      .show();
  }

}
//In order to isolate order/filtering this method will execute everthing
function setControlFix(o){
  var cb = getFilterCallback(o);
  if (!started){
    reloadTimeline(cb);
  }
  else {
    cb();
  }

}

function getFilterCallback(o){
  var cb = function(){};
  // 'membership' orderLine('height', 'memberships')
  if (o ==="memberships"){
    cb = function(){
        setControl($("#controls #heightControls #layout-timeline"), 'display', 'timeline', false);
        setControl($("#controls #heightControls #height-area"), 'height', o, true);
      };
  }
  // 'career' filterLine('display','aligned')
  else if (o ==="name"){
    cb = function(){
       setControl($("#controls #heightControls #layout-timeline"), 'display', 'timeline', true);
       setControl($("#controls #heightControls #height-area"), "height", "contiguous", true);
    };

  }
  // 'name 'orderLine('height', 'contiguous')
  else if (o ==="career"){
    cb = function(){
      setControl($("#controls #heightControls #layout-timeline"), 'display', 'aligned', true);
      setControl($("#controls #heightControls #height-area"),'height', 'contiguous', true);
    };
  }
  // 'timeline' filterLine('display','timeline')
  else{
    cb = function(){
       setControl($("#controls #heightControls #layout-timeline"), 'display', 'timeline', true);
       setControl($("#controls #heightControls #height-area"), "height", "contiguous", true);
    };
  }
  return cb;
}

function setControl(elem, con, val, re) {

  $(elem).parents(".controlGroup").find("a").removeClass("active");
  $(elem).addClass("active");
  controls[con] = val;
  if (re) redraw();
}

function parseTransform(s) {
  if (s.substr(0, 10) == "translate(") {
    s = s.substring(10, s.length-1);
    s = s.split(",");
    var v1 = parseFloat($.trim(s[0]));
    var v2 = parseFloat($.trim(s[1]));
  }
  return { val1: v1, val2: v2 };
}

function formatYear(y) {
  if (y <= 0) return y*-1 + " BCE";
  else return y;
}
