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

  var form = Form.get({ formId: $stateParams.formId }, function() {
    form = elementTransformer.transformRecursively(form, fobuConfig);
  });

  if ($stateParams.nestedFormId) {
    form.$promise.then(function() {
      var nestedFormElement = findElementById(form.elements, $stateParams.nestedFormId);
      if (nestedFormElement) {
        $scope.form = Form.get({ formId: nestedFormElement.formId }, function() {
          $scope.form = elementTransformer.transformRecursively($scope.form, fobuConfig);
        });
      }
    });
  } else {
    form.$promise.then(function() {
      $scope.form = form;
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
