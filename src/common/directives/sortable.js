angular.module('directives.sortable', ['ngAnimate'])

.directive('sortable', function($animate) {

  // For more information about the following monkey patch:
  //  - http://bugs.jqueryui.com/ticket/9727
  //  - https://github.com/angular/angular.js/issues/5619
  $.widget('ui.sortable', $.ui.sortable, {
    _mouseStart: function() {
      this._superApply(arguments);
      this.domPosition.prev = this.currentItem[0].previousSibling;
    }
  });

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
          if (! ('end' in ui.item.directive)) {
            ui.item.directive.end = ui.item.index();
            ui.item.directive.endSortable = ui.item.closest('.ui-sortable')[0];

            // We just need sortable to simulate drag & drop; we do care about
            // 'drag', but we simulate 'drop' by directly modifying the arrays
            // containing the elements and letting AngularJS rerender it.
            element.sortable('cancel');
          }

          // The offset is accounted for only after making sure we're in the
          // sortable that is being dropped on.
          if (ui.item.directive.endSortable === element[0]) {
            var offset = parseInt(attrs.offset, 10) || 0;
            ui.item.directive.end += offset;

            // Adjustments must be made when the item is moved across sortables.
            if (offset && ui.item.directive.start < offset) {
              --ui.item.directive.end;
            }
          }

          if (ui.item.is('.ui-draggable')) {
            scope.$emit('sortable.receiveDraggable', ui, ngModel, ui.item.directive.end);

          // If it has been dragged out of this sortable, we need not to update
          // it's position inside the array, but to simply remove it. The other
          // sortable will take care of adding it back.
          } else if (ui.item.directive.endSortable === element[0]) {
            scope.$apply(function() {
              var element = ui.item.directive.startModel.$modelValue.splice(ui.item.directive.start, 1)[0];
              ngModel.$modelValue.splice(ui.item.directive.end, 0, element);
            });

            scope.$emit('sortable.receive', ui, ngModel, ui.item.directive.end);
          }

          scope.$emit('sortable.update', ui, ngModel, ui.item.directive.end);
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
