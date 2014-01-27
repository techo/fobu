angular.module('fobu.view', [
  'fobu.config',
  'fobu.templates-app',
  'fobu.templates-common',
  'fobu.resources.form',
  'fobu.services.elementTransformer',
  'fobu.services.elementFiller',
  'fobu.directives.formElementRenderer',
  'fobu.filters.inColumn'
])

.controller('FobuViewCtrl', function($scope, $stateParams, Form, fobuConfig, elementTransformer, elementFiller) {
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
          elementFiller.fill($scope.form, fobuConfig.getDataProvider(), [nestedFormElement, $stateParams.row]);
        });
      }
    });
  } else {
    $scope.form.$promise.then(function() {
      elementFiller.fill($scope.form, fobuConfig.getDataProvider());
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
