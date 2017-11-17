
var wid, hei;
var transitionDuration = 800;
var started = false;
var data = [];
var scales = {};
var totals = {};
var maxYear, minYear = 0;
var vis;
var padding = { top: 40, right: 30, bottom: 30, left: 240 }
var barHeight = 10;
var defaultPopPercent = .08;
var boxHeight = 30;
var waitStart = false;
var yearsPadding = 3;

var observers =[];

//TODO: move to loader? .init()?
var controls = {}
controls['display'] = 'timeline';
controls['height'] = 'contiguous';
controls['group'] = 'name';

var notify = {
  subscribe: function(o){
    observers.push(o);
  },
  remove: function(a){
    for (var i = 0; i < observers.length; i++) {
      observers[i].remove(a);
    };
  }
}

function setVisSize() {

  var mainWid = $('.main').width();

  if (mainWid > 980){
    wid = $(window).width() - 2;
    hei = ($(window).height()/1.5) - 100;
  }
  else {
    wid = 980;
    hei = 500;
  }

  $(".vis").attr("width", wid).attr("height", hei);
  $(".vis .background").attr("width", wid).attr("height", hei);

}

$(window).resize(reloadTimeline);

function reloadTimeline(){

  // process data for scales
  processData();

  //Creates the proper objects
  if (!started){
    setVisSize();
    setBasicsParams();
    started = true;
  }


  //D3 main enter
  refreshGraph();
  addInteractionEvents();





}


function setBasicsParams(){

  vis = d3.select("div.vis")
    .append("svg:svg")
    .attr("class", "vis");

    // background
  vis.append("svg:rect")
    .attr("class", "background")
    .attr("x", 0)
    .attr("y", 0)
    .attr("width", wid)
    .attr("height", hei);


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
      .domain([ minYear - yearsPadding ,maxYear + yearsPadding])
      .range([ padding.left, wid - padding.right ]);

    hei = (data.length * boxHeight)+100;



    barHeight = (hei - padding.top - padding.bottom) / data.length;

    // scales.indexes = d3.scale.linear()
    //   .domain([ 0,  totalmemberships- 1 ])
    //   .range([ padding.top, hei - padding.bottom - barHeight ]);


    scales.colorsScale = d3.scale.category10();


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

    //Todo: Move to plugin loader
    window.cargo.plugins.memberships.processData();
    window.cargo.plugins.territory.processData();

    // calculate ordering items
    var y_area = padding.top;
    // Height
    var y_popPercent = padding.top;

    var counter = 0;
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
        d[j].generalPosition = counter;




        window.cargo.plugins.memberships.processIndex(d[j],j);
        window.cargo.plugins.territory.processIndex(d[j],j);


        //Save previous year reference to be uses on carrear compare

        if (j -1 >=0){
          d[j].pre = d[j-1];
        }
        else{
         d[j].pre = {start:0, pre:0, tx:0} ;
        }

        //Used for beziers
        if (j+1 < d.length){
          d[j].after = d[j+1];
        }

        counter++;

      };


    }




}

/************************************************************
 * Initial rendering of the vis
 ***********************************************************/

function refreshGraph() {
  if (data.length == 0){
      d3.selectAll("div.vis svg").remove();

      started = false;
      return;
  }
  var visCenter = (wid - padding.left - padding.right) / 2 + padding.left;
  /************************************************************
  * reload height
  ***********************************************************/

  // hei = ($(window).height()/1.5);
  hei = (data.length  * boxHeight)+75 ;


  //Memberships.Height
  window.cargo.plugins.memberships.setBoxHeight();
  window.cargo.plugins.territory.setBoxHeight();
  // window.cargo.plugins.degroup.setBoxHeight();


  /************************************************************
  * Transition cargo size.
  ***********************************************************/

  d3.selectAll('.vis')
    .transition()
    .attr('width', wid)
    .attr('height', hei);

  d3.selectAll('.background')
    .transition()
    .attr('width', wid)
    .attr('height', hei);

  /************************************************************
  * If there is no items, just remove the vis.
  ***********************************************************/


  window.cargo.plugins.memberships.updatePreviouslGraphs();
  window.cargo.plugins.territory.updatePreviouslGraphs();



  /************************************************************
  * Refresh Years domain based upon the processData.
  ***********************************************************/

  scales.years = d3.scale.linear()
      .domain([ minYear,maxYear + yearsPadding])
      .range([ padding.left, wid - padding.right ]);

  /************************************************************
  * Process Years
  ***********************************************************/
  var yearsNumbers = scales.years.ticks(10);

  /************************************************************
  * Add Years Lines
  ***********************************************************/
  var yearTicks = vis.selectAll("line.tickLine")
    .data(yearsNumbers);


  yearTicks.enter().append("line")
      .attr("class", "tickLine")
      .attr("x1", padding.left)
      .attr("x2", padding.left)
      .attr("y1", padding.top)
      .attr("y2", hei - padding.bottom);


  yearTicks.transition().duration(transitionDuration)
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
        else if (controls.display == "memberships") return window.cargo.plugins.memberships.getYearTickPosition();
        else if (controls.display == "territory") return window.cargo.plugins.territory.getYearTickPosition();
        else return padding.left;
      })
      .attr("y1", padding.top)
      .attr("y2", hei - padding.bottom);

  yearTicks.exit().remove();


  /************************************************************
  * Process Politicians names
  ***********************************************************/



  var names = vis.selectAll("g.group")
    .data(data, function(d){return d.id;});

  var gg = names.enter().append("g")
    .attr('class', 'group');

    names.each(function(politician, j){



      var memberships =
          d3.select(this)
            .selectAll("g.barGroup")
            .data(politician.memberships, function(d,i){ return d.id;});


      ///Set current height
      barHeight = ((hei - padding.top - padding.bottom) / data.length);
      //Set a index for boxes, from padding top to hei - padding top
      scales.indexes = d3.scale.linear()
            .domain([ 0,  data.length - 1 ])
            .range([ padding.top, hei - padding.bottom - barHeight]);




      memberships.enter()
            .append("g")
            .attr("class", function(d) {
	      if(!d.type){
		return "barGroup bar";
	      }
              if(d.organization){
                return "barGroup bar " + d.type.toLowerCase()  + " " + d.organization.level.toLowerCase() + " " + d.role.toLowerCase();
              }else{
                return "barGroup bar " + d.type.toLowerCase()  + " " + d.role.toLowerCase();

              }
            })
            .style("fill-opacity", function(d) {
                return 1;
            })
      memberships.attr("index", function(d, i) { return j; })
            .attr("membership", function(d, i) { return i; })


      memberships.append('rect')
            .attr("rx", 6)
            .attr("ry", 6)

            .attr("index", function(d, i) { return j; })
            .attr("membership", function(d, i) { return i; })
            .attr("class", function(d) {
              //TODO: change to type and region?
		if(!d.type){
			return "barGroup bar";
		}
            if(d.organization){
              return "barGroup bar " + d.type.toLowerCase()  + " " + d.organization.level.toLowerCase() + " " + d.role.toLowerCase();

            }else{
              return "barGroup bar " + d.type.toLowerCase()  +  " " + d.role.toLowerCase();

            }
            })
            .style("fill-opacity", function(d) {
                return 1;
            })



    var processTransform =function(d, i) {
                var transform = {
                  tx:0,
                  ty:0
                };
                //TimeLine
                if (controls.display == "timeline") {
                    transform.tx = scales.years(d.start);
                    transform.ty = scales.indexes(d.parent);
                }

                //CareerMeeter
                else if (controls.display == "aligned") {
                  var first = scales.years.ticks()[0];

                  if (d.position=== 0) {
                    transform.tx = padding.left;
                  }
                  else {
                    transform.tx =d.pre.tx +
                    //width of the previous
                    (scales.years(d.pre.end)- scales.years(d.pre.start)) +
                    //distance between previous
                    (scales.years(d.start) - scales.years(d.pre.end))
                  }
                  transform.ty = scales.indexes(d.parent);
                }

                if (controls.height == "memberships") {
                  transform = window.cargo.plugins.memberships.updateBoxes(d,i);

                }
                else if (controls.height == "territory"){
                  transform = window.cargo.plugins.territory.updateBoxes(d,i);
                }


                d.tx = transform.tx;
                d.ty = transform.ty;
                return "translate(" + transform.tx + ", " + transform.ty + ")";
            };
    memberships.select('g')
          .attr("index", function(d, i) { return j; })
          .attr("membership", function(d, i) { return i; });
      memberships.select('rect')
        .transition()
          .duration(transitionDuration)
          .attr("index", function(d, i) { return j; })
          .attr("membership", function(d, i) { return i; })
          .style("fill-opacity", function(d) {
                          return 1;
                })
               .style("fill", function(d) {
                      //Color goes by CSS selectors
                      d.color = '';
                      if (controls.height == "memberships") {
                          d.color  = window.cargo.plugins.memberships.colorScale(politician.position);
                      }
                      else if (controls.height == "territory") {
                          d.color  = window.cargo.plugins.territory.colorScale(politician.position);
                      }
                      return d.color;

                })


          .attr("transform", processTransform)
          .attr("width", function(d) {
            var duration  = d.end -d.start;
            var rightPadding = 0;
            if (duration == 0){
              rightPadding = 0.5;
            }
            return scales.years(d.end + rightPadding) - scales.years(d.start); })
          .attr("height", barHeight) //ask this to current plugin.


    if (!memberships.select('text')[0][0]){
      var newLabels = memberships
        .append('text')
        .attr('class','boxLabel');

      newLabels
        .append('tspan')
        .attr('class','main')
      newLabels
        .append('tspan')
        .attr('class','sub');

    }

    var labels = memberships.selectAll('text.boxLabel');

    labels
        .attr("dx", ".66em")
        .attr("dy", ".10em")
        .transition()
        .duration(transitionDuration)
        .attr("transform", processTransform);//enter
    labels.select('tspan.main')
        .attr('x',0)
        .attr('dy','1.2em')
        .text(function(d) {
              //if (d.)
              if (controls.height == "memberships"){
                return d.politician.family_name; //TODO: when do we add the years? + "(" + d.start + "-"+ d.end + ")"  ;
              }
              else if (controls.height == "territory"){
                return d.politician.family_name; //TODO: when do we add the years? + "(" + d.start + "-"+ d.end + ")"  ;
              }
              else {
                return d.role; //TODO: when do we add the years? + "(" + d.start + "-"+ d.end + ")"  ;
              }
        });
    labels.select('tspan.sub')
        .attr('x',0)
        .attr("dx", ".66em")
        .attr('dy','1.2em')
        .text(function(d) {
              //if (d.)
              if (controls.height == "memberships"){
                return '' //TODO: when do we add the years? + "(" + d.start + "-"+ d.end + ")"  ;
              }
              else if (controls.height == "territory"){
                return d.role; //TODO: when do we add the years? + "(" + d.start + "-"+ d.end + ")"  ;
              }
              else {
		              return d.area.name; //TODO: uncomment after sinar test
                //return d.area.name ; //TODO: when do we add the years? + "(" + d.start + "-"+ d.end + ")"  ;
              }
        })


    memberships.exit().transition()
          .duration(transitionDuration).remove();

    window.cargo.plugins.memberships.updateAdditionalGraphs(politician,this);
    window.cargo.plugins.territory.updateAdditionalGraphs(politician,this);

    });

  names.exit().remove();


  // empire containers
      vis.selectAll("g.barGroup")
        .transition()
          .duration(transitionDuration)
          .style("fill-opacity", function(d) {
            //if (controls.height == "population" && isNaN(d.Percent_World_Population)) return .4;
            //else
            return 1;
          });

//Memberships.UpdateLabel
  window.cargo.plugins.memberships.updateLabels();
  //Territory.UpdateLabel
  window.cargo.plugins.territory.updateLabels();
  /************************************************************
  * Process Labels
  ***********************************************************/

  gg.append('text')
    .attr('class', 'group')
    .attr('class', 'itemLabel')
    .attr('dy','.33em')
    .attr("x", padding.left / 9)
    .attr("y", function(d,i){
      return (i+1)*(barHeight/2) ;
    })
    .text(function(d) {

      return d.name;

    });
    gg.append('text')
    .attr('class', 'group')
    .attr('class', 'otemLabel')
    .attr('dy','.33em')
    .attr("x", padding.left / 9)
    .attr("y", function(d,i){
      return (i+1)*(barHeight/2) ;
    })
    .text(function(d) {

      return '(x)';

    });


  vis.selectAll('svg text.itemLabel')
        .attr("x", padding.left / 7)
        .attr("y", function(d,i) {

          return (d.position)*barHeight + (barHeight/2) + padding.top;

        })
        .text(function(d,i) {
          //Memberships.IndexLabel
          if (controls.height == "memberships"){ return window.cargo.plugins.memberships.updateIndexLabel();}
          else if (controls.height == "territory"){ return window.cargo.plugins.territory.updateIndexLabel();}
          else{
            if(d.family_name){
              return d.initials +  " " + d.family_name;
            }else{
              return d.initials;
            }

          }
        }).on('click',function(d,i){
           window.open(d.cargoProfileURL);
        });
  vis.selectAll('svg text.otemLabel')
        .attr("x", function(d,i){

          return padding.left -60;
        })
        .attr("y", function(d,i) {
          return (d.position)*barHeight + (barHeight/2) + padding.top;

        })
        .text(function(d,i) {
          //Memberships.IndexLabel
          if (controls.height == "memberships"){ return window.cargo.plugins.memberships.updateIndexLabel();}
          else if (controls.height == "territory"){ return window.cargo.plugins.territory.updateIndexLabel();}
          else{ return '   x  '}
        }).on('click',function(d,i){
           notify.remove(d);
        });












  /************************************************************
  * Add Years Labels
  ***********************************************************/


  var yearLabelsSelection =
    vis.selectAll("text.rule")
      .data(yearsNumbers, function(d,i){ return i;});

  yearLabelsSelection
      .enter()
      .append("text")
      .attr("class", "rule")
      .attr("text-anchor", "middle");

  // tick labels
  yearLabelsSelection
    .transition()
      .duration(transitionDuration)
      .style("opacity", function(d) {
        //On CarreerMeter hide years.
        if (controls.display == "aligned")  return 0;
        else return 1;
      }).attr("x", function(d) {
        if (controls.display == "timeline") return scales.years(d);
        else if (controls.display == "centered") return visCenter;
        else if (controls.display == "memberships") return window.cargo.plugins.memberships.getYearTickPosition();
        else if (controls.display == "territory") return window.cargo.plugins.territory.getYearTickPosition();
        else return padding.left;
      })
      .attr("y", 20)
      .attr("dy", 0);
  yearLabelsSelection
    .text(function(d) { return formatYear(d); });


  yearLabelsSelection.exit().remove();


}





//In order to isolate order/filtering this method will execute everthing
function reloadCargoTimeline(o){

  setControls(o);
  reloadTimeline();

}

function setControls(o){

  //Membership.Action
  if (o ==="memberships"){
       controls['display'] = 'timeline';
       controls['height'] = 'memberships';
  }
  //Membership.Action
  else if (o ==="territory"){
       controls['display'] = 'timeline';
       controls['height'] = 'territory';
  }
  // 'name 'orderLine('height', 'contiguous')
  else if (o ==="career"){
      controls['display'] = 'aligned';
      controls['height'] = 'contiguous';
  }
  // 'timeline' filterLine('display','timeline')
  else{
      controls['display'] = 'timeline';
      controls['height'] = 'contiguous';
      controls['group'] = 'name';
  }
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

//TODO > Move to plugin?
/************************************************************
 * Add interaction events after initial drawing
 ***********************************************************/
function addInteractionEvents() {
  var $tooltipEl  = $("#infobox");
  // bar group hover
  $("g.barGroup").on('mouseover', function(e) {
      showInfoBox( e, $(this).attr("index"),  $(this).attr("membership")  );
      showOnlyHim(e,$(this).attr("index"));
    }
  );
   $("g.barGroup").on('mouseout', function(e) {
     $tooltipEl.css('display', 'none');
     showAll(e,$(this).attr("index"));
  });

  $("g.barGroup").on('mousemove', function(e) {
      $tooltipEl.css('top', event.pageY + 2 + 'px');
      $tooltipEl.css('left', event.pageX + 10 + 'px');

  });

}


/************************************************************
 * Highlight all persons posts
 ***********************************************************/

function showOnlyHim(e,i){
  $("g.barGroup[index!=" + i + "]").css('opacity',0.2);
  $("g.barGroup[index=" + i + "]").css('opacity',1);
  //TODO: How to include plugins here?
  window.cargo.plugins.memberships.showOnlyHim(e,i);
  window.cargo.plugins.territory.showOnlyHim(e,i);

}
function showAll(e,i){
  $("g.barGroup").css('opacity',1);
  //TODO: HOw to include plugins here?
  window.cargo.plugins.memberships.showAll(e,i);
  window.cargo.plugins.territory.showAll(e,i);

}

/************************************************************
 * Display info box for data index i, at mouse
 ***********************************************************/
function showInfoBox(e, i, j) {

    //TODO: Can we move this to angular
    var politician = data[i];
    var membership = politician.memberships[j];

    var info = "";
    if (politician.image){
      info += "<img class='pic' src='" + politician.image + "'>";
    }
    info += "<p class='title'>" + politician.name + "</p>";
    info += "<p class='mid'>" + membership.role  + "</p>";
    if(membership.organization){
        info += "<p class='sub'>" + membership.organization.name  + "</p>";
    }
    if(membership.area){
      info += "<p  class='mid'>" + membership.area.name  + "</p>";
    }else{
      if(membership.organization){
        if(membership.organization.area){
          info += "<p  class='mid'>" + membership.organization.area  + "</p>";
        }else{
          info += "<p  class='mid'>" + "Area not defined"  + "</p>";
        }
      }else{
        info += "<p  class='mid'>" + "Organization not defined"  + "</p>";
        info += "<p  class='mid'>" + "Area not defined"  + "</p>";
      }
    }

    info += "<p class='mid'>" + formatYear(membership.start) + " - " + formatYear(membership.end) + "</p>";
    if (politician.chequeado){
      info += "<p class='checkeado' > <i class='fa fa-check'></i> Chequeado</p>";
    }





    //Initial pos;
    var infoPos;
    if (i <= data.length/2) infoPos = { left: e.pageX, top: e.pageY };
    else infoPos = { left: e.pageX-200, top: e.pageY-80 };

    var classes = "bar ";
    if(membership.type){
      classes += membership.type.toLowerCase();
    }
    if(membership.organization){
      if(membership.organization.level){
          classes += " " + membership.organization.level.toLowerCase();
      }
    }
    if(membership.role){
      classes += " " + membership.role.toLowerCase();
    }
    //clear all clases
    document.getElementById('infobox').className = '';

    $("#infobox")
      .addClass(classes)
      .html(info)
      .css(infoPos)
      .show();


}
