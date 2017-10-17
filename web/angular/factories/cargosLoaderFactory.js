// 'use strict';
//
// /* Filters */
//
// angular.module('cargoApp.factories', [])
//   .factory('cargoLoaderFactory', function($http) {
//     var datasources = [];
//
//     var cargografiasSources = [];
//
//     var instanceName = window.location.pathname.replace(/\/$/, '').replace(/^\//, '');
//     instanceName = instanceName.split('/')[0];
//     instanceName = instanceName || 'cargografias';
//
//     cargografiasSources.push(window.__config.baseStaticPath + '/datasets/' + instanceName + '-persons.json' + '?v=' + window.__config.lastUpdate);
//     cargografiasSources.push(window.__config.baseStaticPath + '/datasets/' + instanceName + '-memberships.json' + '?v=' + window.__config.lastUpdate);
//     cargografiasSources.push(window.__config.baseStaticPath + '/datasets/' + instanceName + '-organizations.json' + '?v=' + window.__config.lastUpdate);
//
//     var currentDataSource = cargografiasSources;
//     console.log(currentDataSource);
//     var f = {};
//
//     f.load = function($scope,factory,callback, $rootScope){
//             $http.get('/js/datasets/pesopoder.json')
//                 .then(function(res){
//                 $rootScope.estado = "Representatividad";
//                 factory.weight = res.data;
//               });
//               $http.get(currentDataSource[0])
//                  .then(function(res){
//                   $rootScope.estado = "Personas";
//                   factory.persons = res.data;
//                     for (var i = 0; i < res.data.length; i++) {
//                       //Search Index
//                       var item = res.data[i]
//                       res.data[i].index = i;
//                       f.processImages(item);
//                       f.setInitials(item);
//                       //TODO: This should come 100% from data. Remove in the future
//                       try{
//                         f.setShareableID(item);
//                         f.processMemberships(item);
//                       }
//                       catch(e){
//                         console.log("Loading error", e, res.data[i].name, res.data[i].id_sha1);
//                       }
//
//                       factory.mapId[item.popitID] = i;
//                       factory.autoPersons.push(item);
//                     };
//               }).then(function(){
//                   $http.get(currentDataSource[2])
//                     .then(function(res){
//                       $rootScope.estado = "Organizaciones";
//                       factory.organizations = res.data;
//                       //TODO: Why is this here? Shouldn't go to organization level attribute?
//                       //nivel: res.data[i].name === 'Argentina' ? 'nacional' : 'provincial'
//                   }).then(callback);
//                 });
//   };
//
//   //Photo or default photo
//   f.processImages = function(d){
//     //console.log(d.image);
//     try{
//       if(d.image){
//         //This is a patch for sinar estructure
//       }else{
//         //This is the cargografias structure
//         d.image = d.images ? d.images[0].url :'/img/person.png'    // get popit picture
//       }
//
//     }
//     catch(e){
//       d.image = '/img/person.png' ;
//     }
//   };
//
//   //Initials for graphics
//   f.setInitials = function(d){
//     if(d.given_name){
// 	    var splitedName =  d.given_name.split(' ')
// 	    d.initials = d.given_name ? splitedName.map(function(item){ return item.substr(0,1).toUpperCase() }).join('.') + "." : '-';
//     }else{
//       if(d.name){
//         var splitedName =  d.name.split(' ')
//         d.initials = d.name ? splitedName.map(function(item){ return item.substr(0,1).toUpperCase() }).join('.') + "." : '-';
//       }else{
//         d.initials = d.family_name;
//       }
//     }
//   }
//
//   f.setShareableID = function(d){
//     if(d.id_sha1){
//       d.popitID = d.id_sha1.substring(0,6);
//     }else{
//       d.popitID = d.id;
//     }
//
//   }
//
//   f.setCheaqueadoCheck = function(d,m){
//       if (m.sources){
//        for (var i = 0; i < m.sources.length; i++) {
//           var s = m.sources[i];
//           if (s.quality){
//             var isChequeado = s.quality.toLowerCase().indexOf('chequeado') > 0;
//             if (isChequeado){
//                d.chequeado = true;
//                m.chequeado = true;
//             }
//           }
//         }
//     }
//   }
//
//   f.processMemberships = function(d){
//     var approved = [];
//     d.chequeado = false;
//     for (var i = 0; i < d.memberships.length; i++) {
//
//       var m = d.memberships[i];
//       //Remuevo los privados
//       if(m.type){
//         if (m.type.toLowerCase() !== "privado" && m.type.toLowerCase() !== "otro"){
//           f.extractArea(m);
//           f.setCheaqueadoCheck(d,m);
//           approved.push(m);
//         }
//       }else{
//         f.extractArea(m);
//         f.setCheaqueadoCheck(d,m);
//         approved.push(m);
//       }
//
//     }
//     d.memberships = approved;
//
//   }
//
//   f.extractArea = function(m){
//
//     //----- MANU
//     if(m.area === undefined){
//       console.log('No area found: memberships',m.id);
//         m.area ={
//           id: "AREA-NOT-FOUND",
//           name: "AREA-NOT-FOUND",
//         };
//         m.area_name = "AREA-NOT-FOUND";
//     }
//     // ------
//     if(m.area){
//       try{
//               var z = m.area.id.trim();
//               //HACK: Forcing load of territories.
//               if (z.split(',').length === 1){
//                 z = z.replace(/ ,/g,' ')
//               }
//               m.area.id = toTitleCase(z);
//               m.area.name =  toTitleCase(z);
//               //HACK: To use angular filter
//               m.area_name =  toTitleCase(z);
//             }
//           catch(e){
//             console.log('No area found: memberships',m.id);
//               m.area ={
//                 id: "AREA-NOT-FOUND",
//                 name: "AREA-NOT-FOUND",
//               };
//               m.area_name = "AREA-NOT-FOUND";
//           }
//     }else{
//       if(m.organization.area){
//         try{
//           var z = m.organization.area;
//           //HACK: Forcing load of territories.
//           if (z.split(',').length === 1){
//             z = z.replace(/ ,/g,' ')
//           }
//           m.area ={
//             id: toTitleCase(z),
//             name: toTitleCase(z),
//           };
//           //HACK: To use angular filter
//           m.area_name =  toTitleCase(z);
//         }
//         catch(e){
//           console.log('No area found: memberships',m.id);
//             m.area ={
//               id: "AREA-NOT-FOUND",
//               name: "AREA-NOT-FOUND",
//             };
//             m.area_name = "AREA-NOT-FOUND";
//         }
//       }
//
//     }
//
//
//   }
//
//
//
//
//   return f;
// });
//
// //TODO: this should be on popit, hard hack for Elections BA.
// var chequeados = ["2c109a", "55a99b","5928af", "1d3338", "f4b3f5"];
