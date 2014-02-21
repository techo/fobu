angular.module('fobu.services.javascriptEvaluator', [])

.factory('javascriptEvaluator', function() {
  return {
    evaluate: function($scope, element) {
      if (! element) {
        return;
      }

      element.emit = function(name, args) {
        $scope.$emit.apply($scope, arguments);
      };

      element.set = function(value) {
        element.value = value;
      };

      element.enable = function(enable) {
        enable = enable === undefined ? true : enable;
        element.disabled = ! enable;
      };

      element.show = function(show) {
        show = show === undefined ? true : show;
        element.hidden = ! show;
      };

      /* jshint -W061 */
      eval(element.javascript);

      function find(name) {
        return findElementByName(findRootElement(element), name);
      }

      function on(name, listener) {
        $scope.$on(name, listener);
      }

      function watch(listener) {
        $scope.$watch('ngModel.value', listener);
      }
    }
  };

  function findRootElement(element) {
    if (! element) {
      return;
    }

    if (! element.parent()) {
      return element;
    }

    return findRootElement(element.parent());
  }

  function findElementByName(element, name) {
    if (! element) {
      return;
    }

    if (element.name === name) {
      return element;
    }

    var elements = element.elements || [];
    for (var i = 0; i < elements.length; i++) {
      element = findElementByName(elements[i], name);
      if (element) {
        return element;
      }
    }
  }
});
