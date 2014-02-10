angular.module('fobu.view', [
  'fobu.config',
  'fobu.templates-app',
  'fobu.templates-common',
  'fobu.view.search',
  'fobu.resources.form',
  'fobu.services.elementTransformer',
  'fobu.directives.formElementRenderer',
  'fobu.directives.sanitization',
  'fobu.filters.inColumn'
])

.controller('FobuViewCtrl', function($scope, $stateParams, Form, fobuConfig, elementTransformer) {
  if (! $stateParams.formId) {
    return;
  }

  loadForm($stateParams, fobuConfig, function(form) {
    $scope.form = form;
  });

  $scope.$on('$stateChangeStart', function(e, toState, toParams) {
    toParams.form = $scope.form;
  });

  function loadForm($stateParams, fobuConfig, callbackFn) {
    if ($stateParams.form) {
      return callbackFn($stateParams.form);
    }

    var form = Form.get({ formId: $stateParams.formId }, function() {
      form = elementTransformer.transformRecursively(form, fobuConfig);
    });

    if ($stateParams.nestedFormId) {
      form.$promise.then(function() {
        var nestedFormElement = findElementById(form.elements, $stateParams.nestedFormId);
        if (nestedFormElement) {
          form = Form.get({ formId: nestedFormElement.formId }, function() {
            form = elementTransformer.transformRecursively(form, fobuConfig);
            form.nestedName = nestedFormElement.name;

            callbackFn(form);
            fobuConfig.getDataProvider().apply(this, [form, $stateParams]);
          });
        }
      });
    } else {
      form.$promise.then(function() {
        callbackFn(form);
        fobuConfig.getDataProvider().apply(this, [form, $stateParams]);
      });
    }
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
