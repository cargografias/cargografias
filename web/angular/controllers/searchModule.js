function searchModule(option,parameter,callback) {
  if(option === 'name'){
        var url = "https://quienesquienapi.herokuapp.com/v1/persons?name=/" + parameter + "/i"

        var xmlHttp = new XMLHttpRequest();
        xmlHttp.onreadystatechange = function() {
            if (xmlHttp.readyState == 4 && xmlHttp.status == 200){
              var obj = JSON.parse(xmlHttp.response);
              // obj.memberships =   searchModule('memberships',q,function(res){
              //                         return res
              //                       })
              console.log(obj);
              obj.data.map(function(p) {
                // p.memberships = membershipsf(parameter)
                p.memberships = ["memberships1","memberships2"]
              })
              // obj.data.map(function(p) {
              //    p.territory = terrytoryf(parameter)
              // })
              // obj.data.map(function(p) {
              //    p.years = yearsf(parameter)
              // })
              // obj.data.map(function(p) {
              //    p.institutions = institutionsf(parameter)
              // })
              callback(obj);
            }
        }
        xmlHttp.open("GET", url, true); // true for asynchronous
        xmlHttp.send(null);

  }


  if(option === 'territory'){
        var url = "https://quienesquienapi.herokuapp.com/v1/organizations?country=Argentina&offset=0"

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
        var url = "https://quienesquienapi.herokuapp.com/v1/contracts?terrytory=/" + parameter + "/i"

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
  //pegar aca territoryf, yearsf e institutionsf cuando funcione qqw
  // if(option === 'memberships'){
  //   console.log("BUSCA POR MEMBRESIA");
  //       var url = "https://quienesquienapi.herokuapp.com/v1/memberships?person_id=/" + parameter + "/i"+"&offset=0"
  //       console.log(url);
  //       var xmlHttp = new XMLHttpRequest();
  //       xmlHttp.onreadystatechange = function() {
  //           if (xmlHttp.readyState == 4 && xmlHttp.status == 200){
  //             var obj = JSON.parse(xmlHttp.response);
  //             callback(obj);
  //           }
  //       }
  //       xmlHttp.open("GET", url, true); // true for asynchronous
  //       xmlHttp.send(null);
  // }
}



//viejo buscador, busca por nombre y funciona bien
// function httpRequest(theUrl, callback)
// {
//     var xmlHttp = new XMLHttpRequest();
//     xmlHttp.onreadystatechange = function() {
//         if (xmlHttp.readyState == 4 && xmlHttp.status == 200){
//           var obj = JSON.parse(xmlHttp.response);
//           callback(obj);
//         }
//     }
//     xmlHttp.open("GET", theUrl, true); // true for asynchronous
//     xmlHttp.send(null);
// }
