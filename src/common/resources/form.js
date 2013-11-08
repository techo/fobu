angular.module('resources.form', [
  'ngResource',
  'services.elementTransformer'
])

.factory('Form', function($resource, $http, elementTransformer) {
  return $resource('http://localhost\\:3000/api/:formId', { formId: '@id' }, {
    save: {
      method: 'POST',
      transformRequest: [function(data, headers) {
        return elementTransformer.reverseTransformRecursively(data);
      }].concat($http.defaults.transformRequest)
    }
  });
})

;
