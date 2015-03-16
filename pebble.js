module.exports = {
  settingsRoute: function(req, res) {
    console.log(req);
    res.render('pebble-settings', {
      title: 'Next Train Settings',
      stylesheets: [{
        href: '/css/pebble-settings.css'
      }]
    });
  }
};
