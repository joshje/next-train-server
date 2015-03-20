module.exports = {
  settingsRoute: function(req, res) {
    res.render('pebble-settings', {
      title: 'Next Train Settings',
      stylesheets: [{
        href: '/css/pebble-settings.css'
      }]
    });
  }
};
