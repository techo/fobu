angular.module('fobu.directives.formElementRenderer', [
  'fobu.services.javascriptEvaluator'
])

.directive('formElementRenderer', function(javascriptEvaluator) {
  return {
    require: '?ngModel',
    scope: {
      ngModel: '='
    },
    template: function(element, attrs) {
      return '<div class="form-element form-element-{{ngModel.type}}" ng-class="ngModel.classes" ng-include="ngModel.templateUrl"></div>';
    },
    controller: function($scope, $element, $attrs) {
      $scope.select = function() {
        $scope.$emit('element.select');
      };

      $scope.check = function(value) {
        $scope.ngModel.value = $scope.ngModel.value || [];

        var index = $scope.ngModel.value.indexOf(value);
        if (index > -1) {
          $scope.ngModel.value.splice(index, 1);
        } else {
          $scope.ngModel.value.push(value);
        }
      };

      $scope.range = function(n) {
        return new Array(parseInt(n, 10));
      };

      $scope.$watch('ngModel.controller', function(controller) {
        if (controller) {
          controller($scope, $element, $attrs);
        }
      });

      javascriptEvaluator.evaluate($scope, $scope.ngModel);
    },
    link: function(scope, element, attrs) {
      scope.editable = 'editable' in attrs;
      scope.readonly = 'readonly' in attrs;
      attrs.$observe('readonly', function(readonly) {
        scope.readonly = readonly === '' || readonly;
      });
    }
  };
})

;
