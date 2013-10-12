angular.module('directives.sortable', [])

.directive('sortable', function() {
  return {
    require: '?ngModel',
    link: function(scope, element, attrs, ngModel) {
      element.sortable({
        start: function(e, ui) {
          ui.item.sortable = { index: ui.item.index() };

          scope.$emit('sortable.start', ui, ngModel);
        },

        update: function(e, ui) {
          var start = ui.item.sortable.index;
          var end   = ui.item.index();

          ngModel.$modelValue.splice(end, 0, ngModel.$modelValue.splice(start, 1)[0]);

          scope.$emit('sortable.update', ui, ngModel);
        },

        receive: function(e, ui) {
          scope.$emit('sortable.receive', ui, ngModel);
        }
      });
    }
  };
})

;
