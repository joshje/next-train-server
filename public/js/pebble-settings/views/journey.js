define([
  'eventEmitter',
  'data/stations',
  'hgn!templates/journey',
  'hgn!templates/station-list'
], function(
  EventEmitter,
  stationsData,
  journeyTemplate,
  stationListTemplate
) {
  var journey = new EventEmitter();
  var stations = [];
  var stationsByCode = {};
  var contentEl;
  var journeyData;
  var journeyIndex;

  var journeyPart = function(el) {
    while ((el = el.parentElement) && !el.classList.contains('journey-part'));
    return el;
  };

  var filterStations = function(el, term) {
    var partType = el.getAttribute('data-journey-part');
    var excludeCode;
    if (partType == 'from') {
      excludeCode = journeyData.to && journeyData.to.code;
    } else if (partType == 'to') {
      excludeCode = journeyData.from && journeyData.from.code;
    }

    var filteredStations;
    term = term.toLowerCase();

    filteredStations = stations.filter(function(station) {
      if (excludeCode && station.code == excludeCode) {
        return false;
      }

      if (!term) return true;

      var text = station.text.toLowerCase();
      if (text.indexOf(term) !== -1) return true;
      var code = station.code.toLowerCase();
      if (code.indexOf(term) !== -1) return true;
    });

    el.querySelector('.journey-part-stations').innerHTML = stationListTemplate({
      stations: filteredStations
    });
  };

  journey.init = function(data) {
    contentEl = data.contentEl;

    stationsData.fetch(function(data) {
      stations = data.stations;

      for (var i = stations.length - 1; i >= 0; i--) {
        stationsByCode[stations[i].code] = stations[i];
      }
    });

    contentEl.addEventListener('focus', function(e) {
      var target = e.target;
      var journeyInput = target.classList.contains('journey-part-input');

      if (journeyInput) {
        filterStations(journeyPart(target), '');
      }
    }, true);

    contentEl.addEventListener('keyup', function(e) {
      var target = e.target;
      var journeyInput = target.classList.contains('journey-part-input');

      if (journeyInput) {
        filterStations(journeyPart(target), e.target.value);
      }
    }, true);

    contentEl.addEventListener('click', function(e) {
      var target = e.target;
      var action = target.getAttribute('data-journey-action');

      if (! action) return;
      e.preventDefault();

      if (action == 'save') {
        journey.emit('save', {
          journey: journeyData,
          index: journeyIndex
        });
      } else if (action == 'cancel') {
        journey.emit('cancel');
      } else if (action == 'station') {
        var stationCode = target.getAttribute('data-station');
        var el = journeyPart(e.target);
        var journeyKey = el.getAttribute('data-journey-part');
        var station = stationsByCode[stationCode];
        journeyData[journeyKey] = station;
        el.querySelector('.journey-part-input').value = station.text;
        el.querySelector('.journey-part-stations').innerHTML = '';
        if (journeyData.from && journeyData.to) {
          contentEl.querySelector('.journey').classList.add('can-save');
        }
      }
    }, true);
  };

  journey.render = function(data) {
    contentEl.innerHTML = journeyTemplate(data);
  };

  journey.renderNew = function() {
    journeyData = {};
    journeyIndex = null;

    journey.render({
      title: 'Add Journey'
    });
  };

  journey.renderEdit = function(data) {
    journeyData = data.journey;
    journeyIndex = data.index;

    journey.render({
      title: 'Edit Journey',
      journey: journeyData,
      isEdit: true
    });
  };

  return journey;
});
