define(function() {

  var closest = function (elem, selector) {
    var firstChar = selector.charAt(0);

    // Get closest match
    for ( ; elem && elem !== document; elem = elem.parentNode ) {

      // If selector is a class
      if ( firstChar === '.' ) {
        if ( elem.classList.contains( selector.substr(1) ) ) {
          return elem;
        }
      }

      // If selector is an ID
      if ( firstChar === '#' ) {
        if ( elem.id === selector.substr(1) ) {
          return elem;
        }
      }

      // If selector is a data attribute
      if ( firstChar === '[' ) {
        if ( elem.hasAttribute( selector.substr(1, selector.length - 2) ) ) {
          return elem;
        }
      }

      // If selector is a tag
      if ( elem.tagName.toLowerCase() === selector ) {
        return elem;
      }

    }

    return false;

  };

  var closestAttr = function(elem, attribute) {
    var closestEl = closest(elem, '[' + attribute + ']');

    if (closestEl) {
      return closestEl.getAttribute(attribute);
    }
  };

  return {
    closest: closest,
    closestAttr: closestAttr
  };

});
