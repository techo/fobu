angular.module('fobu.view', [
  'fobu.config',
  'ui.state',
  'resources.form',
  'services.elementTransformer',
  'directives.formElementRenderer'
])

.config(function($stateProvider) {
  $stateProvider.state('view', {
    url: '/view',
    views: {
      'main': {
        controller: 'ViewCtrl',
        templateUrl: 'view/view.tpl.html'
      }
    }
  });
})

.controller('ViewCtrl', function($scope, Form, config, elementTransformer) {
  $scope.form = Form.get({ formId: 1 }, function() {
    $scope.form = elementTransformer.transformRecursively($scope.form, config);
  });
})

;
