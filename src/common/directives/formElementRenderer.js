angular.module('directives.formElementRenderer', [])

.directive('formElementRenderer', function() {
  return {
    require: '?ngModel',
    scope: {
      ngModel: '='
    },
    template: function(element, attrs) {
      return '<div class="form-element-{{ngModel.type}}" ng-include="ngModel.templateUrl"></div>';
    },
    controller: function($scope, $element, $attrs) {
      $scope.select = function() {
        $scope.$emit('element.select');
      };

      $scope.range = function(n) {
        return new Array(parseInt(n, 10));
      };

      $scope.$watch('ngModel.controller', function(controller) {
        if (controller) {
          controller($scope, $element, $attrs);
        }
      });
    },
    link: function(scope, element, attrs) {
      scope.editable = 'editable' in attrs;
    }
  };
})

;
