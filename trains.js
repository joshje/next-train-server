var _ = require('lodash');
var client;

var getTrains = function(opts, callback) {
  if (! client) {
    return callback({
      error: 'Server initializing'
    });
  }
  console.log('Getting trains from %s to %s', opts.from, opts.to);

  client.GetDepartureBoard({
    numRows: 3,
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
      trains: _.map(services, function(service) {
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
