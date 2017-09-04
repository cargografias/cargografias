'use strict';

/* Filters */

angular.module('cargoApp.factories')
  .factory('presetsFactory', function($http, $filter) {

    var factory ={};
    factory.presets = [];

    factory.presets.push({
      nombre:'Presidentes de la Democracia',
      valores:'name-466721-df417b-c712cb-e07b04-33d4c4-455e6c-04a407',
    });
    factory.presets.push({
      nombre:'Candidatos 2015',
      valores:'name-843c98-43300a-0713d6-a445a1-67fc76-be5cbb',
    });
    factory.presets.push({
      nombre:'Intendentes Populares',
      valores:'name-689d5f-b96f8d-4da31d-c4f4f0',
    });
    factory.presets.push({
      nombre:'Gobernadores Reelectos',
      valores:'name-6c2502-2c487f-818b96-64634b-7b9f45-843c98',
    });

    return factory;
});
