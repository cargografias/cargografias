'use strict';

angular.module('cargoApp.controllers').controller('estaEnPoderCtrl',
    function($scope, cargosFactory, $http) {
        $scope.estaenElPoder={}
        $scope.estaEnElPoder = function(){
          console.log($scope.activePersons.length);
          for (var i = 0; i < $scope.activePersons.length; i++) {
            if ($scope.activePersons[i].memberships.indexOf("2011") != -1) $scope.activePersons[i].remainsInPower = "SI"
            else $scope.activePersons[i].remainsInPower = "NO"
            $scope.estaenElPoder[i] = $scope.activePersons[i]
            console.log($scope.estaenElPoder[i]);
          };
        }
    }
);
