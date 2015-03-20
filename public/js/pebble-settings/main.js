require.config({
    paths: {
      utils: './utils',
      text: '../lib/requirejs-hogan-plugin/text',
      hogan: '../lib/requirejs-hogan-plugin/hogan',
      hgn: '../lib/requirejs-hogan-plugin/hgn',
      eventEmitter: '../lib/eventEmitter/EventEmitter'
    }
});

require([
  'views/journeys',
  'views/journey',
  'utils/pebble'
], function(
  journeysView,
  journeyView,
  pebble
) {
  var config = pebble.getConfig();
  config.journeys = config.journeys || [];

  var contentEl = document.querySelector('[data-content]');

  journeysView.init({
    contentEl: contentEl
  });
  journeyView.init({
    contentEl: contentEl
  });

  journeysView.render({
    journeys: config.journeys
  });

  journeysView.on('add', function() {
    journeyView.renderNew();
  });

  journeysView.on('edit', function(data) {
    journeyView.renderEdit({
      journey: config.journeys[data.index],
      index: data.index
    });
  });

  journeysView.on('delete', function(data) {
    config.journeys.splice(data.index, 1);

    journeysView.render({
      journeys: config.journeys
    });
  });

  journeysView.on('save', function() {
    pebble.close({
      journeys: config.journeys
    });
  });

  journeyView.on('save', function(data) {
    if (data.index || data.index === 0) {
      config.journeys[data.index] = data.journey;
    } else {
      config.journeys.push(data.journey);
    }

    journeysView.render({
      journeys: config.journeys
    });
  });

  journeyView.on('cancel', function() {
    journeysView.render({
      journeys: config.journeys
    });
  });
});
