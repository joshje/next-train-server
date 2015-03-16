var config = require('./config');
var soap = require('soap');
var ldbUrl = 'https://lite.realtime.nationalrail.co.uk/OpenLDBWS/wsdl.aspx?ver=2014-02-20';

module.exports = {
  init: function(callback) {
    soap.createClient(ldbUrl, function(err, client) {
      if (! client) return;

      client.addSoapHeader('<AccessToken><TokenValue>' + config.nationalrail.token + '</TokenValue></AccessToken>');

      callback(err, client);
    });
  }
};
