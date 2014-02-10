angular.module('fobu.resources.form', [
  'fobu.config',
  'ngResource',
  'fobu.services.elementTransformer'
])

.factory('Form', function($resource, $http, fobuConfig, elementTransformer) {
  var Form = $resource(fobuConfig.uri.form, { formId: '@formId', answersId: '@answersId' }, {
    save: {
      method: 'POST',
      transformRequest: [function(data, headers) {
        return elementTransformer.reverseTransformRecursively(data);
      }].concat($http.defaults.transformRequest)
    }
  });

  Form.prototype.fill = function(data, overwrite) {
    fill(this, data, overwrite || false);
  };

  function fill(element, data, overwrite) {
    if (overwrite) {
      element.value = data[element.name];
    } else {
      element.value = data[element.name] || element.value;
    }

    if ('elements' in element) {
      for (var i = 0; i < element.elements.length; i++) {
        fill(element.elements[i], data, overwrite);
      }
    }
  }

  return Form;
})

;
