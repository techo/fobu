angular.module('fobu.directives.tab', [])

.directive('tab', function() {
  return {
    link: function(scope, element, attrs) {
      element.click(function(e) {
        e.preventDefault();
        $(this).tab('show');
      });
    }
  };
})

;
