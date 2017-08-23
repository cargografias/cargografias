'use strict';

/**
 *  Filter Controller
 */
angular.module('cargoApp.controllers').controller('informationCtrl',
    function($scope, cargosFactory, $http) {
        $scope.information={}
        $scope.logInformation = function(){
          for (var i = 0; i < $scope.activePersons.length; i++) {
            $scope.information[i] = $scope.activePersons[i]
          };
        }
    }
);
