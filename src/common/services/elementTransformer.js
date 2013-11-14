angular.module('services.elementTransformer', ['fobu.config'])

.factory('elementTransformer', function(config) {
  return {
    transform: function(element, parent) {
      element.parent = parent;

      if (! element.type) {
        return element;
      }

      var index = config.typeStringToIndex[element.type];
      var type  = config.types[index];

      element.templateUrl = type.templateUrl;

      if (! type.initialize) {
        return element;
      }
      type.initialize(element);

      return element;
    },

    transformRecursively: function(element, parent) {
      this.transform(element, parent);

      if (! element.elements) {
        return element;
      }
      for (var i = 0; i < element.elements.length; i++) {
        this.transformRecursively(element.elements[i], element);
      }

      return element;
    },

    reverseTransform: function(element) {
      delete element.parent;

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
