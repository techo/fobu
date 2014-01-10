angular.module('fobu.view', [
  'fobu.config',
  'fobu.templates-app',
  'fobu.templates-common',
  'fobu.resources.form',
  'fobu.services.elementTransformer',
  'fobu.directives.formElementRenderer'
])

.controller('FobuViewCtrl', function($scope, $stateParams, Form, config, elementTransformer) {
  $scope.form = Form.get({ formId: $stateParams.formId }, function() {
    $scope.form = elementTransformer.transformRecursively($scope.form, config);
  });
})

;
