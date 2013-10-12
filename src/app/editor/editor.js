angular.module('ngBoilerplate.editor', [
  'ui.state',
  'directives.draggable',
  'directives.sortable'
])

.config(function config($stateProvider) {
  $stateProvider.state('editor', {
    url: '/editor',
    views: {
      'main': {
        controller: 'EditorCtrl',
        templateUrl: 'editor/editor.tpl.html'
      }
    },
    // TODO: esto de abajo no lo estoy usando
    data:{ pageTitle: 'Editor' }
  });
})

.controller('EditorCtrl', function EditorController($scope) {
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

  $scope.typeA = {
    type: 'text'
  };

  $scope.typeB = {
    type: 'select'
  };

  $scope.$on('draggable.start', function(e, ui, ngModel) {
    $scope.selectedType = ngModel.$modelValue.type;
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
          type: $scope.selectedType
        };
      }
    });
  });

  $scope.$on('form.element.select', function(e) {
    $scope.selection = e.targetScope.ngModel;
  });
})

.directive('appForm', function() {
  return {
    require: '?ngModel',
    scope: {
      ngModel: '='
    },
    templateUrl: 'editor/editor-form.tpl.html'
  };
})

.directive('appFormElement', function() {
  return {
    require: '?ngModel',
    scope: {
      ngModel: '='
    },
    template: '<div ng-include="\'editor/editor-form-element-\' + ngModel.type + \'.tpl.html\'"></div>',
    controller: function($scope, $element, $attrs) {
      $scope.select = function() {
        $scope.$emit('form.element.select');
      };
    }
  };
})

.directive('appProperties', function() {
  return {
    scope: {
      element: '=appProperties'
    }
  };
})

;
