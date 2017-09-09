'use strict';

angular.module('cargoApp.controllers').controller('estaEnPoderCtrl',
    function($rootScope,$scope, cargosFactory, $http) {

        $rootScope.estaEnElPoder = function(){
          $scope.estaenElPoder= $scope.activePersons.slice()
          // console.log($scope.activePersons.length);
          for (var i = 0; i < $scope.activePersons.length; i++) {
            $scope.estaenElPoder[i].remainsInPower = "NO";

            // if ($scope.activePersons[i].membership.data[0].end_date.indexOf("2011") != -1) {
            //   $scope.estaenElPoder[i].remainsInPower = "SI";
            // }
            // else {
            //   $scope.estaenElPoder[i].remainsInPower = "NO";
            // }
          };
        }
    }
);
