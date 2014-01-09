angular.module('fobu.view', [
  'fobu.config',
  'ui.router',
  'resources.form',
  'services.elementTransformer',
  'directives.formElementRenderer'
])

.config(function($stateProvider) {
  $stateProvider.state('view', {
    url: '/:formId',
    views: {
      'main': {
        controller: 'ViewCtrl',
        templateUrl: 'view/view.tpl.html'
      }
    }
  });
})

.controller('ViewCtrl', function($scope, $stateParams, Form, config, elementTransformer) {
  $scope.form = Form.get({ formId: $stateParams.formId }, function() {
    $scope.form = elementTransformer.transformRecursively($scope.form, config);
  });
})

;
