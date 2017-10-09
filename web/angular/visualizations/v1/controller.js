'use strict';

angular.module('cargoApp.controllers').controller('estaEnPoderCtrl',
    function($rootScope,$scope, cargosFactory, $http) {

        $rootScope.estaEnElPoder = function(){
          // $scope.estaenElPoder= $scope.activePersons.slice()
          $scope.estaenElPoder = $scope.activePersons
          // console.log($scope.activePersons.length);
          // for (var i = 0; i < $scope.activePersons.length; i++) {
          //   console.log("esta en poder");
          //   console.log($scope.activePersons[i]);
          //   $scope.estaenElPoder[i].remainsInPower = "NO";
          //
          // };
        }
    }
);
