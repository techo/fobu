angular.module('fobu.directives.sanitization', [])

.directive('input', function() {
  return {
    restrict: 'E',
    require: 'ngModel',
    link: function(scope, element, attrs, ngModel) {
      ngModel.$formatters.push(function(value) {
        if (value === '' && ngModel.$modelValue !== '') {
          switch(attrs.type) {
            case 'number':
              value = parseInt(ngModel.$modelValue, 10);
              break;
          }
        }

        return value;
      });
    }
  };
})

;
