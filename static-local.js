var express = require('express');
var app = express();
var port = process.env.PORT || 3002
app.use(function(req,res,next){ res.header('Access-Control-Allow-Origin','*'); next(); });
var p = __dirname +'/static-public';
app.use(express.static(p));
app.listen(port);
console.log("Listening on port", port);
