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
                // return p.data["memberships"] = "memberships";
                p.memberships = ["memberships1","memberships2"]
              })
              callback(obj);
            }
        }
        xmlHttp.open("GET", url, true); // true for asynchronous
        xmlHttp.send(null);



  }

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
