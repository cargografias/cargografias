var request = require('request');

function person(req, res){
	var instanceName = req.params.instanceName;
	var personId = req.params.personId;

	var url = "https://" + instanceName + "/api/v0.1/persons/" + personId

	request(url, function (error, response, body) {
	  if (!error && response.statusCode == 200) {
	  	try{
	  		body = JSON.parse(body);
		    res.render('fichaPerson', {person: body.result, instanceName: instanceName})
	  	}catch(ex){
	  		res.send({'error': 'error parsing response'})
	  	}
	  }else{
	  	res.send({ 'error': 'error'})
	  }
	})

}

function organization(req, res){
	var instanceName = req.params.instanceName;
	var organizationId = req.params.organizationId;

	var url = "https://" + instanceName + "/api/v0.1/organizations/" + organizationId

	console.log(url);

	request(url, function (error, response, body) {
	  if (!error && response.statusCode == 200) {
	  	try{
	  		body = JSON.parse(body);
		    res.render('fichaOrganization', {organization: body.result})
	  	}catch(ex){
	  		res.send({'error': 'error parsing response'})
	  	}
	  }else{
	  	res.send({ 'error': 'error'})
	  }
	})

}

module.exports = {
	person: person, 
	organization: organization
}
