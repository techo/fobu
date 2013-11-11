angular.module('directives.sortable', [])

.directive('sortable', function() {
  return {
    require: '?ngModel',
    link: function(scope, element, attrs, ngModel) {
      var options = {
        start: function(e, ui) {
          var offset = parseInt(attrs.offset, 10) || 0;

          ui.item.sortable = { index: ui.item.index() + offset };

          scope.$emit('sortable.start', ui, ngModel);
        },

        update: function(e, ui) {
          var offset = parseInt(attrs.offset, 10) || 0;

          var start = ui.item.sortable.index;
          var end   = ui.item.index() + offset;

          // Adjustments must be made when the item is moved across sortables.
          if (offset && start < offset) {
            --end;
          }

          if (ui.item.is('.ui-draggable')) {
            scope.$emit('sortable.receiveDraggable', ui, ngModel, end);

          // If it has been dragged out of this sortable, we need not to update
          // it's position inside the array, but to simply remove it. The other
          // sortable will take care of adding it back.
          } else if (ui.item.closest('.ui-sortable')[0] === element[0]) {
            scope.$apply(function() {
              ngModel.$modelValue.splice(end, 0, ngModel.$modelValue.splice(start, 1)[0]);
            });
          }

          scope.$emit('sortable.update', ui, ngModel);
        },

        receive: function(e, ui) {
          scope.$emit('sortable.receive', ui, ngModel);
        }
      };

      if (attrs.connectTo) {
        $.extend(options, {
          helper: 'clone',
          appendTo: 'body',
          connectWith: attrs.connectTo
        });
      }

      element.sortable(options);
    }
  };
})

;
