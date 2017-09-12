'use strict';

/* Filters */

angular.module('cargoApp.factories')
	.factory('cargosFactory', function($http, $filter, cargoLoaderFactory) {



    var factory ={};
    factory.mapId ={};
    factory.persons= [];
    factory.posts= [];
    factory.memberships= [];
    factory.territories= [];
    factory.organizations= [];
    factory.weight= [];
    factory.autoPersons=[];
    factory.getFullPerson = function(id){
      var p = this.persons[id];
      if (!p.full){

        p.periods = this.getPeriods(p);
        p.summary = this.getSummary(p);
        p.full = true;
        p.weight = this.setWeight(p)
      }
      return p;
    };
    factory.getHallOfShame =function(activePersons){
      if (activePersons.length == 0){
        return;
      }
      var hall = [];
        var shames = [];
        var simpleNumber = function(person){
          var s = this;
          return person.summary[s.value];
        }
        //TODO: tenemos que pasarlo a una lista
        shames.push({
          name: customization.electPosition,
          uom:'cargos',
          expression:'-summary.elected',
          value: 'elected',
          getNumber: simpleNumber
        });
        shames.push({
          name: customization.executivePosition,
          uom:'cargos',
          expression:'-summary.executives',
          value: 'executives',
          getNumber: simpleNumber
        });
        shames.push({
          name: customization.electivePositions,
          uom:'cargos',
          expression:'-summary.legislative',
          value: 'legislative',
          getNumber: simpleNumber
        });
        shames.push({
          name: customization.judiciaryPositions,
          expression:'-summary.judiciary',
          value: 'judiciary',
          getNumber: simpleNumber
        });
        shames.push({
          name: 'Reelecciones',
          uom:'relecciones',
          expression:'-summary.reElected',
          value: 'reElected',
          getNumber: simpleNumber
        });
        shames.push({
          name: 'Cargos No electivos',
          uom:'cargos',
          expression:'-summary.notElected',
          value: 'notElected',
          getNumber: simpleNumber
        });
        shames.push({
          name: customization.differentPositions,
          uom:'cargos',
          expression:'-memberships.length',
          getNumber: function(person){
            return person.memberships.length;
          }
        });
        shames.push({
          name: customization.yearsInFunction,
          uom:'años',
          expression:'-periods.yearsCharges',
          getNumber: function(person){
            return person.periods.yearsCharges;
          }
        });
        shames.push({
          name: customization.yearsInPolitics,
          uom:'años',
          expression:'-periods.yearsPolitics',
          getNumber: function(person){
            return person.periods.yearsPolitics;
          }
        });



              // <td>{{active.memberships.length}}</td>
              // <td>{{active.periods.started}}</td>
              // <td>{{active.periods.last}}</td>


        for (var i = 0; i < shames.length; i++) {
          var s = shames[i];
          var order = $filter('orderBy')(activePersons, s.expression, false);
          var first = order[0];
          if (s.getNumber(first) > 0){
            hall.push({
                titulo: s.name,
                nombre: first.name,
                medida: s.uom,
                cantidad: s.getNumber(first),
              });
          }
        };
      return hall;
    };
    factory.setWeight = function(person){
      for (var i = 0; i < person.memberships.length; i++) {
        var m = person.memberships[i];
        if (m.label)
          for (var j = 0; j < this.weight.length; j++) {

            var w = this.weight[j];

            if (w.cargo.toLowerCase() === m.label.toLowerCase()
              && w.poder.toLowerCase()  === m.type.toLowerCase()){
              m.weight = this.weight[j].representacion;
              m.hierarchy = this.weight[j].posicion;
            }
          }
        }
    };

    factory.getAutoPersons = function(q){
      return $filter('filter')(this.autoPersons, {name: q}, ignoreAccentsCompare);
    };

    factory.getAutoPersonsAdvance = function(filter,name){
			console.log(filter);

        var search = false;
        var autoPersonsResult = this.autoPersons;
        if( filter.name !== undefined || filter.name !== null) {
          autoPersonsResult =  $filter('filter')(autoPersonsResult,
            {name: filter.name},
          ignoreAccentsCompare);
          search = true;

        }

        if( filter.territory !== undefined && filter.territory !== null) {
            var territory = factory.getTerritoryByName(filter.territory);

            if(territory !== undefined) {

                var params = { memberships: {
                        area_name: territory,
                    }
                  };
                if(filter.jobTitle !== undefined && filter.jobTitle !== null) {
                  params.memberships.label = filter.jobTitle;
                }
                autoPersonsResult = $filter('filter')(autoPersonsResult, params);
                search = true;
            }
        }
        else if(filter.jobTitle !== undefined && filter.jobTitle !== null) {

            autoPersonsResult = $filter('filter')(autoPersonsResult, {
                memberships: {
                    label: filter.jobTitle
                }
            });

            search = true;
        }

        if( filter.decade !== undefined && filter.decade !== null) {
					console.log("In decade!");
            var inDecade = false;

            var autoPersonsResult = _.filter(autoPersonsResult, function(data){
                inDecade = false;

                _.each(data.memberships, function(membership){
                    if(filter.jobTitle !== undefined && filter.jobTitle !== null) {
                        if(filter.jobTitle == membership.label && factory.inDecade(filter.decade, membership.start_date, membership.end_date)) {
                            inDecade = true;
                            search = true;
                        }
                    } else {
                        if(factory.inDecade(filter.decade, membership.start_date, membership.end_date)) {
                            inDecade = true;
                            search = true;
                        }
                    }

                });

                return inDecade;
            });
        }

        if(search) {
            return autoPersonsResult;
        }

        return [];
    };

    factory.inDecade = function(decade, startDate, endDate) {

        var startYear = new Date(startDate).getFullYear();
        var endYear = new Date(endDate).getFullYear();

        if(startYear >= decade && startYear < decade + 10) {
            return true;
        }

        if(endYear >= decade && endYear < decade + 10) {
            return true;
        }

        return false;
    };

    factory.getPoderometro = function(year, persons){

      var ejecutivo = { name:"Ejecutivo", children: []};
      var legistlativo = { name:"Legislativo", children: []};
      var judicial = { name:"Judicial", children: []};
      var data =  { name:"Argentina", children: []};



      for (var i = 0; i < persons.length; i++) {
          var p = persons[i];
          var activeMembershipForYear = factory.getActiveMembershipByYear(p,year);
          if (activeMembershipForYear){
            var item = {
              name: p.name,
              position: activeMembershipForYear.label,
              size: activeMembershipForYear.weight
            }

              if (activeMembershipForYear.type == 'Ejecutivo'){
                ejecutivo.children.push(item)
              }else if (activeMembershipForYear.type == 'Legislativo'){
                legistlativo.children.push(item)
              }else if (activeMembershipForYear.type == 'Judicial'){
                judicial.children.push(item)
              }
          }
      };
      if (ejecutivo.children.length > 0){ data.children.push(ejecutivo);}
      if (legistlativo.children.length > 0){ data.children.push(legistlativo);}
      if (judicial.children.length > 0){ data.children.push(judicial);}


      return data;
    };

    factory.getPoderometroAnimado = function (year, persons){

      var poderometro =[];
      for (var i = 0; i < persons.length; i++) {
          var p = persons[i];
          var activeMembershipForYear = factory.getActiveMembershipByYear(p,year);
          var item = {
              id:p.id,
              cargo:"Sin cargo en " + year,
              name: p.name,
              initials: p.initials,
              classification: "sin cargo",
              district: "Sin cargo en " + year,
              position: "",
              size: 5,
            };
          if (activeMembershipForYear){
            item = {
              cargo:activeMembershipForYear.type.toLowerCase(),
              id: p.id,
              name: p.name,
              initials: p.initials,
              classification: activeMembershipForYear.organization.classification,
              district: activeMembershipForYear.organization.name,
              position: activeMembershipForYear.label,
              size: activeMembershipForYear.weight
            }
          }
          poderometro.push(item);
          activeMembershipForYear= undefined;
      };
      return poderometro;
    };

    factory.getActiveMembershipByYear = function(p,year){
      var memberships = p.memberships;
          var activeMembershipForYear;
          for (var j = 0; j < memberships.length; j++) {
              var m = memberships[j];
              if (year >= m.start && m.end >=year){
                if (!m.organization){
                  m.organization = this.getOrganization(m.organization_id);
                }
                activeMembershipForYear = m;
                break;
              }
          };
          return activeMembershipForYear;
    };
    factory.getJerarquimetro = function(year, persons){
      var positions =[];
      var ejecutivo = [];
      var legistlativo = [];
      var judicial = [];

      for (var i = 0; i < persons.length; i++) {
          var p = persons[i];
          var activeMembershipForYear = factory.getActiveMembershipByYear(p,year);
          if (activeMembershipForYear){
            var item = {
              cargo:activeMembershipForYear.type.toLowerCase(),
              name: p.name,
              position: activeMembershipForYear.label,
              level: activeMembershipForYear.hierarchy
            }
            //TODO: Translate?
             if (activeMembershipForYear.type == 'Ejecutivo'){
                ejecutivo.push(item)
              }else if (activeMembershipForYear.type == 'Legislativo'){
                legistlativo.push(item)
              }else if (activeMembershipForYear.type == 'Judicial'){
                judicial.push(item)
              }

          }
          activeMembershipForYear= undefined;
      };
      positions.push(ejecutivo);
      positions.push(legistlativo);
      positions.push(judicial);

      var expression = '+level';
      for (var z = 0; z < positions.length; z++) {
        var p= positions[z]
        var treeData =[];
        var sorted = $filter('orderBy')(p, expression, false);


        for (var i = 0; i < sorted.length; i++) {
          var s = sorted[i];
          if (treeData.length === 0){
            treeData.push({
              name:s.name,
              parent:null,
              level: s.level,
              children:[]
            });
          }
          else {
            this.processItemsTree(treeData, s);

          }
        }
        positions[z] = treeData;
      }


      return positions;
    };
    factory.processItemsTree = function(treeData, s){
        for (var j = 0; j < treeData.length; j++) {
              //Same Level, just push.
              if (s.level === treeData[j].level){
                treeData.push({
                  name:s.name,
                  parent:null,
                  level: s.level,
                  children:[]
                });
                break;
              }
              else if (treeData[j].children.length == 0){
                treeData[j].children.push({
                  name:s.name,
                  parent:null,
                  level: s.level,
                  children:[]
                });
                break;

              }
              else{
                factory.processItemsTree(treeData[j].children, s);

              }
            }
    }
    factory.getPeriods= function(person){
      var yearsSum = 0;
      for (var i = 0; i < person.memberships.length; i++) {
        var m = person.memberships[i];
        m.start = m.start_date ? parseInt(m.start_date.substring(0,4)) : moment().year();
        m.end = m.end_date ? parseInt(m.end_date.substring(0,4)) : moment().year();
        m.started = moment(m.start_date);
        m.finished = moment(m.end_date);
        m.years = m.finished.diff(m.started, 'years', true);
        m.years = parseFloat(m.years.toFixed(2));
        yearsSum+= m.years;
      };

      var expression = '-started';
      var a = $filter('orderBy')(person.memberships, expression, false);
       var resume = {
            started: undefined,
            last: undefined,
            yearsCharges: 0,
            yearsPolitics:0,
        };
      try{
        resume = {
            started: moment(a[a.length-1].start_date),
            last: a[0].end_date ? moment(a[0].end_date) : undefined,
            yearsCharges: parseFloat(yearsSum.toFixed(2))
        };
         var now =moment();
        var years = 0;
        if (resume.last){
          //Si el periodo termina despues.
          if (now.diff(resume.last, 'milliseconds', true) > 0){
               years =resume.last.diff(resume.started, 'years', true);
          }
          else {
            years = now.diff(resume.started , 'years', true);
          }
        }
        else {
          years = now.diff(resume.started , 'years', true);

        }
        //Si el periodo ya termino.
        resume.yearsPolitics = parseFloat(years.toFixed(2));

        return resume ;
      }
      catch(e){
        console.log('resume not available for, please check start/end dates', person);
        return resume;
      }



    };
    factory.getSummary = function(person){
      var summary =
      {
          executives: 0,
          legislative:0,
          judiciary: 0,
          elected : 0 ,
          notElected: 0,
          reElected: 0
      };
      for (var i = 0; i < person.memberships.length; i++) {

        var m = person.memberships[i];
        person.memberships[i].organization = this.getOrganization(m.organization_id);
        var cargo = person.memberships[i];
        if (cargo){
          if (cargo.class == 'Electivo'){
            summary.elected++;
          }else if (cargo.class == 'No Electivo'){
            summary.notElected++;
          }

          if (cargo.type == 'Ejecutivo'){
            summary.executives++;
          }else if (cargo.type == 'Legislativo'){
            summary.legislative++;
          }else if (cargo.type == 'Judicial'){
            summary.judiciary++;
          }
        }


      };
        return summary;

    };



    factory.getOrganization = function(organization_id){

      for (var i = 0; i < this.organizations.length; i++) {
        var o = this.organizations[i];
        if (o.id === organization_id){

          //TODO: How do we set levels for other countries?
          //TODO: Should we add them to popit?
          var level = o.name === 'Argentina' ? 'nacional' : 'provincial' //: 'local'
          o.level = level
          return o;
        }
      }
      return undefined;
    }

    factory.getTerritoryByName = function(territoryName){

      for (var i = 0; i < factory.territories.length; i++) {
        var o = factory.territories[i];
        if (o === territoryName){
          return o;
        }
      }
      return undefined;
    }

    factory.getOrganizationByName = function(organizationName){

      for (var i = 0; i < this.organizations.length; i++) {
        var o = this.organizations[i];
        if (o.name === organizationName){
          return o;
        }
      }
      return undefined;
    }

    factory.getOrganizations = function() {
        var allOrganizations = new Array();

        _.each(this.organizations, function(organization, index) {
            if(_.isString(organization.name) && organization.name !== '') {
                allOrganizations.push(organization.name);
            }
        });

        return _.unique(allOrganizations);
    }

      factory.getTerritories = function() {
        // if (factory.territories.length === 0){
        //   var allTerritories = new Array();
        //   _.each(factory.persons, function(p, index) {
        //       _.each(p.memberships,function(m,i){
        //         // if(_.isString(m.area.name) && m.area.name !== '') {
        //         //   allTerritories.push(m.area.name);
        //         // }
        //       });
				//
        //   });
        //   factory.territories = _.unique(allTerritories);
        // }
				searchModule('territory', 'Argentina', function(res) {
						factory.territories = res.data;
						// console.log("territories");
						// console.log($scope.territories);
				})

      return factory.territories;
    }

    factory.getJobTitle = function() {
        var allMemberships;
				//
        // _.each(this.persons, function(p, index) {
        //     _.each(p.memberships,function(m,i){
        //       if(_.isString(m.label) && m.label !== '') {
        //         allMemberships.push(m.label);
        //       }
        //     });
				//
        // });
				searchModule('role', 'Argentina', function(res) {
					factory.role = res.data;
						// $scope.territories = res.data;
						// console.log("territories");
						// console.log($scope.territories);
				})

        // return _.unique(allMemberships);
				return factory.role
    }

    factory.getDecades = function(from) {
        var to   = new Date().getFullYear();
        var decades = [];

        while(from < to + 10) {
            decades.push(from);
            from += 10;
        }
        var d = decades.map(function(d){ return {key:d, label:d + "-" + (d+10)}});
        return d;
    }

    factory.load = function ($scope,callback, $rootScope) {
      cargoLoaderFactory.load($scope,factory,callback, $rootScope);
    }




		return factory;
});
