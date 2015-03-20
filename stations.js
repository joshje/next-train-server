var request = require('request');
var csvParse = require('csv-parse');

var stationsUrl = 'http://www.nationalrail.co.uk/static/documents/content/station_codes.csv';

var stations;
var lastFetched;

var ONE_HOUR = 60 * 60 * 1000;

var getStations = function(callback) {
  if (stations && lastFetched + ONE_HOUR > Date.now()) {
    return callback(null, stations);
  }

  request(stationsUrl, function (error, xhr, body) {
    if (error) {
      return callback(error);
    }

    csvParse(body, {
      columns: function() { return ['text', 'code']; }
    }, function(err, data){
      lastFetched = Date.now();
      stations = data;

      callback(null, data);
    });
  });
};

module.exports = {
  getStationsRoute: function(req, res) {
    getStations(function(error, result) {
      if (error) {
        res.status(500);
        return res.json(error);
      }

      res.json(result);
    });
  },
  getStations: getStations
};
