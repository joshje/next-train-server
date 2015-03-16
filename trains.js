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
    var result = response.GetStationBoardResult;
    var services = result.trainServices && result.trainServices.service;

    callback({
      from: {
        name: result.locationName,
        code: result.crs
      },
      to: {
        name: result.filterLocationName,
        code: result.filtercrs
      },
      trains: _.map(services, function(service) {
        return {
          std: service.std,
          etd: service.etd,
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
