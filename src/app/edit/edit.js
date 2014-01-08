angular.module('fobu.edit', [
  'fobu.config',
  'ui.router',
  'resources.form',
  'services.elementTransformer',
  'directives.formElementRenderer',
  'directives.draggable',
  'directives.sortable',
  'directives.tab',
  'ngAnimate'
])

.config(function($stateProvider) {
  $stateProvider.state('edit', {
    url: '/:formId/edit',
    views: {
      'main': {
        controller: 'EditCtrl',
        templateUrl: 'edit/edit.tpl.html'
      }
    }
  }).state('new', {
    url: '/edit',
    views: {
      'main': {
        controller: 'EditCtrl',
        templateUrl: 'edit/edit.tpl.html'
      }
    }
  });
})

.controller('EditCtrl', function($scope, $stateParams, Form, config, elementTransformer) {
  $scope.config = config;

  if ($stateParams.formId) {
    $scope.form = Form.get({ formId: $stateParams.formId }, function() {
      $scope.form = elementTransformer.transformRecursively($scope.form, config);
    });
  } else {
    $scope.form = new Form({
      text: 'Untitled form',
      type: 'form',
      elements: [{
        text: 'Untitled fieldset',
        type: 'fieldset',
        elements: [{
          text: 'Untitled question',
          type: 'text'
        }, {
          type: 'column-break'
        }]
      }]
    });
    $scope.form = elementTransformer.transformRecursively($scope.form, config);
  }

  $scope.save = function() {
    $scope.form.$save(function() {
      $scope.form  = elementTransformer.transformRecursively($scope.form, config);
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

      select(element);
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

  $scope.$on('element.select', function(e) {
    select(e.targetScope.ngModel);
  });

  function select(element) {
    if ($scope.selection) {
      $scope.selection.classes.splice($scope.selection.classes.indexOf('selected'), 1);
    }

    $scope.selection = element;
    $scope.selection.classes.push('selected');
  }
})

.directive('properties', function() {
  return {
    scope: true,
    controller: function($scope, config) {
      $scope.remove = function() {
        var index = $scope.selection.parent().elements.indexOf($scope.selection);
        $scope.selection.parent().elements.splice(index, 1);
      };

      $scope.addElement = function(index) {
        $scope.selection.elements.splice(index + 1, 0, { text: '' });
      };

      $scope.removeElement = function(index) {
        $scope.selection.elements.splice(index, 1);
      };

      $scope.$watch('selection.type', function(type) {
        var index = config.typeStringToIndex[type];
        $scope.type = config.types[index];
      });
    }
  };
})

.directive('adaptHeight', function() {
  return function(scope, element, attrs) {
    scope.$watchCollection(attrs.adaptHeight, function() {
      element.children().css('minHeight', 'inherit');
      setTimeout(function() {
        element.children().css('minHeight', element.height());
      }, 0);
    });
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
      if (className === 'sort') {
        element.closest('.form-element').addClass('sorting');
        element.sortable('refreshPositions');
      }
      done();
    }
  };
})

;
