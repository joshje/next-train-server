var _ = require('lodash');
var client;

var transformServices = function(services) {
  return _.chain(services)
  .map(function(service) {
    var departureTime = (service.etd == 'On time') ? service.std : service.etd;
    var departureParts = departureTime.split(':');

    var departureDate = new Date();
    departureDate = departureDate.setHours(departureParts[0], departureParts[1], 0, 0);
    departureDate = departureDate;

    return {
      time: departureTime,
      date: departureDate,
      platform: service.platform,
      serviceID: service.serviceID
    };
  })
  .filter(function(service) {
    return service.date > Date.now();
  })
  .slice(0, 3)
  .value();
};

var getTrains = function(opts, callback) {
  if (! client) {
    return callback({
      error: 'Server initializing'
    });
  }

  client.GetDepartureBoard({
    numRows: 6,
    crs: opts.from,
    filterCrs: opts.to,
    filterType: 'to'
  }, function(err, response) {
    if (err) {
      return callback(err);
    }

    var result = response.GetStationBoardResult;
    var services = result.trainServices && result.trainServices.service;

    callback(null, {
      from: {
        name: result.locationName,
        code: result.crs
      },
      to: {
        name: result.filterLocationName,
        code: result.filtercrs
      },
      trains: transformServices(services)
    });
  });
};

module.exports = {
  init: function(opts) {
    client = opts.client;
  },
  getTrains: getTrains,
  getTrainsRoute: function(req, res){
    getTrains({
      from: req.query.from,
      to: req.query.to
    }, function(error, result) {
      if (error) {
        res.status(500);
        return res.json(error);
      }

      res.json(result);
    });
  }
};
