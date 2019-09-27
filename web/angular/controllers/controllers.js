'use strict';

/* Controllers */
angular.module('cargoApp.controllers')
  .controller('homeController', function($rootScope, $q, $scope, cargosFactory, $filter, $cookies, $routeParams, $location, $route, $timeout, $http) {

  var instanceName = window.location.pathname.replace(/\/$/, '').replace(/^\//, '').trim();
  instanceName = instanceName || 'cargografias';

      /**
       * FromDecade
       * @type {number}
       */
      var fromDecade = 1900;

      $scope.customization = window.customization


              $scope.showPresetsView = true
              $scope.showFilterView = false
              $scope.showVisualizationView = false


              $scope.showFilterFunction = function() {
                  if ($scope.showPresetsView) $scope.showPresetsView = false
                  if ($scope.showVisualizationView) $scope.showVisualizationView = false

                  if (!$scope.showFilterView) $scope.showFilterView = true
              }
              $scope.showVisualizationFunction = function() {
                  if ($scope.showPresetsView) $scope.showPresetsView = false
                  if ($scope.showFilterView) $scope.showFilterView = false

                  if (!$scope.showVisualizationView) $scope.showVisualizationView = true

              }

    $scope.downloadNow = function(){
      var cache = [];

      var cache = angular.copy(data);
      for (var i = 0; i < cache.length; i++) {
        cache[i].autoPersona = null;
        // cache[i].memberships = null;
        for (var j = 0; j < cache[i].memberships.length; j++) {
          var m = cache[i].memberships[j];
          m.politician =  null;
          m.after =null;
          m.before = null;
          m.organization.memberships =  null;
        };

      };

      var innerText = cache[0].name;
      innerText += (cache.length == 1 ?  "" : " y otros" );
      var filename = "Cargografias de " + innerText + ".json";

        var blob = new Blob([JSON.stringify(cache)], {
          type: "text/json;charset=utf-8"});
        saveAs(blob, filename);
        cache = null; // Enable garbage collection
    }
    $scope.filterAdvance = {};
    $scope.autoPersons = [];

    $scope.activePersons = [];
    $scope.estado = "";
    $scope.search = false;
    $rootScope.observers = [];
    $rootScope.yearObserver = [];
    $rootScope.jerarquimetroObserver = [];
    $scope.filter = "name";
    $scope.showResult = false;

    $scope.showPresets = true;
    var parsedParams;

    var processParameters = function(params) {
      parsedParams = params.split('-');
      $scope.filter = parsedParams.shift();
      // $scope.poderometroYear = $scope.activeYear = parseInt(parsedParams.shift());

    }





    $scope.load = function(parsedParams, hideAfterClick) {
        if (parsedParams) {
            for (var i = 0; i < parsedParams.length; i++) {
                var index = parsedParams[i];
                var id = cargosFactory.mapId[index];
                console.log(cargosFactory.autoPersons[id]);
                $scope.lightAdd(cargosFactory.autoPersons[id], id);
            };
            for (var i = 0; i < parsedParams.length; i++) {
              var index = parsedParams[i];
              var id = cargosFactory.mapId[index];
              $scope.filterAutoPersons(parsedParams[i])
              $scope.lightAdd($scope.autoPersons[0], id);
            }
            $scope.autoPersons = $scope.activePersons
            $scope.search = true;
            $scope.showPresets = hideAfterClick ? false : $scope.showPresets;
        }
    }


    // Presets
    $scope.loadMyPresets = function(preset) {
        if ($scope.presets.length) {
          //SI UTILIZAMOS QQW
            // for (var i = 0; i < $scope.presets[preset].valores.length; i++) {
            //     if ($scope.presets[preset].valores[i].length > 3) {
            //         searchModule('toActivePerson', $scope.presets[preset].valores[i], function(res) {
            //           $scope.autoPersons.unshift(res)
            //           $scope.showPresets = false;
            //           $scope.search = true;
            //           $scope.filterAdvance.name = $scope.presets[preset].valores[i]
            //               // $scope.autoPersons = cargosFactory.getAutoPersonsAdvance($scope.filterAdvance.decade);
            //           $scope.showResult = true;
            //           document.getElementById('resultadosBusqueda').style.display = 'block';
            //           $scope.addAll(res.data)
            //           console.log("roles distintos");
            //           console.log(distinctRoles);
            //           $scope.distinctRoles = distinctRoles
            //           $scope.distinctYears = distinctYears
            //           $scope.distinctOrganizations = distinctOrganizations
            //           $scope.distinctTerritories = distinctTerritories
            //           console.log(distinctYears);
            //           console.log(distinctOrganizations);
            //           console.log(distinctTerritories);
            //         })
            //     } else {
            //         $scope.autoPersons = [];
            //         $scope.search = false;
            //     }
            // }

            //SI UTILIZAMOS CSV
            var p = $scope.presets[preset].valores.split('-');
            $scope.load(p); //Default load 1st preset
        }
    }

    var presetsLoader = loadPresets();

    var onDataLoaded = function() {
          //Load initial ids from the url
          console.log($location.search().iframe);
          if ($routeParams.ids) {
            $scope.showVisualizationFunction()
            processParameters($routeParams.ids);
          }
        $rootScope.estado = "Motor de Visualizacion";
        for (var i = 0; i < $rootScope.observers.length; i++) {
            var observer = $rootScope.observers[i];
            observer();
        };
        $rootScope.estado = "Listo!";
        $rootScope.ready = true;

        if (parsedParams && parsedParams.length == 1 && parsedParams[0] == '') {
            parsedParams.pop(); //Remove spurius parsing
        }
        if (parsedParams && parsedParams.length) {
            //Initial load with parameters in the URL
            for (var i = 0; i < parsedParams.length; i++) {
                var index = parsedParams[i];
                var id = cargosFactory.mapId[index];
                $scope.lightAdd(cargosFactory.autoPersons[id], id);
            };
            $scope.refreshAllVisualizations();
        } else {
            //Initial load without data in the url
            // presetsLoader.then(function() {
            //   if ($scope.presets.length) {
            //     $scope.load($scope.presets[0].valores); //Default load 1st preset
            //   }
            // });
        }

    };


    $scope.redrawPoderometro = function() {
      $scope.activeYear = $("#years").val();
      console.log($scope.activeYear);
      var maxYear = d3.max($scope.activePersons, function(d) {  return d3.max(d.memberships, function(inner) {  return inner.end    }) });
      var minYear = d3.min($scope.activePersons, function(d) {  return d3.min(d.memberships, function(inner) {  return inner.start; }) });


      var diff = maxYear - minYear ;
      $scope.poderometroYears = [];
      for (var i = 0; i < diff;  i++) {
        $scope.poderometroYears.push(minYear + i);
      };

      if (!$scope.activeYear){
        $scope.activeYear = minYear;
      }
      for (var i = 0; i < $rootScope.yearObserver.length; i++) {
        var observer = $rootScope.yearObserver[i];
        var poderometro = cargosFactory.getPoderometroAnimado($scope.activeYear, $scope.activePersons);
        observer(poderometro);
      };
    }

    function loadPresets() {
      var instanceName = window.location.pathname.replace(/\/$/, '').replace(/^\//, '') ;
      instanceName = instanceName || 'cargografias';
      var locdataPath = window.__config.baseStaticPath + '/datasets/' + instanceName + '_locdata.json' + '?v=' + window.__config.lastUpdate;
      var req = $http.get(locdataPath);
      req.then(function(res) {
        $scope.presets = JSON.parse(res.data.predefinedSearches || "[]");
        $scope.showPresets = $scope.presets && $scope.presets.length;
      });
      return req;
    }

    $scope.filterAutoPersons = function(q) {
      // SI UTILIZAMOS QQW
        // if (q.length > 3) {
        //     searchModule('toActivePerson', q, function(res) {
        //         $scope.showPresets = false;
        //         $scope.search = true;
        //         $scope.filterAdvance.name = q
        //         $scope.filterAdvance.territory
        //         $scope.filterAdvance.role
        //         $scope.filterAdvance.decade
        //         $scope.autoPersons = res.data;
        //         console.log("autoPersons");
        //         console.log($scope.autoPersons);
        //         // $scope.autoPersons = cargosFactory.getAutoPersonsAdvance($scope.filterAdvance.decade);
        //         $scope.showResult = true;
        //         document.getElementById('resultadosBusqueda').style.display = 'block';
        //     })
        // } else {
        //     $scope.autoPersons = [];
        //     $scope.search = false;
        // }
        // SI UTILIZAMOS CSV
        if (q.length > 3) {
            $scope.showPresets = false;
            $scope.search = true;
            $scope.filterAdvance.name = q;
            $scope.autoPersons = cargosFactory.getAutoPersonsAdvance($scope.filterAdvance);
            $scope.showResult = true;
        } else {
            $scope.autoPersons = [];
            $scope.search = false;
        }
    };

    $scope.filterAutoPersonsAdvance = function () {
        $scope.showPresets = false;
        $scope.search = true;
        $scope.autoPersons = cargosFactory.getAutoPersonsAdvance($scope.filterAdvance);
        $scope.showResult = true;
    };

    $scope.createEmbed = function(cb){
      $http.post('/createEmbedUrl', {
        persons:  ( $scope.activePersons || [] ).map(function(person){ return {  popitID: person.popitID, id: person.id } }),
        filter: $scope.filter
      })
      .success(function(result){

        var embed = "/" + instanceName + "/embed/" + result.embed._id;
        $scope.embedAvailable = embed;
        if (cb){
          cb(embed);
        }

      })
    };


    $scope.tweetThis =function(){
      window.open('about:blank', 'twitter-share-dialog', 'width=626,height=436'); //To avoid the browser blocking the popup, open it first and update the url later
      $scope.createEmbed(function(embedUrl){

        var urlToShorten = window.location.origin + embedUrl;
        $scope.embedUrl = urlToShorten;
        $http.post('/createShortUrl', {url: urlToShorten}).success(function(result){


          var prefix = data[0].name;
           var base ="https://twitter.com/intent/tweet?text=";
            // base += encodeURIComponent("Aca está línea de tiempo de "
            // + prefix +  " via @cargografias "
            // +  result.shortUrl );
            base += encodeURIComponent("Aca está línea de tiempo de "
            + prefix +  " via @cargografias "
            + location.href);
            base += "&url='" + encodeURIComponent(result.shortUrl);
           window.open(base,'twitter-share-dialog');
        })
      });
    };

    $scope.shareIt = function(){

      var urlToShorten = location.href;
      $http.post('/createShortUrl', {url: urlToShorten}).success(function(result){
        var text = "Linea de tiempo de politicos:"
        var sharedUrl = result.shortUrl;
        var url = 'https://twitter.com/intent/tweet?text=' + encodeURIComponent(text) + '&amp;tw_p=tweetbutton&amp;via=cargografias&amp;url=' + encodeURIComponent(sharedUrl)
        window.open(url, 'twitterShareWindow')
      })
    };

    $scope.showSharing = false;

    $scope.generateUrlProfile =function(a){
      var url = location.protocol + "//" + location.hostname +"/" + instanceName +  "/person/"+ a.id;
      return url;
    };

    $scope.clearFilter=function(){
      $scope.filterAdvance.name = null;
      $scope.filterAdvance.territory= null;
      $scope.filterAdvance.jobTitle = null;
      $scope.filterAdvance.decade = null;
      $scope.search = false;
    };

    $scope.currentLink = function(){
      return location.href;
    }
    $scope.embedIframe = function(){

      // var iframe = '<iframe pato="7" width="560" height="315" src="' + $scope.embedUrl + '" frameborder="0" ></iframe>'
      // return iframe;
      var iframe = '<iframe id="sigue1" width="100%" height="500" src="' + location.href + '" frameborder="0" ></iframe>'
      return iframe;
    }

    $scope.switchSharing = function(){
      $scope.showSharing = !$scope.showSharing;

      console.log("showSharing",$scope.showSharing);
      if ($scope.showSharing){
        // var prefix = data[0].name;
        // $scope.sharingCopy = "Aca está línea de tiempo de " + prefix +  " via @cargografias " ;
        $scope.createEmbed(function(embedUrl){
            var urlToShorten = window.location.origin + embedUrl;
            $scope.embedUrl = urlToShorten;
            $http.post('/createShortUrl', {url: urlToShorten}).success(function(result){
              $scope.shortUrl = result.shortUrl;
            });
        });

      }
      else {

      }

    };
    $scope.switchSearch = function(v){
      $scope.showBusAvanzado = v;
      $scope.showSharing = false;

      if (v){

      }
      else {

        $scope.filterAdvance.territory= null;
        $scope.filterAdvance.jobTitle = null;
        $scope.filterAdvance.decade = null;
      }
    }
    $scope.clearEverthing = function() {
        $scope.filterAdvance.name = null;
        $scope.filterAdvance.territory= null;
        $scope.filterAdvance.jobTitle = null;
        $scope.filterAdvance.decade = null;
        $scope.autoPersons = [];
        $scope.search = false;
        $scope.showResult = false;
        for (var i = 0; i < $scope.activePersons.length; i++) {
          $scope.activePersons[i].autoPersona.agregada = false;
          $scope.activePersons[i].autoPersona.styles = "";
        };
        $scope.activePersons = [];
        updateTheUrl();
        $scope.showPresets = true;
        $scope.refreshAllVisualizations();
    };



    $scope.clearResults = function() {
        $scope.filterAdvance.name = '';
        $scope.filterAdvance.territory = '';
        $scope.filterAdvance.jobTitle = '';
        $scope.filterAdvance.decade = '';
        $scope.showResult = false;
        $scope.autoPersons = [];
        $scope.showPresets = true;
        $scope.search = false;
    }


    cargosFactory.load($scope, onDataLoaded, $rootScope);

    var lastRoute = $route.current;
    $scope.$on('$locationChangeSuccess', function(event) {
      // If same controller, then ignore the route change.
      if(lastRoute){
        if (lastRoute.controller == $route.current.controller) {
          $route.current = lastRoute;
        }
      }
    });

    function updateTheUrl() {
        //Update the URL
        $location.path("/" + $scope.filter + "-" + $scope.activePersons.map(function(p) {
            // return p.autoPersona.popitID

            //SI UTILIZAMOS QQW
            //return p._id

            //SI UTILIZAMOS CSV
            return p.id
        }).join('-'));
    }

    $scope.lightAdd = function(autoPersona, id) {
      if (!autoPersona || autoPersona.agregada) {
            // console.log("ya esta agregada");
            return;
        } else {
            //SI UTILIZAMOS QQW
            // $scope.autocomplete = " ";
            // autoPersona.agregada = true;
            // autoPersona.styles = "badge-selected"
            // $scope.activePersons.unshift(autoPersona)
            // updateTheUrl()

            //SI UTILIZAMOS CSV
            $scope.autocomplete = " ";
            autoPersona.agregada = true;
            autoPersona.styles = "badge-selected"
            // var person = cargosFactory.getFullPerson(autoPersona.id);
            autoPersona.periods = cargosFactory.getPeriods(autoPersona);
            autoPersona.summary = cargosFactory.getSummary(autoPersona);
            autoPersona.full = true;
            autoPersona.weight = cargosFactory.setWeight(autoPersona)
            // person.autoPersona = autoPersona;
            // person.cargoProfileURL = $scope.generateUrlProfile(person);
            $scope.activePersons.unshift(autoPersona)
            updateTheUrl()

            // var person = autoPersona;
            //var person = cargosFactory.getFullPerson(id) ;
            // console.log(person);
            // person.autoPersona = autoPersona;
            // person.cargoProfileURL = $scope.generateUrlProfile(person);
        }
    }
    $scope.add = function(autoPersona, id) {
      $scope.lightAdd(autoPersona, id);
      $scope.refreshAllVisualizations();
    };
    $scope.addAll = function() {
      $scope.autoPersons.map(function(el){
        $scope.add(el,el.id)
      })
      updateTheUrl();

    }
    $scope.refreshAllVisualizations = function() {
      // console.log("REFRESH ALL VISUALIZATIONS");
      var event = new CustomEvent('build', {
          detail: $scope.activePersons
      });
      event.visOptions = $scope.filter
      var elem= document.getElementById("visualizaciones");
      data = $scope.activePersons;
      elem.dispatchEvent(event);
      // reloadCargoTimeline($scope.filter)

      // viejo cargo
      // data = $scope.activePersons;
      // reloadCargoTimeline($scope.filter);
      // //Updates Url
      // updateTheUrl();
    }


    $scope.filterLine = function(f) {
      console.log("filterline",f);
      $scope.filter = f;
      reloadCargoTimeline(f);
      updateTheUrl();
    }


    $scope.remove = function(person) {
      var indexOf = $scope.activePersons.indexOf(person);
      if (indexOf > -1) {
        $scope.activePersons.splice(indexOf, 1);
      }
      person.agregada = false;
      person.styles = "";
      if ($scope.activePersons.length == 0 && !$scope.search) {
        $scope.showPresets = true;
      }
      updateTheUrl();

    $scope.refreshAllVisualizations();

    };

    $scope.clearAll = function() {

      for (var i = 0; i < $scope.activePersons.length; i++) {
        $scope.activePersons[i].agregada = false;
        $scope.activePersons[i].styles = "";
      };
      $scope.activePersons = [];
      updateTheUrl();
      $scope.showPresets = true;
      // $scope.refreshAllVisualizations();

    }


      /**
       * Clean advance filter
       */
      $scope.cleanAdvanceFilter = function() {
          // $scope.autoPersons = [];
          // $("#nombre").val('');
          // console.log('clearFilter');
          // $scope.filterAdvance.name = null;
          // $scope.filterAdvance.organization = null;
          // $scope.filterAdvance.jobTitle = null;
          // $scope.filterAdvance.decade = null;

      }

      /**
       * Get all Organizations
       * @returns {*}
       */
      $scope.getOrganizations = function() {
        return cargosFactory.getOrganizations();
      }
      /**
       * Get all Organizations
       * @returns {*}
       */
      $scope.getTerritories = function() {
        return cargosFactory.getTerritories();
      }

      /**
       * get All JobTitles
       * @returns {*}
       */
      $scope.getJobTitle = function() {
        return cargosFactory.getJobTitle();
      }

      /**
       * Get decades
       * @returns {*}
       */
      var decades = [];
      $scope.getDecades = function() {
        if (decades.length === 0){
          decades = cargosFactory.getDecades(fromDecade);;
        }
        return decades;
      }



      //Notifcation manager

      var communicationProxy = {
        remove: function(p){
          $scope.$apply(function(){
            $scope.remove(p);
          });
        }
      }
      notify.subscribe(communicationProxy);



  });
