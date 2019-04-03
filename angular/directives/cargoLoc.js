'use strict';
/* Directives */
angular.module('cargoApp.directives').
directive('ngCargoLoc', function() {
    return {
        
        scope: true,

        template: '{{text}}',

        controller: ['$scope', '$http',
            function($scope, $http) {

                var instanceName = window.location.pathname.replace(/\/$/, '').replace(/^\//, '').replace('.html','');
                instanceName = instanceName || 'cargografias';
                var locdataPath = window.__config.baseStaticPath + '/datasets/' + instanceName + '_locdata.json' + '?v=' + window.__config.lastUpdate;
                $http.get(locdataPath).then(function(res){
                  $scope.text = res.data[$scope.key] 
                })
            }
        ], 

        link: function($scope, element, attributes) {
          $scope.key = attributes["ngCargoLoc"];
        }

    }
});

