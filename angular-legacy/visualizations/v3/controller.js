'use strict';

angular.module('cargoApp.controllers').controller('compareResultadosCtrl',
    function($scope, cargosFactory, $http) {
        $scope.estaenElPoder2={}
        $scope.estaEnElPoder2 = function(){
          console.log($scope.activePersons.length);
          for (var i = 0; i < $scope.activePersons.length; i++) {
            if ($scope.activePersons[i].memberships.indexOf("2011") != -1) $scope.activePersons[i].remainsInPower = "SI"
            else $scope.activePersons[i].remainsInPower = "NO"
            $scope.estaenElPoder2[i] = $scope.activePersons[i]
            console.log($scope.estaenElPoder2[i]);
          };
        }

        $scope.information2={}
        $scope.logInformation2 = function(){
          for (var i = 0; i < $scope.activePersons.length; i++) {
            $scope.information2[i] = $scope.activePersons[i]
          };
        }
    }
);
