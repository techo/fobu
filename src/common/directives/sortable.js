angular.module('directives.sortable', ['ngAnimate'])

.directive('sortable', function($animate) {
  return {
    require: '?ngModel',
    link: function(scope, element, attrs, ngModel) {
      var options = {
        items: '> *:not(.sortable-not)',
        handle: attrs.handle || false,

        start: function(e, ui) {
          if (ui.item.is('.ui-draggable')) {
            $animate.addClass(element, 'drag');
          } else {
            $animate.addClass(element, 'sort');
          }

          var offset = parseInt(attrs.offset, 10) || 0;

          ui.item.directive = {
            start: ui.item.index() + offset,
            startModel: ngModel
          };

          scope.$emit('sortable.start', ui, ngModel);
        },

        stop: function(e, ui) {
          if (ui.item.is('.ui-draggable')) {
            $animate.removeClass(element, 'drag');
          } else {
            $animate.removeClass(element, 'sort');
          }

          scope.$emit('sortable.stop', ui, ngModel);
        },

        update: function(e, ui) {
          var offset = parseInt(attrs.offset, 10) || 0;

          var start = ui.item.directive.start;
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
              var element = ui.item.directive.startModel.$modelValue.splice(start, 1)[0];
              ngModel.$modelValue.splice(end, 0, element);
            });

            scope.$emit('sortable.receive', ui, ngModel, end);
          }

          scope.$emit('sortable.update', ui, ngModel, end);
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
