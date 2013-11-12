angular.module('resources.form', [
  'ngResource',
  'services.elementTransformer'
])

.factory('Form', function($resource, $http, elementTransformer) {
//  return $resource('http://localhost\\:3000/api/:formId', { formId: '@id' }, {
  return $resource('http://localhost/pilote/encuesta/:formId?_format=json', { formId: '@id' }, {
    save: {
      method: 'POST',
      transformRequest: [function(data, headers) {
        return elementTransformer.reverseTransformRecursively(data);
      }].concat($http.defaults.transformRequest)
    }
  });
})

;
