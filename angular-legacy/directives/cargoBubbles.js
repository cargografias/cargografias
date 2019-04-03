'use strict';
/* Directives */
angular.module('cargoApp.directives').
directive('ngCargobubbles', function() {
    return {
        template: '<div id="bubbles"></div>',
        controller: ['$scope', '$http',
            function($scope) {
                console.log('controller');
            }
        ],
        bubble: {},
        link: function($rootScope, $scope, iElement, iAttrs, ctrl) {

            var startBubbles = function(data) {
                // //BUG: Why is not working?
                 if (window.cargo.bubblePoderometro.started) {
                    console.log('update-bubbles');
                    window.cargo.bubblePoderometro.update(data);
                 } else {
                  $("#bubbles").html('');
                  if(data.length > 0){
                    window.cargo.bubblePoderometro.start(data);
                  }
                }

            };
            $rootScope.yearObserver.push(startBubbles); 


        }
    }
});

