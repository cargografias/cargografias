'use strict';
var activePersons = '';

/* Controllers */
angular.module('cargoApp.controllers')
// .controller('homeController', function($rootScope, $q, $scope, presetsFactory, cargosFactory, $filter, $cookies, $routeParams, $location, $route, $timeout, $http) {
  .controller('homeController', function($rootScope, $q, $scope, cargosFactory, $filter, $cookies, $routeParams, $location, $route, $timeout, $http) {


        // $scope.presets = JSON.parse(window.customization.predefinedSearches);
        var instanceName = window.location.pathname.replace(/\/$/, '').replace(/^\//, '').trim();
        instanceName = instanceName || 'cargografías';

        /**
         * FromDecade
         * @type {number}
         */
        var fromDecade = 1900;

        $scope.customization = window.customization

        $scope.showPresetsView = true
        $scope.showFilterView = false
        $scope.showVisualizationView = false


        $scope.showFilterFunction = function() {
            if ($scope.showPresetsView) $scope.showPresetsView = false
            if ($scope.showVisualizationView) $scope.showVisualizationView = false

            if (!$scope.showFilterView) $scope.showFilterView = true
        }
        $scope.showVisualizationFunction = function() {
            if ($scope.showPresetsView) $scope.showPresetsView = false
            if ($scope.showFilterView) $scope.showFilterView = false

            if (!$scope.showVisualizationView) $scope.showVisualizationView = true

        }

        $scope.addAll = function(q) {
            for (var i = 0; i < q.length; i++) {
                $scope.add(q[i], q[i]._id)
            }
        }


        $scope.downloadNow = function() {
            var cache = [];

            var cache = angular.copy(data);
            for (var i = 0; i < cache.length; i++) {
                cache[i].autoPersona = null;
                // cache[i].memberships = null;
                for (var j = 0; j < cache[i].memberships.length; j++) {
                    var m = cache[i].memberships[j];
                    m.politician = null;
                    m.after = null;
                    m.before = null;
                    m.organization.memberships = null;
                };

            };

            var innerText = cache[0].name;
            innerText += (cache.length == 1 ? "" : " y otros");
            var filename = "Cargografias de " + innerText + ".json";

            var blob = new Blob([JSON.stringify(cache)], {
                type: "text/json;charset=utf-8"
            });
            saveAs(blob, filename);
            cache = null; // Enable garbage collection
        }
        $scope.filterAdvance = {};
        $scope.autoPersons = [];

        $scope.activePersons = [];
        $scope.estado = "";
        $scope.search = false;
        $rootScope.observers = [];
        $rootScope.yearObserver = [];
        $rootScope.jerarquimetroObserver = [];
        $scope.filter = "name";
        $scope.showResult = false;

        $scope.showPresets = true;
        var parsedParams;

        var processParameters = function(params) {
                parsedParams = params.split('-');
                $scope.filter = parsedParams.shift();
            }
            //Load initial ids from the url
            // if ($routeParams.ids) {
            //     processParameters($routeParams.ids);
            // }

        $scope.load = function(parsedParams, hideAfterClick) {
          console.log("params",parsedParams);
            // processParameters(params);
            //light add all persons from url
            if (parsedParams) {
                for (var i = 0; i < parsedParams.length; i++) {
                    var index = parsedParams[i];
                    var id = cargosFactory.mapId[index];
                    $scope.lightAdd(cargosFactory.autoPersons[id], id);
                };
                for (var i = 0; i < parsedParams.length; i++) {
                  var index = parsedParams[i];
                  var id = cargosFactory.mapId[index];
                  $scope.filterAutoPersons(parsedParams[i])
                  $scope.lightAdd($scope.autoPersons[0], id);
                  console.log("autoPersons",$scope.autoPersons);
                  console.log("activePersons",$scope.activePersons);
                }
                $scope.autoPersons = $scope.activePersons
                $scope.search = true;
                $scope.showPresets = hideAfterClick ? false : $scope.showPresets;
            }
        }

        // Presets
        // function constructObject(name) {
        //   console.log("El nombre que vamos a armar");
        //   console.log(name);
        //   searchModule('toActivePerson', name, function(res) {
        //     //ver que hacer con res
        //     // $scope.activePersons.unshift(res);
        //     $scope.autoPersons.unshift(res)
        //   })
        // }
        $scope.loadMyPresets = function(preset) {
            if ($scope.presets.length) {
              //SI UTILIZAMOS QQW
                // for (var i = 0; i < $scope.presets[preset].valores.length; i++) {
                //     if ($scope.presets[preset].valores[i].length > 3) {
                //         searchModule('toActivePerson', $scope.presets[preset].valores[i], function(res) {
                //           $scope.autoPersons.unshift(res)
                //           $scope.showPresets = false;
                //           $scope.search = true;
                //           $scope.filterAdvance.name = $scope.presets[preset].valores[i]
                //               // $scope.autoPersons = cargosFactory.getAutoPersonsAdvance($scope.filterAdvance.decade);
                //           $scope.showResult = true;
                //           document.getElementById('resultadosBusqueda').style.display = 'block';
                //           $scope.addAll(res.data)
                //           console.log("roles distintos");
                //           console.log(distinctRoles);
                //           $scope.distinctRoles = distinctRoles
                //           $scope.distinctYears = distinctYears
                //           $scope.distinctOrganizations = distinctOrganizations
                //           $scope.distinctTerritories = distinctTerritories
                //           console.log(distinctYears);
                //           console.log(distinctOrganizations);
                //           console.log(distinctTerritories);
                //         })
                //     } else {
                //         $scope.autoPersons = [];
                //         $scope.search = false;
                //     }
                // }

                //SI UTILIZAMOS CSV
                $scope.load($scope.presets[preset].valores); //Default load 1st preset
            }
        }

        var presetsLoader = loadPresets();

        var onDataLoaded = function() {

            $rootScope.estado = "Motor de Visualizacion";
            for (var i = 0; i < $rootScope.observers.length; i++) {
                var observer = $rootScope.observers[i];
                observer();
            };
            $rootScope.estado = "Listo!";
            $rootScope.ready = true;

            if (parsedParams && parsedParams.length == 1 && parsedParams[0] == '') {
                parsedParams.pop(); //Remove spurius parsing
            }
            if (parsedParams && parsedParams.length) {
                //Initial load with parameters in the URL
                for (var i = 0; i < parsedParams.length; i++) {
                    var index = parsedParams[i];
                    var id = cargosFactory.mapId[index];
                    $scope.lightAdd(cargosFactory.autoPersons[id], id);
                };
                // $scope.refreshAllVisualizations();
            } else {
                //Initial load without data in the url
                // presetsLoader.then(function() {
                //   if ($scope.presets.length) {
                //     $scope.load($scope.presets[0].valores); //Default load 1st preset
                //   }
                // });
            }

        };

        function loadPresets() {
            var instanceName = window.location.pathname.replace(/\/$/, '').replace(/^\//, '');
            instanceName = instanceName || 'cargografias';
            var locdataPath = window.__config.baseStaticPath + '/datasets/' + instanceName + '_locdata.json' + '?v=' + window.__config.lastUpdate;
            var req = $http.get(locdataPath);
            req.then(function(res) {
                $scope.presets = JSON.parse(res.data.predefinedSearches || "[]");
                window.customization = res.data;
                $scope.showPresets = $scope.presets && $scope.presets.length;
            });
            return req;
        }

        $scope.filterAutoPersons = function(q) {
          // SI UTILIZAMOS QQW
            // if (q.length > 3) {
            //     searchModule('toActivePerson', q, function(res) {
            //         $scope.showPresets = false;
            //         $scope.search = true;
            //         $scope.filterAdvance.name = q
            //         $scope.filterAdvance.territory
            //         $scope.filterAdvance.role
            //         $scope.filterAdvance.decade
            //         $scope.autoPersons = res.data;
            //         console.log("autoPersons");
            //         console.log($scope.autoPersons);
            //         // $scope.autoPersons = cargosFactory.getAutoPersonsAdvance($scope.filterAdvance.decade);
            //         $scope.showResult = true;
            //         document.getElementById('resultadosBusqueda').style.display = 'block';
            //     })
            // } else {
            //     $scope.autoPersons = [];
            //     $scope.search = false;
            // }
            // SI UTILIZAMOS CSV
            if (q.length > 3) {
                $scope.showPresets = false;
                $scope.search = true;
                $scope.filterAdvance.name = q;
                $scope.autoPersons = cargosFactory.getAutoPersonsAdvance($scope.filterAdvance);
                $scope.showResult = true;
            } else {
                $scope.autoPersons = [];
                $scope.search = false;
            }
        };

        $scope.filterTerritory = function() {
            searchModule('territory', 'Argentina', function(res) {
                $scope.territories = res.data;
            })
        }

        $scope.filterTerritory()

        $scope.filterRole = function() {
            searchModule('role', 'Argentina', function(res) {
                $scope.role = res.data;
                // console.log("roles");
                // console.log($scope.role);
            })
        }
        $scope.filterRole()

        $scope.filterAutoPersonsAdvance = function() {
            // $scope.showPresets = false;
            // $scope.search = true;
            $scope.autoPersons = cargosFactory.getAutoPersonsAdvance($scope.filterAdvance);
            // $scope.showResult = true;
        };

        // $scope.createEmbed = function(cb) {
        //     $http.post('/createEmbedUrl', {
        //             persons: ($scope.activePersons || []).map(function(person) {
        //                 return {
        //                     popitID: person.popitID,
        //                     id: person.id
        //                 }
        //             }),
        //             filter: $scope.filter
        //         })
        //         .success(function(result) {
        //
        //             var embed = "/" + instanceName + "/embed/" + result.embed._id;
        //             $scope.embedAvailable = embed;
        //             if (cb) {
        //                 cb(embed);
        //             }
        //
        //         })
        // };

        // $scope.tweetThis = function() {
        //     window.open('about:blank', 'twitter-share-dialog', 'width=626,height=436'); //To avoid the browser blocking the popup, open it first and update the url later
        //     $scope.createEmbed(function(embedUrl) {
        //
        //         var urlToShorten = window.location.origin + embedUrl;
        //         $scope.embedUrl = urlToShorten;
        //         $http.post('/createShortUrl', {
        //             url: urlToShorten
        //         }).success(function(result) {
        //
        //
        //             var prefix = data[0].name;
        //             var base = "https://twitter.com/intent/tweet?text=";
        //             base += encodeURIComponent("Aca está línea de tiempo de " +
        //                 prefix + " via @cargografias " +
        //                 result.shortUrl);
        //             base += "&url='" + encodeURIComponent(result.shortUrl);
        //             window.open(base, 'twitter-share-dialog');
        //         })
        //     });
        // };
        //
        // $scope.shareIt = function() {
        //
        //     var urlToShorten = location.href;
        //     $http.post('/createShortUrl', {
        //         url: urlToShorten
        //     }).success(function(result) {
        //         var text = "Linea de tiempo de politicos:"
        //         var sharedUrl = result.shortUrl;
        //         var url = 'https://twitter.com/intent/tweet?text=' + encodeURIComponent(text) + '&amp;tw_p=tweetbutton&amp;via=cargografias&amp;url=' + encodeURIComponent(sharedUrl)
        //         window.open(url, 'twitterShareWindow')
        //     })
        // };
        //
        // $scope.showSharing = false;
        //
        // $scope.generateUrlProfile = function(a) {
        //     var url = location.protocol + "//" + location.hostname + "/" + instanceName + "/person/" + a.id;
        //     return url;
        // };

        $scope.clearFilter = function() {
            $scope.filterAdvance.name = null;
            $scope.filterAdvance.territory = null;
            $scope.filterAdvance.jobTitle = null;
            $scope.filterAdvance.decade = null;
            $scope.search = false;
        };

        // $scope.currentLink = function() {
        //     return location.href;
        // }
        //
        // $scope.embedIframe = function() {
        //
        //     var iframe = '<iframe width="560" height="315" src="' + $scope.embedUrl + '" frameborder="0" ></iframe>'
        //     return iframe;
        // }
        //
        // $scope.switchSharing = function(v) {
        //     $scope.showSharing = v;
        //     if (v) {
        //         var prefix = data[0].name;
        //         $scope.sharingCopy = "Aca está línea de tiempo de " + prefix + " via @cargografias ";
        //         $scope.createEmbed(function(embedUrl) {
        //             var urlToShorten = window.location.origin + embedUrl;
        //             $scope.embedUrl = urlToShorten;
        //             $http.post('/createShortUrl', {
        //                 url: urlToShorten
        //             }).success(function(result) {
        //                 $scope.shortUrl = result.shortUrl;
        //             });
        //         });
        //
        //     } else {
        //
        //     }
        //
        // };
        //
        // $scope.switchSearch = function(v) {
        //     $scope.showBusAvanzado = v;
        //     $scope.showSharing = false;
        //
        //     if (v) {
        //
        //     } else {
        //
        //         $scope.filterAdvance.territory = null;
        //         $scope.filterAdvance.jobTitle = null;
        //         $scope.filterAdvance.decade = null;
        //     }
        // }

        $scope.clearEverthing = function() {
            $scope.filterAdvance.name = null;
            $scope.filterAdvance.territory = null;
            $scope.filterAdvance.jobTitle = null;
            $scope.filterAdvance.decade = null;
            $scope.autoPersons = [];
            $scope.search = false;
            $scope.showResult = false;
            for (var i = 0; i < $scope.activePersons.length; i++) {
                $scope.activePersons[i].autoPersona.agregada = false;
                $scope.activePersons[i].autoPersona.styles = "";
            };
            $scope.activePersons = [];
            updateTheUrl();
            $scope.showPresets = true;
            $scope.refreshAllVisualizations();
        };

        $scope.clearResults = function() {
            $scope.filterAdvance.name = '';
            $scope.filterAdvance.territory = '';
            $scope.filterAdvance.jobTitle = '';
            $scope.filterAdvance.decade = '';
            $scope.showResult = false;
            $scope.autoPersons = [];
            $scope.showPresets = true;
            $scope.search = false;
        }


        cargosFactory.load($scope, onDataLoaded, $rootScope);

        // var lastRoute = $route.current;
        // $scope.$on('$locationChangeSuccess', function(event) {
        //     // If same controller, then ignore the route change.
        //     if (lastRoute.controller == $route.current.controller) {
        //         $route.current = lastRoute;
        //
        //     }
        // });

        function updateTheUrl() {
            //Update the URL
            console.log("updateTheUrl");
            $location.path("/" + $scope.filter + "-" + $scope.activePersons.map(function(p) {
                // return p.autoPersona.popitID

                //SI UTILIZAMOS QQW
                //return p._id

                //SI UTILIZAMOS CSV
                return p.id
            }).join('-'));
        }

        var activeRoles = []
        $scope.lightAdd = function(autoPersona, id) {
          if (!autoPersona || autoPersona.agregada) {
                console.log("ya esta agregada");
                return;
            } else {
                //SI UTILIZAMOS QQW
                // $scope.autocomplete = " ";
                // autoPersona.agregada = true;
                // autoPersona.styles = "badge-selected"
                // $scope.activePersons.unshift(autoPersona)
                // updateTheUrl()

                //SI UTILIZAMOS CSV
                $scope.autocomplete = " ";
                autoPersona.agregada = true;
                autoPersona.styles = "badge-selected"
                // var person = cargosFactory.getFullPerson(autoPersona.id);
                autoPersona.periods = cargosFactory.getPeriods(autoPersona);
                autoPersona.summary = cargosFactory.getSummary(autoPersona);
                autoPersona.full = true;
                autoPersona.weight = cargosFactory.setWeight(autoPersona)
                // person.autoPersona = autoPersona;
                // person.cargoProfileURL = $scope.generateUrlProfile(person);
                $scope.activePersons.unshift(autoPersona)
                updateTheUrl()

                // var person = autoPersona;
                //var person = cargosFactory.getFullPerson(id) ;
                // console.log(person);
                // person.autoPersona = autoPersona;
                // person.cargoProfileURL = $scope.generateUrlProfile(person);



            }
        }
        $scope.add = function(autoPersona, id) {
            $scope.lightAdd(autoPersona, id);
            $scope.refreshAllVisualizations();
        };
        var event = new CustomEvent('build', {
            detail: $scope.activePersons
        });

        $scope.refreshAllVisualizations = function() {
            // event.detail = $scope.autoPersons;
            // console.log("event.detail");
            // elem.dispatchEvent(event);
            data = $scope.activePersons;
            setTimeout(function(){console.log("holaaa");},2000)

        }

        $scope.filterLine = function(f) {
            $scope.filter = f;
            // reloadCargoTimeline(f);
            updateTheUrl();
        }



        $scope.remove = function(person) {
            $scope.autoPersons.map(function(o) {
                if (o.simple === person.simple) {
                    o.agregada = false
                    o.styles = ""
                }
            })
            var indexOf = $scope.activePersons.indexOf(person);
            if (indexOf > -1) {
                $scope.activePersons.splice(indexOf, 1);
            }
            updateTheUrl();
            $scope.refreshAllVisualizations();
            //quito el estado activo en autoPersons
            // var indexOf = $scope.autoPersons.indexOf(person);
            // if (indexOf > -1) {
            //     // $scope.activePersons.splice(indexOf, 1);
            //     console.log("hola");
            //     console.log($scope.activePersons.splice(indexOf, 1));
            // }

            // if(person.agregada != 'undefined'){
            //   autoPersona.agregada = false
            //   autoPersona.styles = ""
            // }
            // var indexOf = $scope.autoPersons.indexOf(person);
            // if (indexOf > -1) {
            //     $scope.activePersons.splice(indexOf, 1);
            // }

            // if ($scope.activePersons.length == 0 && !$scope.search) {
            //     $scope.showPresets = true;
            // }
            // $scope.refreshAllVisualizations();
        };


        $scope.clearAll = function() {

            for (var i = 0; i < $scope.activePersons.length; i++) {
                $scope.activePersons[i].agregada = false;
                $scope.activePersons[i].styles = "";
            };
            for (var i = 0; i < $scope.autoPersons.length; i++) {
                $scope.autoPersons[i].agregada = false;
                $scope.autoPersons[i].styles = "";
            };
            $scope.activePersons = [];
            updateTheUrl();
            $scope.showPresets = true;
            $scope.refreshAllVisualizations();

        }

        /**
         * Clean advance filter
         */
        // $scope.cleanAdvanceFilter = function() {
        //     // $scope.autoPersons = [];
        //     // $("#nombre").val('');
        //     // console.log('clearFilter');
        //     // $scope.filterAdvance.name = null;
        //     // $scope.filterAdvance.organization = null;
        //     // $scope.filterAdvance.jobTitle = null;
        //     // $scope.filterAdvance.decade = null;
        //
        // }

        /**
         * Get all Organizations
         * @returns {*}
         */
        $scope.getOrganizations = function() {
                return cargosFactory.getOrganizations();
            }
            /**
             * Get all Organizations
             * @returns {*}
             */

        $scope.getTerritories = function() {
            return cargosFactory.getTerritories();
        }


        $scope.selectArtist = function(value) {
            console.log("FILTRANDO");
            console.log(value);
            $scope.autoPersons.map(function(el) {
                console.log(el);
                var indexOf = el.distinctTerritories.indexOf(value);
                if (indexOf > -1) {

                    console.log("LO ENCUENTRA");
                    el.encontrado = true
                } else {
                    console.log("NO LO ENCUENTRA");
                    el.encontrado = false
                }
            })
            $scope.filterByArtist = value;

            console.log($scope.filterByArtist);
        }

        $scope.selectGenre = function(value) {
            console.log("FILTRANDO genre");
            console.log(value);
            $scope.autoPersons.map(function(el) {
                console.log(el);
                var indexOf = el.distinctRoles.indexOf(value);
                if (indexOf > -1) {

                    console.log("LO ENCUENTRA");
                    el.encontrado = true
                } else {
                    console.log("NO LO ENCUENTRA");
                    el.encontrado = false
                }
            })
        }

        /**
         * get All JobTitles
         * @returns {*}
         */
        $scope.getJobTitle = function() {
            return cargosFactory.getJobTitle();
        }

        /**
         * Get decades
         * @returns {*}
         */
        var decades = [];
        $scope.getDecades = function() {
            if (decades.length === 0) {
                decades = cargosFactory.getDecades(fromDecade);
            }
            return decades;
        }
        $scope.decades = $scope.getDecades()
            // console.log("decades");
            // console.log($scope.decades);

        //Notifcation manager

        var communicationProxy = {
            remove: function(p) {
                $scope.$apply(function() {
                    (p);
                });
            }
        }
        notify.subscribe(communicationProxy);
    });
