angular.module('fobu.directives.draggable', [])

.directive('draggable', function() {
  return {
    require: '?ngModel',
    link: function(scope, element, attrs, ngModel) {
      var options = {
        start: function(e, ui) {
          scope.$emit('draggable.start', ui, ngModel);
        },

        stop: function(e, ui) {
          scope.$emit('draggable.stop', ui, ngModel);
        }
      };

      if (attrs.connectTo) {
        $.extend(options, {
          helper: 'clone',
          appendTo: 'body',
          connectToSortable: attrs.connectTo
        });
      }

      element.draggable(options);
    }
  };
})

;
