'use strict';

angular.module('cargoApp.controllers', []);
angular.module('cargoApp.directives', []);

// Declare app level module which depends on filters, and services
var cargoApp = angular.module('cargoApp', [
  'ngRoute',
  'cargoApp.filters',
  'cargoApp.factories',
  'cargoApp.directives',
  'cargoApp.controllers',
  'angularMoment',
  'ngCookies'
]).
config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/:ids?', {templateUrl: '/angular-legacy/partials/main.html', controller: 'homeController'});
  // $routeProvider.when('/:ids?', {templateUrl: '/angular-legacy/partials/main.html'});

  $routeProvider.otherwise({redirectTo: '/'});
}]);
cargoApp.run(function(){
	new WOW().init();
})
