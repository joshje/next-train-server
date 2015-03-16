var express = require('express');
var handlebars = require('express-handlebars');
var config = require('./config');
var ldb = require('./ldb');
var stations = require('./stations');
var trains = require('./trains');
var pebble = require('./pebble');

var stations;

var app = express();

app.engine('handlebars', handlebars({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');

ldb.init(function(err, client) {
  if (err) {
    console.log('Failed to initialize ldb');
    return;
  }

  trains.init({
    client: client
  });
});

app.get('/pebble/settings', pebble.settingsRoute);

app.get('/api/stations', stations.getStationsRoute);
app.get('/api/trains', trains.getTrainsRoute);
app.use(express.static(__dirname + '/public'));

var server = app.listen(config.port);
console.log('Server is listening on port %d', server.address().port);
