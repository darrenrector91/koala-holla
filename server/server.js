var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var port = process.env.PORT || 5000;

const koalasRoute = require('./routes/koalas.route');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static('server/public'));

app.use('/koalas', koalasRoute);


// Start listening for requests on a specific port
app.listen(port, function(){
  console.log('listening on port', port);
});
