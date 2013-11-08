angular.module('fobu.home', [
  'fobu.config',
  'ui.state',
  'resources.form',
  'directives.draggable',
  'directives.sortable'
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

.controller('HomeCtrl', function($scope, config, Form) {
  $scope.config = config;

  $scope.form = Form.get({ formId: 1 }, function() {
    setupElementDefaultConfigRecursively($scope.form, config);
  });

  $scope.$on('draggable.start', function(e, ui, ngModel) {
    $scope.selectedType = ngModel.$modelValue;
  });

  $scope.$on('draggable.stop', function(e, ui, ngModel) {
    $scope.selectedType = undefined;
  });

  $scope.$on('sortable.receiveDraggable', function(e, ui, ngModel, position) {
    ui.item.remove();

    e.targetScope.$apply(function() {
      var element = setupElementDefaultConfig({
        text: 'Pregunta sin título',
        type: $scope.selectedType.type
      }, config);
      ngModel.$modelValue.splice(position, 0, element);
    });
  });

  $scope.$on('form.element.select', function(e) {
    $scope.selection = e.targetScope.ngModel;
  });

  function setupElementDefaultConfig(element, config) {
    if (! element.type) {
      return element;
    }

    var index = config.typeStringToIndex[element.type];
    var type  = config.types[index];

    element.templateUrl = type.templateUrl;
    if (! type.properties) {
      return element;
    }
    for (var i = 0; i < type.properties.length; i++) {
      element[type.properties[i].name] = type.properties[i].value;
    }

    return element;
  }

  function setupElementDefaultConfigRecursively(element, config) {
    setupElementDefaultConfig(element, config);

    if (! element.elements) {
      return element;
    }
    for (var i = 0; i < element.elements.length; i++) {
      setupElementDefaultConfigRecursively(element.elements[i], config);
    }

    return element;
  }
})

.directive('editableForm', function() {
  return {
    require: '?ngModel',
    scope: {
      ngModel: '='
    },
    templateUrl: 'home/types/form.tpl.html'
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
        $scope.$emit('form.element.select');
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

;
