angular.module('fobu.services.elementTransformer', [])

.factory('elementTransformer', function() {
  return {
    transform: function(element, config, parent) {
      // To avoid $watch() and other AngularJS functions to fail because of the
      // circular dependency created between parent<->child, we define parent
      // as a function.
      element.parent = function() {
        return parent;
      };

      if (! element.type) {
        return element;
      }

      var index = config.typeStringToIndex[element.type];
      if (index === undefined) {
        return element;
      }

      var type = config.types[index];

      element.classes = type.classes ? type.classes.split(' ') : [];
      element.controller  = element.controller || type.controller;
      element.templateUrl = element.templateUrl || type.templateUrl;
      if (typeof element.templateUrl === 'object') {
        element.templateUrl = element.templateUrl['default'];
      }

      if (! type.initialize) {
        return element;
      }
      type.initialize(element);

      return element;
    },

    transformRecursively: function(element, config, parent) {
      this.transform(element, config, parent);

      if (! element.elements) {
        return element;
      }
      for (var i = 0; i < element.elements.length; i++) {
        this.transformRecursively(element.elements[i], config, element);
      }

      return element;
    },

    reverseTransform: function(element) {
      return element;
    },

    reverseTransformRecursively: function(element) {
      this.reverseTransform(element);

      if (! element.elements) {
        return element;
      }
      for (var i = 0; i < element.elements.length; i++) {
        this.reverseTransformRecursively(element.elements[i]);
      }

      return element;
    }

  };
})

;
