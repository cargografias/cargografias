'use strict';

/* Controllers */
angular.module('cargoApp.controllers')
  .controller('mainController', function($rootScope, $scope, cargosFactory) {

    $scope.filter = window.__embedData.filter;
    $scope.autoPersons = [];
    $scope.activePersons = [];
    $scope.estado = "";




    var onDataLoaded = function() {

      $rootScope.estado = "Motor de Visualizacion";
      $rootScope.estado = "Listo!";
      $rootScope.ready = true;

      var parsedParams = window.__embedData.persons.map(function(d){return d.popitID});
      console.log(parsedParams);
      if (parsedParams && parsedParams.length) {
        //Initial load with parameters in the URL
        for (var i = 0; i < parsedParams.length; i++) {
          var index = parsedParams[i];
          var id = cargosFactory.mapId[index];
          $scope.lightAdd(cargosFactory.autoPersons[id], id);
        };
        data = $scope.activePersons;


        // reloadCargoTimeline($scope.filter);

      } else {
        $rootScope.estado = "No hemos cargar tu linea de tiempo :-(";
        $rootScope.ready = false;
      }

    };

    $scope.lightAdd = function(autoPersona, id) {
      if (!autoPersona || autoPersona.agregada) return;
      else {
        $scope.autocomplete = " ";
        autoPersona.agregada = true;
        autoPersona.styles = "badge-selected"
        var person = cargosFactory.getFullPerson(id);
        person.autoPersona = autoPersona;
        $scope.activePersons.unshift(person);
      }
    }

    $scope.filterLine = function(f) {
      $scope.filter = f;
      // reloadCargoTimeline(f);
    }


    cargosFactory.load($scope, onDataLoaded, $rootScope);


    $scope.fullUrl = function(){
      var locations = window.location.href.split('/');

      var persons = window.__embedData.persons.map(function(d) {return d.popitID;}).join('-')
      var parameters  = '#/' +window.__embedData.filter + '-' + persons;
      var instance = locations[3].indexOf('embed') > 0 ? '' : locations[3] + '';
      return locations[0] + "//" + locations[2] + "/"  + instance + parameters;
    }

});
