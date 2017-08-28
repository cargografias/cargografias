'use strict';

angular.module('cargoApp.controllers').controller('estaEnPoderCtrl',
    function($rootScope,$scope, cargosFactory, $http) {

        $rootScope.estaEnElPoder = function(){
          $scope.estaenElPoder= $scope.activePersons.slice()
          // console.log($scope.activePersons.length);
          for (var i = 0; i < $scope.activePersons.length; i++) {
            if ($scope.activePersons[i].memberships.indexOf("2011") != -1) {
              $scope.estaenElPoder[i].remainsInPower = "SI";
            }
            else {
              $scope.estaenElPoder[i].remainsInPower = "NO";
            }
          };
        }
    }
);
