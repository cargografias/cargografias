'use strict';

/* Controllers */
angular.module('cargoApp.controllers')
  .controller('loaderController', function($scope) {
    console.log("loaderController!");
   	$scope.customization= window.customization;
 });
