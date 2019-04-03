'use strict';

/* Directives */


angular.module('cargoApp.directives').
  directive('ngCargotimeline', function() {
    return {
    	template: '<div id="timelineContainer"><div class="ctl-tooltip"></div></div>',
    	controller: ['$scope', '$http', function($scope, $http) {
    			console.log('controller');
    			$scope.one = "one";
    	}],
    	link: function($rootScope, $scope, iElement, iAttrs, ctrl) {
    		$rootScope.observers.push(function(){

    				var idPersonas = [9999];
						var timelineParams = {
						   filtro: { idPersonas: idPersonas },
						   mostrarPor: "cargo",
						};
						window.cargoTimeline = new CargografiasTimeline({
						       containerEl : document.getElementById('timelineContainer'),
						       mostrarPor: "cargo",
						       filtro:{
						           idPersonas: idPersonas
						       }
						});
    		});

    	}
    }
 });


