angular.module('resources.form', [
  'fobu.config',
  'ngResource',
  'services.elementTransformer'
])

.factory('Form', function($resource, $http, config, elementTransformer) {
  return $resource(config.uri.form, { formId: '@formId', answersId: '@answersId' }, {
    save: {
      method: 'POST',
      transformRequest: [function(data, headers) {
        return elementTransformer.reverseTransformRecursively(data);
      }].concat($http.defaults.transformRequest)
    }
  });
})

;
