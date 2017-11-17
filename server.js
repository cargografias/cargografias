require('dotenv').load();
var express = require('express');
var http = require('http');
var compression = require('compression');
var swig = require('swig');
var fichasController = require('./controllers/fichas.js')
var embedController = require('./controllers/embed.js')
var aboutController = require('./controllers/about.js')
var homeController = require('./controllers/home.js')

var conn = require('./db.js');

swig.setDefaults({
    cache: false,
    locals: {
        config: {
            baseStaticPath: process.env.BASE_STATIC_PATH
        }
    }
});
var Q = require('q');

var instancesMap = null;
var allInstances = null;


var app = express();

app.engine('swig', swig.renderFile);
app.set('view engine', 'swig');
app.set('views', __dirname + "/views");

// all environments
app.set('port', process.env.PORT || 3000);
app.use(require('body-parser').urlencoded({
    extended: true,
    limit: '5mb'
}));
app.use(require('body-parser').json({
    limit: '5mb'
}));

app.get('/', homeController.index);

app.get('/about', aboutController.index);

app.use(express.static(__dirname + '/web'));

app.get('/:instanceName', instanceRouteHandler);

function instanceRouteHandler(req, res) {

    var instances = conn.getDb().collection('cargoinstances');
    instances.find({instanceName: req.params.instanceName}).toArray(function(err, instances) {
        if (err) {
            res.send('error');
            console.log(err);
        } else {
            if(instances.length > 0){
                res.render('index', instances[0])
            }else{
                res.status(404).render('instancenotfound');
            }
        }
    });

}

app.get('/d/:instanceName', function(req, res) {

    var instances = conn.getDb().collection('cargoinstances');
    instances.find({instanceName: req.params.instanceName}).toArray(function(err, instances) {
        if (err) {
            res.send('error');
            console.log(err);
        } else {
            if(instances.length > 0){
                res.send(instances[0])
            }else{
                res.status(404).render('instancenotfound');
            }
        }
    });

});


app.get('/:instanceName/person/:personId/:nameslug?', fichasController.person)
app.get('/:instanceName/organization/:organizationId/:nameslug?', fichasController.organization)

app.get('/:instanceName/embed/:id', embedController.index)
app.post('/createEmbedUrl', embedController.createEmbedUrl)
app.post('/createShortUrl', embedController.createShortUrl)

app.disable('etag');
var server = http.createServer(app);
server.listen(app.get('port'), function() {
    console.log('Express server listening on port ' + app.get('port'));
});
