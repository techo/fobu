angular.module('fobu.view', [
  'fobu.config',
  'fobu.templates-app',
  'fobu.templates-common',
  'fobu.resources.form',
  'fobu.services.elementTransformer',
  'fobu.directives.formElementRenderer',
  'fobu.filters.inColumn'
])

.controller('FobuViewCtrl', function($scope, $stateParams, Form, config, elementTransformer) {
  var formId = $stateParams.formId;
  if ($stateParams.nestedFormId) {
    formId = $stateParams.nestedFormId;
  }

  $scope.form = Form.get({ formId: formId }, function() {
    $scope.form = elementTransformer.transformRecursively($scope.form, config);
  });
})

;
