angular.module('resources.form', ['ngResource'])

.factory('Form', function($resource) {
  var Form = $resource('http://localhost\\:3000/api/:formId', { formId: '@id' });

  return Form;
})

;
