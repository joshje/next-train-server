define(function() {

  var fetch = function(callback) {
    var ajax = new XMLHttpRequest();
    ajax.onload = function() {
      var stations = JSON.parse(this.responseText);
      callback({
        stations: stations
      });
    };
    ajax.open('get', '/api/stations', true);
    ajax.send();
  };

  return {
    fetch: fetch
  };

});
