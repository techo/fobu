angular.module('fobu.services.elementFiller', [])

.factory('elementFiller', function() {
  function fillWithData(element, data) {
    element.value = data[element.name];

    if ('elements' in element) {
      for (var i = 0; i < element.elements.length; i++) {
        fillWithData(element.elements[i], data);
      }
    }
  }

  return {
    fill: function(element, dataProviderFn, args) {
      args = args || [];
      args.unshift(element);
      fillWithData(element, dataProviderFn.apply(this, args));
    }
  };
});
