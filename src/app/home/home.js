angular.module('fobu.home', [
  'ui.state',
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

.controller('HomeCtrl', function($scope) {
  $scope.form = {
    text: 'Hello world 2!',
    elements: [{
      text: 'Módulo #1',
      type: 'fieldset',
      elements: [{
        text: 'Pregunta A',
        type: 'text',
        help: 'Texto de ayuda'
      }, {
        text: 'Pregunta B',
        type: 'select',
        elements: [{
          text: 'Option I'
        }, {
          text: 'Option II'
        }, {
          text: 'Option III'
        }]
      }, {
        text: 'Pregunta C',
        type: 'date'
      }]
    }, {
      text: 'Módulo #2',
      type: 'fieldset',
      elements: []
    }, {
      text: 'Módulo #3',
      type: 'fieldset',
      elements: []
    }]
  };

  $scope.types = [{
    text: 'Text',
    icon: 'glyphicon-bold',
    type: 'text',
    templateUrl: 'home/types/input.tpl.html'
  }, {
    text: 'Date',
    icon: 'glyphicon-calendar',
    type: 'date',
    templateUrl: 'home/types/input.tpl.html'
  }, {
    text: 'Number',
    icon: 'glyphicon-bold',
    type: 'number',
    templateUrl: 'home/types/input.tpl.html'
  }, {
    text: 'Dropdown',
    icon: 'glyphicon-list',
    type: 'select',
    templateUrl: 'home/types/select.tpl.html'
  }, {
    text: 'Fieldset',
    icon: 'glyphicon-credit-card',
    type: 'fieldset',
    templateUrl: 'home/types/fieldset.tpl.html'
  }];

  // -- 8< -- TODO: Esto debe ser abstraído y mejorado --
  var typeToIndex = {
    text: 0,
    date: 1,
    number: 2,
    select: 3,
    fieldset: 4
  };
  var fixForm = function(element) {
    if (! element.elements) { return; }
    for (var i = 0; i < element.elements.length; i++) {
      var el = element.elements[i];
      if (! el.type) { continue; }
      var index = typeToIndex[el.type];
      el.templateUrl = $scope.types[index].templateUrl;
      fixForm(el);
    }
  };
  fixForm($scope.form);
  // -- 8< ----------------------------------------------

  $scope.$on('draggable.start', function(e, ui, ngModel) {
    $scope.selectedType = ngModel.$modelValue;
  });

  $scope.$on('draggable.stop', function(e, ui, ngModel) {
    $scope.selectedType = undefined;
  });

  $scope.$on('sortable.update', function(e, ui, ngModel) {
    ui.item.remove();

    e.targetScope.$apply(function() {
      for (var i = 0; i < ngModel.$modelValue.length; i++) {
        if (ngModel.$modelValue[i] !== undefined) {
          continue;
        }
        ngModel.$modelValue[i] = {
          text: 'Pregunta sin título',
          type: $scope.selectedType.type,
          templateUrl: $scope.selectedType.templateUrl
        };
      }
    });
  });

  $scope.$on('form.element.select', function(e) {
    $scope.selection = e.targetScope.ngModel;
  });
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
    }
  };
})

.directive('propertiesOf', function() {
  return {
    scope: {
      element: '=propertiesOf'
    }
  };
})

;
