angular.module('fobu.answers', [
  'fobu.config',
  'ui.state',
  'resources.form',
  'services.elementTransformer',
  'directives.formElementRenderer'
])

.config(function($stateProvider) {
  $stateProvider.state('answers', {
    url: '/:formId/:answersId',
    views: {
      'main': {
        controller: 'AnswersCtrl',
        templateUrl: 'answers/answers.tpl.html'
      }
    }
  });
})

.controller('AnswersCtrl', function($scope, $stateParams, Form, config, elementTransformer) {
  $scope.form = Form.get({ formId: $stateParams.formId, answersId: $stateParams.answersId }, function() {
    $scope.form = elementTransformer.transformRecursively($scope.form, config);
  });
})

;
