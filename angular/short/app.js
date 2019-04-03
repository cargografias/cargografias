'use strict';

angular.module('cargoApp.controllers', []);
angular.module('cargoApp.directives', []);

// Declare app level module which depends on filters, and services
var cargoApp =angular.module('cargoApp', [
  'ngRoute',
  'cargoApp.factories',
  'cargoApp.directives',
  'cargoApp.controllers',
  'angularMoment',
  'ngCookies'
]).
config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/', {templateUrl: '/angular/short/partials/main.html',
  	controller: 'mainController'});
  $routeProvider.otherwise({redirectTo: '/'});
}]);
