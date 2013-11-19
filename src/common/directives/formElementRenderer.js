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
        $scope.$emit('formElementRenderer.select');
      };

      $scope.range = function(n) {
        return new Array(parseInt(n, 10));
      };
    },
    link: function(scope, element, attrs) {
      scope.editable = 'editable' in attrs;
    }
  };
})

;
