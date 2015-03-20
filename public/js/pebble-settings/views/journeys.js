define([
  'eventEmitter',
  'hgn!templates/journeys',
  'utils/utils'
], function(
  EventEmitter,
  journeysTemplate,
  utils
) {
  var journeys = new EventEmitter();
  var contentEl;

  journeys.init = function(data) {
    contentEl = data.contentEl;

    contentEl.addEventListener('click', function(e) {
      var target = e.target;
      var action = utils.closestAttr(target, 'data-journeys-action');

      if (! action) return;

      e.preventDefault();
      var index;

      if (action == 'add') {
        journeys.emit('add');
      } else if (action == 'edit') {
        index = parseInt(target.getAttribute('data-index'), 10);

        journeys.emit('edit', {
          index: index
        });
      } else if (action == 'delete') {
        index = parseInt(target.getAttribute('data-index'), 10);

        journeys.emit('delete', {
          index: index
        });
      } else if (action == 'save') {
        journeys.emit('save');
      }
    }, true);
  };

  journeys.render = function(data) {
    var templJourneys = data.journeys.map(function(journey, index) {
      return {
        from: journey.from,
        to: journey.to,
        index: index
      };
    });

    contentEl.innerHTML = journeysTemplate({
      journeys: templJourneys
    });
  };



  return journeys;
});
