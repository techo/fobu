angular.module('fobu.home', [
  'fobu.config',
  'ui.state',
  'resources.form',
  'services.elementTransformer',
  'directives.draggable',
  'directives.sortable',
  'ngAnimate'
])

.config(function($stateProvider) {
  $stateProvider.state('home', {
    url: '/',
    views: {
      'main': {
        controller: 'HomeCtrl',
        templateUrl: 'home/home.tpl.html'
      }
    }
  });
})

.controller('HomeCtrl', function($scope, Form, config, elementTransformer) {
  $scope.config = config;

  $scope.form = Form.get({ formId: 1 }, function() {
    $scope.form = elementTransformer.transformRecursively($scope.form, config);
  });

  $scope.save = function() {
    $scope.form.$save(function() {
      $scope.form = elementTransformer.transformRecursively($scope.form, config);
    });
  };

  $scope.$on('draggable.start', function(e, ui, ngModel) {
    $scope.selectedType = ngModel.$modelValue;
  });

  $scope.$on('draggable.stop', function(e, ui, ngModel) {
    $scope.selectedType = undefined;
  });

  $scope.$on('sortable.receiveDraggable', function(e, ui, ngModel, position) {
    ui.item.remove();

    // When an element is dropped on column A but after the column-break, we
    // arrange this so it is inserted before the column-break.
    for (var i = 0, count = 0; i < ngModel.$modelValue.length; i++) {
      if (ngModel.$modelValue[i].type !== 'column-break') {
        continue;
      }
      if (count++ !== e.targetScope.$index) {
        continue;
      }
      if (position > i) {
        position = i;
      }
      break;
    }

    e.targetScope.$apply(function() {
      var element = elementTransformer.transform({
        text: 'Untitled question',
        type: $scope.selectedType.type
      }, config, e.targetScope.ngModel);
      ngModel.$modelValue.splice(position, 0, element);
    });
  });

  $scope.$on('sortable.receive', function(e, ui, ngModel, position) {
    // Fix to allow an element to be dropped on an empty column.
    e.targetScope.$apply(function() {
      for (var i = 0, count = 0; i < ngModel.$modelValue.length; i++) {
        if (ngModel.$modelValue[i].type !== 'column-break') {
          continue;
        }
        if (count++ !== e.targetScope.$index) {
          continue;
        }
        if (i === 0 || ngModel.$modelValue[i - 1].type === 'column-break') {
          ngModel.$modelValue.splice(i, 0, ngModel.$modelValue.splice(position, 1)[0]);
        }
        break;
      }
    });
  });

  $scope.$on('formElement.select', function(e) {
    $scope.selection = e.targetScope.ngModel;
  });
})

.directive('editableForm', function() {
  return {
    require: '?ngModel',
    scope: {
      ngModel: '='
    },
    templateUrl: 'home/types/form.tpl.html',
    controller: function($scope, $element, $attrs) {
      $scope.stopSorting = function() {
        $element.removeClass('sorting');
      };
    }
  };
})

.directive('formElement', function() {
  return {
    require: '?ngModel',
    scope: {
      ngModel: '='
    },
    template: function(element, attrs) {
      return '<div ng-include="ngModel.templateUrl"></div>';
    },
    controller: function($scope, $element, $attrs) {
      $scope.select = function() {
        $scope.$emit('formElement.select');
      };

      // -- 8< -- TODO: Esto debe ser abstraído y mejorado --
      $scope.range = function(n) {
        return new Array(parseInt(n, 10));
      };
      // -- 8< ----------------------------------------------
    }
  };
})

.directive('propertiesOf', function() {
  return {
    scope: {
      element: '=propertiesOf'
    },
    controller: function($scope, config) {
      $scope.remove = function() {
        var index = $scope.element.parent.elements.indexOf($scope.element);
        $scope.element.parent.elements.splice(index, 1);
      };

      $scope.addElement = function(index) {
        $scope.element.elements.splice(index + 1, 0, { text: '' });
      };

      $scope.removeElement = function(index) {
        $scope.element.elements.splice(index, 1);
      };

      $scope.$watch('element.type', function(type) {
        var index = config.typeStringToIndex[type];
        $scope.type = config.types[index];
      });
    }
  };
})

.filter('inColumn', function() {
  return function(elements, column, comparator) {
    // Zero-index the column argument
    --column;

    var output = [];
    for (var i = 0, currentColumn = 0; i < elements.length; i++) {
      switch (comparator || '=') {
        case '=': if (currentColumn == column) { output.push(elements[i]); } break;
        case '<': if (currentColumn <  column) { output.push(elements[i]); } break;
        case '>': if (currentColumn >  column) { output.push(elements[i]); } break;
      }
      if (elements[i].type == 'column-break') {
        ++currentColumn;
      }
    }

    return output;
  };
})

.animation('.ui-sortable', function() {
  return {
    addClass: function(element, className, done) {
      if (className === 'drag') {
        element.parent().addClass('sorting');
        element.sortable('refreshPositions');
      }
      done();
    }
  };
})

;
