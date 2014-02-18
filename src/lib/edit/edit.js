angular.module('fobu.edit', [
  'fobu.config',
  'fobu.templates-app',
  'fobu.templates-common',
  'fobu.resources.form',
  'fobu.services.elementTransformer',
  'fobu.directives.formElementRenderer',
  'fobu.directives.draggable',
  'fobu.directives.sortable',
  'fobu.directives.tab',
  'fobu.directives.sanitization',
  'fobu.filters.inColumn',
  'ngAnimate'
])

.controller('FobuEditCtrl', function($scope, $state, $stateParams, $window, Form, fobuConfig, elementTransformer) {
  $scope.fobuConfig = fobuConfig;

  if ($stateParams.formId) {
    $scope.form = Form.get({ formId: $stateParams.formId }, function() {
      $scope.form = elementTransformer.transformRecursively($scope.form, fobuConfig);
    });
  } else {
    $scope.form = new Form($window.form || {
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
    $scope.form = elementTransformer.transformRecursively($scope.form, fobuConfig);
  }

  $scope.create = function() {
    $window.open($state.href('new'));
  };

  $scope.save = function() {
    $scope.form.$save(function() {
      $scope.form  = elementTransformer.transformRecursively($scope.form, fobuConfig);
      $state.go('edit', { formId: $scope.form.id });
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
      }, fobuConfig, e.targetScope.ngModel);
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

.controller('FobuEditCopyCtrl', function($scope, $state, $window, elementTransformer) {
  $scope.$watch('form.text', function() {
    $scope.text = 'Copy of ' + $scope.form.text;
  });

  $scope.copy = function() {
    var copiedForm = elementTransformer.reverseTransformRecursively(
      angular.copy($scope.form), ['id']
    );
    copiedForm.text = $scope.text;

    $window.open($state.href('new'))
      .form = copiedForm;
  };
})

.directive('properties', function() {
  return {
    scope: true,
    controller: function($scope, fobuConfig) {
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
        var index = fobuConfig.typeStringToIndex[type];
        $scope.type = fobuConfig.types[index];
      });
    }
  };
})

.directive('adaptHeight', function() {
  return function(scope, element, attrs) {
    scope.$watchCollection(attrs.adaptHeight, function() {
      element.children().css('minHeight', 'inherit');
      setTimeout(function() {
        var height = element.height();
        if (height < attrs.adaptHeightMin) {
          height = parseInt(attrs.adaptHeightMin, 10);
        }
        element.children().css('minHeight', height);
      }, 0);
    });
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
