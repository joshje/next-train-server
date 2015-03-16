define(function() {

  var getConfig = function() {
    var parts = location.hash.split('#');
    var config = parts[parts.length - 1];

    if (! config) {
      return {};
    }
    var options = JSON.parse(decodeURIComponent(config));
    return options;
  };

  var getReturnUrl = function() {
    var query = location.hash.substring(location.hash.indexOf('?') + 1);
    var vars = query.split('&');
    for (var i = 0; i < vars.length; i++) {
      var pair = vars[i].split('=');
      if (pair[0] == 'return_to') {
        return decodeURIComponent(pair[1].split('#')[0]);
      }
    }
    return 'pebblejs://close#';
  };

  var encodeOptions = function(options) {
    return encodeURIComponent(JSON.stringify(options));
  };

  var close = function(options) {
    var closeUrl = getReturnUrl() + encodeOptions(options);
    console.log('close', closeUrl);
    document.location = closeUrl;
  };

  return {
    getConfig: getConfig,
    close: close
  };

});
