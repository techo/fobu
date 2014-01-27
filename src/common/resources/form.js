angular.module('fobu.resources.form', [
  'fobu.config',
  'ngResource',
  'fobu.services.elementTransformer'
])

.factory('Form', function($resource, $http, fobuConfig, elementTransformer) {
  return $resource(fobuConfig.uri.form, { formId: '@formId', answersId: '@answersId' }, {
    save: {
      method: 'POST',
      transformRequest: [function(data, headers) {
        return elementTransformer.reverseTransformRecursively(data);
      }].concat($http.defaults.transformRequest)
    }
  });
})

;
