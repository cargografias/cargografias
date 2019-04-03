//distinct objects for javascript
var distinctOrganizations = []
var distinctMemberships = []
var distinctRoles = []
var distinctYears = []

//distinct objects fot angular scope
//$scope.distinctRoles
//$scope.distinctTerritories
//$scope.distinctOrganizations


function searchModule(option,parameter,callback) {
  if(option === 'name'){
        var url = "https://quienesquienapi.herokuapp.com/v1/persons?name=/" + parameter + "/i"

        var xmlHttp = new XMLHttpRequest();
        xmlHttp.onreadystatechange = function() {
            if (xmlHttp.readyState == 4 && xmlHttp.status == 200){
              var obj = JSON.parse(xmlHttp.response);
              obj.data.map(function(p) {
                var url = 'https://quienesquienapi.herokuapp.com/v1/memberships?person_id=/'+ p.simple + '/i'
                // var url = 'https://quienesquienapi.herokuapp.com/v1/memberships?person_id=/'+ p.name + '/i'
                var xmlHttp = new XMLHttpRequest();
                xmlHttp.onreadystatechange = function() {
                    if (xmlHttp.readyState == 4 && xmlHttp.status == 200){
                       p.memberships  = JSON.parse(xmlHttp.response);
                       p.end = ''
                       p.start = ''
                    }
                }
                xmlHttp.open("GET", url, true); // true for asynchronous
                xmlHttp.send(null);
              })
              callback(obj);
            }
        }
        xmlHttp.open("GET", url, true); // true for asynchronous
        xmlHttp.send(null);

  }

  if(option === 'toActivePerson'){

      var url = "https://quienesquienapi.herokuapp.com/v1/persons?name=/" + parameter + "/i"

      var xmlHttp = new XMLHttpRequest();
      xmlHttp.onreadystatechange = function() {
          if (xmlHttp.readyState == 4 && xmlHttp.status == 200){
            var obj = JSON.parse(xmlHttp.response);
            distinctRoles = []
            distinctYears = []
            distinctOrganizations = []
            distinctTerritories = []
            obj.data.map(function(p) {
              p.distinctRoles = []
              p.distinctYears = []
              p.distinctOrganizations = []
              p.distinctTerritories = []

              var url = 'https://quienesquienapi.herokuapp.com/v1/memberships?person_id=/'+ p.simple + '/i'
              // var url = 'https://quienesquienapi.herokuapp.com/v1/memberships?person_id=/'+ p.name + '/i'
              var xmlHttp = new XMLHttpRequest();
              xmlHttp.onreadystatechange = function() {
                  if (xmlHttp.readyState == 4 && xmlHttp.status == 200){
                    var activeMemberships = JSON.parse(xmlHttp.response);
                    p.memberships  = activeMemberships.data
                    p.memberships.map(function(o){
                    if(o.start_date !== undefined) {
                      o.start = o.start_date.slice(0, 4)
                    }else{
                      o.start = 1970
                    }
                    if(o.end_date !== undefined){
                      o.end = o.end_date.slice(0,4)
                    }else{
                      o.end = 1971
                    }
                    if(o.sob_org !== undefined){
                      o.area = {'name':o.sob_org,'id':o.sob_org}
                    }else{
                      o.area = {'name': "NOT FOUND",'id': "NOT FOUND"}
                    }
                    p.initials=' '
                    o.cargoProfileURL = 'undefined'
                    o.class = 'electivo'
                    p.distinctRoles.push(o.role)
                    p.distinctYears.push(o.start_date)
                    p.distinctOrganizations.push(o.sob_org)
                    p.distinctTerritories.push(o.territory)

                    distinctRoles.push(o.role)
                    distinctYears.push(o.start_date)
                    distinctOrganizations.push(o.sob_org)
                    distinctTerritories.push(o.territory)

                    p.biography = 'undefined'
                    p.birth_date = 'undefined'
                    p.birth_place = 'undefined'
                    p.cargoProfileURL = 'undefined'
                    p.chequeado = false
                    p.contact_details = 'undefined'
                    p.death_date = null
                    p.full = true
                    p.given_name = 'undefined'
                    p.html_url = 'undefined'

                    p.images = []
                    p.index = 3309
                    p.periods = []
                    p.sumary = []
                    p.url = 'undefined'
                      // activeRoles.push(o.role)
                      // obj.Roles = activeRoles
                      //
                      // activeYears.push(o.start_date)
                      // obj.activeYears = activeYears
                      //
                      // activeOrganizations.push(o.sob_org)
                      // obj.activeOrganizations = activeOrganizations
                      //
                      // activeTerritories.push(o.territory)
                      // obj.activeTerritories = activeTerritories
                      //
                      // obj.created_at = obj.data[0].created_at
                      // obj.family_name = obj.data[0].family_name
                      // obj.first_name = obj.data[0].first_name
                      // obj.names = obj.data[0].names
                      // obj.name = obj.data[0].name
                      // obj.simple = obj.data[0].simple
                      // obj.user_id = obj.data[0].user_id
                      // obj._id = obj.data[0]._id
                      // obj.agregada = true
                      // p.territories = activeTerritories
                     //  if (p.activeOrganizations.indexOf(p.sob_org) === -1) {p.activeOrganizations.push(p.sob_org)}
                     //  if (p.activeRoles.indexOf(p.role) === -1) {p.activeRoles.push(p.role)}
                     //  if (p.activeYears.indexOf(p.start_date) === -1) {p.activeYears.push(p.start_date)}
                     //  if (p.activeTerritories.indexOf(p.territory) === -1) {p.activeTerritories.push(p.territory)}
                    })
                     obj.end = ''
                     obj.start = ''

                  }
              }
              xmlHttp.open("GET", url, true); // true for asynchronous
              xmlHttp.send(null);
            })

            callback(obj);
          }
      }
      xmlHttp.open("GET", url, true); // true for asynchronous
      xmlHttp.send(null);


}

  if(option === 'territory'){
        // var url = "https://quienesquienapi.herokuapp.com/v1/organizations?country=Argentina&offset=0"
        var url = "https://quienesquienapi.herokuapp.com/v1/memberships/distinct/territory"
        var xmlHttp = new XMLHttpRequest();
        xmlHttp.onreadystatechange = function() {
            if (xmlHttp.readyState == 4 && xmlHttp.status == 200){
              var obj = JSON.parse(xmlHttp.response);
              callback(obj);
            }
        }
        xmlHttp.open("GET", url, true); // true for asynchronous
        xmlHttp.send(null);
  }

  if(option === 'role'){
        // var url = "https://quienesquienapi.herokuapp.com/v1/contracts?terrytory=/" + parameter + "/i"
        var url = "https://quienesquienapi.herokuapp.com/v1/memberships?post_type&fields=role"

        var xmlHttp = new XMLHttpRequest();
        xmlHttp.onreadystatechange = function() {
            if (xmlHttp.readyState == 4 && xmlHttp.status == 200){
              var obj = JSON.parse(xmlHttp.response);
              callback(obj);
            }
        }
        xmlHttp.open("GET", url, true); // true for asynchronous
        xmlHttp.send(null);

  }
}

'use strict';
/* Filters */

angular.module('cargoApp.factories', [])
  .factory('cargoLoaderFactory', function($http) {
    var datasources = [];

    var cargografiasSources = [];

    var instanceName = window.__config.instanceName;
    
    cargografiasSources.push(window.__config.baseStaticPath + '/datasets/' + instanceName + '-persons.json' + '?v=' + window.__config.lastUpdate);
    cargografiasSources.push(window.__config.baseStaticPath + '/datasets/' + instanceName + '-memberships.json' + '?v=' + window.__config.lastUpdate);
    cargografiasSources.push(window.__config.baseStaticPath + '/datasets/' + instanceName + '-organizations.json' + '?v=' + window.__config.lastUpdate);

    var currentDataSource = cargografiasSources;
    var f = {};

    f.load = function($scope,factory,callback, $rootScope){
            $http.get('/js/datasets/pesopoder.json')
                .then(function(res){
                $rootScope.estado = "Representatividad";
                factory.weight = res.data;
                });
              $http.get(currentDataSource[0])
                 .then(function(res){
                  $rootScope.estado = "Personas";
                    for (var i = 0; i < res.data.length; i++) {
                      //Search Index
                      var item = res.data[i]
                      res.data[i].index = i;
                      f.processImages(item);
                      f.setInitials(item);
                      try{
                        f.setShareableID(item);
                        f.processMemberships(item);
                      }
                      catch(e){
                        console.log("Loading error", e, res.data[i].name, res.data[i].id_sha1);
                      }
                      factory.mapId[item.popitID] = i;
                      factory.autoPersons.push(item);
                      factory.persons = res.data;
                    };
                    distinctPersons = factory.persons;
                    $scope.distinctPersons = distinctPersons
              }).then(function(){
                  $http.get(currentDataSource[2])
                    .then(function(res){
                      $rootScope.estado = "Organizaciones";
                      factory.organizations = res.data;
                      distinctOrganizations = factory.organizations
                      $scope.distinctOrganizations = factory.organizations
                      })
                  })
                  .then(function(){
                  $http.get(currentDataSource[1])
                    .then(function(res){
                      $rootScope.estado = "Memberships";
                      distinctMemberships = res.data
                      distinctMemberships.map(function(el){
                        distinctRoles.push(el.role)
                        factory.distinctRoles.push(el.role)
                      })
                      distinctRoles = _.unique(distinctRoles)
                      $scope.distinctRoles = distinctRoles
                  })
                  .then(function(){
                    $scope.distinctTerritories = factory.getTerritories()
                  })
                  .then(callback);
                });
  };

  //Photo or default photo
  f.processImages = function(d){
    //console.log(d.image);
    try{
      if(d.image){
        //This is a patch for sinar estructure
      }else{
        //This is the cargografias structure
        d.image = d.images ? d.images[0].url :'/img/person.png'    // get popit picture
      }

    }
    catch(e){
      d.image = '/img/person.png' ;
    }
  };

  //Initials for graphics
  f.setInitials = function(d){
    if(d.given_name){
	    var splitedName =  d.given_name.split(' ')
	    d.initials = d.given_name ? splitedName.map(function(item){ return item.substr(0,1).toUpperCase() }).join('.') + "." : '-';
    }else{
      if(d.name){
        var splitedName =  d.name.split(' ')
        d.initials = d.name ? splitedName.map(function(item){ return item.substr(0,1).toUpperCase() }).join('.') + "." : '-';
      }else{
        d.initials = d.family_name;
      }
    }
  }

  f.setShareableID = function(d){
    if(d.id_sha1){
      d.popitID = d.id_sha1.substring(0,6);
    }else{
      d.popitID = d.id;
    }

  }

  f.setCheaqueadoCheck = function(d,m){
      if (m.sources){
       for (var i = 0; i < m.sources.length; i++) {
          var s = m.sources[i];
          if (s.quality){
            var isChequeado = s.quality.toLowerCase().indexOf('chequeado') > 0;
            if (isChequeado){
               d.chequeado = true;
               m.chequeado = true;
            }
          }
        }
    }
  }
  f.processMemberships = function(d){
    var approved = [];
    d.chequeado = false;
    for (var i = 0; i < d.memberships.length; i++) {

      var m = d.memberships[i];
      //Remuevo los privados
      if(m.type){
        if (m.type.toLowerCase() !== "privado" && m.type.toLowerCase() !== "otro"){
          f.extractArea(m);
          f.setCheaqueadoCheck(d,m);
          approved.push(m);
        }
      }else{
        f.extractArea(m);
        f.setCheaqueadoCheck(d,m);
        approved.push(m);
      }

    }
    d.memberships = approved;

  }

  f.extractArea = function(m){

    if(m.area === undefined){
        m.area ={
          id: "AREA-NOT-FOUND",
          name: "AREA-NOT-FOUND",
        };
        m.area_name = "AREA-NOT-FOUND";
    }
    if(m.area){
      try{
              var z = m.area.id.trim();
              //HACK: Forcing load of territories.
              if (z.split(',').length === 1){
                z = z.replace(/ ,/g,' ')
              }
              m.area.id = toTitleCase(z);
              m.area.name =  toTitleCase(z);
              //HACK: To use angular filter
              m.area_name =  toTitleCase(z);
            }
          catch(e){
            console.log('No area found: memberships',m.id);
              m.area ={
                id: "AREA-NOT-FOUND",
                name: "AREA-NOT-FOUND",
              };
              m.area_name = "AREA-NOT-FOUND";
          }
    }else{
      if(m.organization.area){
        try{
          var z = m.organization.area;
          //HACK: Forcing load of territories.
          if (z.split(',').length === 1){
            z = z.replace(/ ,/g,' ')
          }
          m.area ={
            id: toTitleCase(z),
            name: toTitleCase(z),
          };
          //HACK: To use angular filter
          m.area_name =  toTitleCase(z);
        }
        catch(e){
          console.log('No area found: memberships',m.id);
            m.area ={
              id: "AREA-NOT-FOUND",
              name: "AREA-NOT-FOUND",
            };
            m.area_name = "AREA-NOT-FOUND";
        }
      }
    }
  }
  return f;
});


angular.module('cargoApp.factories')
	.factory('cargosFactory', function($http, $filter, cargoLoaderFactory) {
    var factory ={};
    factory.mapId ={};
    factory.persons= [];
    factory.posts= [];
    factory.memberships= [];
    factory.territories= [];
    factory.organizations= [];
    factory.distinctRoles= [];
    factory.distinctYears= [];
    factory.weight= [];
    factory.autoPersons=[];

//------------------------------------------------------------------------------
    factory.getFullPerson = function(id){
      // var p = this.persons.popitID[id];
      if (!id.full){

        id.periods = this.getPeriods(id);
        id.summary = this.getSummary(id);
        id.full = true;
        id.weight = this.setWeight(id)
      }
      return id;
    }
//------------------------------------------------------------------------------
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
//------------------------------------------------------------------------------
    factory.getAutoPersons = function(q){
      return $filter('filter')(this.autoPersons, {name: q}, ignoreAccentsCompare);
    };
//------------------------------------------------------------------------------
		factory.getTerritoryByName = function(territoryName){
      for (var i = 0; i < factory.territories.length; i++) {
        var o = factory.territories[i];
        if (o === territoryName){
          return o;
        }
      }
      return undefined;
    }
//------------------------------------------------------------------------------
    factory.getAutoPersonsAdvance = function(filter,name){
        var search = false;
        var autoPersonsResult = this.autoPersons;
        if( filter.name !== undefined && filter.name !== null) {
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
    }
//------------------------------------------------------------------------------
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
    }
//------------------------------------------------------------------------------
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
//------------------------------------------------------------------------------
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

    }
//------------------------------------------------------------------------------
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
//------------------------------------------------------------------------------
		factory.getTerritories = function() {
			if (factory.territories.length === 0){
				var allTerritories = new Array();
				_.each(factory.persons, function(p, index) {
						_.each(p.memberships,function(m,i){
							//if(_.isString(m.area.name) && m.area.name !== '') {
								//allTerritories.push(m.area.name);
							//}
							if(m.area){
								allTerritories.push(m.area.name);
							}else{
								if(m.organization){
									if(m.organization.area){
										allTerritories.push(m.organization.area.name);
									}
								}
							}
						});

				});
        factory.territories = _.unique(allTerritories);
			}
		return factory.territories;
	}
//------------------------------------------------------------------------------
    factory.getOrganizationByName = function(organizationName){

      for (var i = 0; i < this.organizations.length; i++) {
        var o = this.organizations[i];
        if (o.name === organizationName){
          return o;
        }
      }
      return undefined;
    }
//------------------------------------------------------------------------------
    factory.getOrganizations = function() {
        var allOrganizations = new Array();

        _.each(this.organizations, function(organization, index) {
            if(_.isString(organization.name) && organization.name !== '') {
                allOrganizations.push(organization.name);
            }
        });
        console.log(allOrganizations);
        return _.unique(allOrganizations);
    }
//------------------------------------------------------------------------------
    factory.getJobTitle = function() {
        var allMemberships = new Array();

        _.each(this.persons, function(p, index) {
            _.each(p.memberships,function(m,i){
              if(_.isString(m.label) && m.label !== '') {
                allMemberships.push(m.label);
              }
            });

        });

        return _.unique(allMemberships);
    }
//------------------------------------------------------------------------------
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
//------------------------------------------------------------------------------
    factory.load = function ($scope,callback, $rootScope) {
      cargoLoaderFactory.load($scope,factory,callback, $rootScope);
    }
		//------------------------------------------------------------------------------

		return factory;
});
