angular.module('fobu.view', [
  'fobu.config',
  'fobu.templates-app',
  'fobu.templates-common',
  'fobu.resources.form',
  'fobu.services.elementTransformer',
  'fobu.directives.formElementRenderer',
  'fobu.filters.inColumn'
])

.controller('FobuViewCtrl', function($scope, $stateParams, Form, fobuConfig, elementTransformer) {
  if (! $stateParams.formId) {
    return;
  }

  $scope.form = Form.get({ formId: $stateParams.formId }, function() {
    $scope.form = elementTransformer.transformRecursively($scope.form, fobuConfig);
  });

  if ($stateParams.nestedFormId) {
    $scope.form.$promise.then(function() {
      var nestedFormElement = findElementById($scope.form.elements, $stateParams.nestedFormId);
      if (nestedFormElement) {
        $scope.form = Form.get({ formId: nestedFormElement.formId }, function() {
          $scope.form = elementTransformer.transformRecursively($scope.form, fobuConfig);
          $scope.form.nestedName = nestedFormElement.name;

          fobuConfig.getDataProvider().apply(this, [$scope.form, $stateParams]);
        });
      }
    });
  } else {
    $scope.form.$promise.then(function() {
      fobuConfig.getDataProvider().apply(this, [$scope.form, $stateParams]);
    });
  }

  function findElementById(elements, id) {
    for (var i = 0; i < elements.length; i++) {
      if (elements[i].id == id) {
        return elements[i];
      }
    }
  }
})

;
