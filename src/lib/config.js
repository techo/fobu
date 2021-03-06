angular.module('fobu.config', ['fobu.services.elementTransformer'])

.provider('fobuConfig', function() {
  this.initializeDefaultStates = function($stateProvider, states) {
    states = states || [];
    if (inArray(states, 'edit')) {
      $stateProvider.state('edit', {
        url: '/{formId}/edit',
        views: {
          'main': {
            controller: 'FobuEditCtrl',
            templateUrl: 'fobu/edit/edit.tpl.html'
          }
        }
      }).state('new', {
        url: '/edit',
        views: {
          'main': {
            controller: 'FobuEditCtrl',
            templateUrl: 'fobu/edit/edit.tpl.html'
          }
        }
      });
    }

    if (inArray(states, 'view')) {
      var onEnterGlobal = ['$state', function($state) {
        $state.$previous = $state.$current;
      }];

      $stateProvider.state('view', {
        abstract: true,
        views: {
          'main': {
            controller: 'FobuViewCtrl',
            template: '<ui-view />'
          }
        }
      }).state('view.main', {
        url: '/{formId}',
        controller: 'FobuViewCtrl',
        templateUrl: 'fobu/view/view.tpl.html',
        onEnter: onEnterGlobal
      }).state('view.search', {
        url: '/{formId}/search/{elementType}/{elementId}',
        controller: 'FobuViewSearchCtrl',
        templateUrl: 'fobu/view/search/search.tpl.html',
        onEnter: onEnterGlobal
      }).state('view.nested', {
        url: '/{formId}/{nestedFormId}/{row}',
        controller: 'FobuViewCtrl',
        templateUrl: 'fobu/view/view.tpl.html',
        onEnter: onEnterGlobal
      }).state('view.nestedNew', {
        url: '/{formId}/{nestedFormId}',
        controller: 'FobuViewCtrl',
        templateUrl: 'fobu/view/view.tpl.html',
        onEnter: onEnterGlobal
      });
    }
  };

  this.$get = function(elementTransformer) {
    var config = {
      types: [{
        text: 'Checkboxes',
        icon: 'fa fa-check-square-o',
        type: 'checkbox',
        templateUrl: 'fobu/templates/types/input-checkbox-radio.tpl.html',
        initialize: function(element) {
          element.elements = element.elements || [{ text: 'Untitled option' }];
        }
      }, {
        text: 'Column break',
        icon: 'fa fa-meh-o',
        type: 'column-break',
        templateUrl: 'fobu/templates/types/column-break.tpl.html'
      }, {
        text: 'Date',
        icon: 'fa fa-calendar',
        type: 'date',
        templateUrl: {
          'default': 'fobu/templates/types/input.tpl.html',
          'horizontal': 'fobu/templates/types/fieldset/horizontal_input.tpl.html'
        }
      }, {
        text: 'Fieldset',
        icon: 'fa fa-columns',
        type: 'fieldset',
        templateUrl: {
          'default': 'fobu/templates/types/fieldset/default.tpl.html',
          'horizontal': 'fobu/templates/types/fieldset/horizontal.tpl.html'
        },
        properties: [{
          name: 'columns',
          text: 'Columns',
          type: 'select',
          elements: [
            { text: '1', value: 1 },
            { text: '2', value: 2 },
            { text: '3', value: 3 },
            { text: '4', value: 4 }
          ],
          change: function(element) {
            var i = -1;
            var count = 0;
            while (++i < element.elements.length) {
              if (element.elements[i].type !== 'column-break') {
                continue;
              }
              if (count++ >= (element.columns - 1)) {
                element.elements.splice(i--, 1);
              }
            }
            for (count; count < (element.columns - 1); count++) {
              element.elements.push(elementTransformer.transform({
                type: 'column-break'
              }, config, element));
            }
          }
        }, {
          name: 'template',
          text: 'Template',
          type: 'select',
          elements: [
            { text: 'Default', value: 'default' },
            { text: 'Horizontal', value: 'horizontal' }
          ],
          change: function(element) {
            var index = config.typeStringToIndex['fieldset'];
            var type  = config.types[index];
            element.templateUrl = type.templateUrl[element.template];
          }
        }],
        controller: function($scope, $element, $attrs) {
          $scope.$watch('ngModel.templateUrl', function() {
            return updateElementsTemplate($scope.ngModel.elements);
          });

          $scope.$watchCollection('ngModel.elements', updateElementsTemplate);

          function updateElementsTemplate(elements) {
            for (var i = 0; i < elements.length; i++) {
              var index = config.typeStringToIndex[elements[i].type];
              var type  = config.types[index];
              if (typeof type.templateUrl === 'object') {
                elements[i].templateUrl = type.templateUrl[$scope.ngModel.template];
              }
            }
          }
        },
        initialize: function(element) {
          element.columns = element.columns || 2;
          element.columnClass = function() {
            switch (parseInt(this.columns, 10)) {
              case 2: return 'col-md-6';
              case 3: return 'col-md-4';
              case 4: return 'col-md-3';
            }

            return 'col-md-12';
          };
          element.template = element.template || 'default';
          element.elements = element.elements || [];
        }
      }, {
        text: 'Form',
        icon: 'fa fa-meh-o',
        type: 'form',
        templateUrl: 'fobu/templates/types/form.tpl.html',
        controller: function($scope, $element, $attrs) {
          $scope.stopSorting = function() {
            $element.find("> .sorting").removeClass('sorting');
          };
        }
      }, {
        text: 'Hidden',
        icon: 'fa fa-meh-o',
        type: 'hidden',
        templateUrl: 'fobu/templates/types/hidden.tpl.html'
      }, {
        text: 'Form',
        icon: 'fa fa-meh-o',
        type: 'nested-form',
        templateUrl: 'fobu/templates/types/nested-form.tpl.html'
      }, {
        text: 'Number',
        icon: 'fa fa-meh-o',
        type: 'number',
        templateUrl: {
          'default': 'fobu/templates/types/input.tpl.html',
          'horizontal': 'fobu/templates/types/fieldset/horizontal_input.tpl.html'
        }
      }, {
        text: 'Resource',
        icon: 'fa fa-globe',
        type: 'resource',
        templateUrl: 'fobu/templates/types/resource.tpl.html'
      }, {
        text: 'Dropdown',
        icon: 'fa fa-list-alt',
        type: 'select',
        templateUrl: {
          'default': 'fobu/templates/types/select.tpl.html',
          'horizontal': 'fobu/templates/types/fieldset/horizontal_select.tpl.html'
        },
        initialize: function(element) {
          element.elements = element.elements || [{ text: 'Untitled option' }];
        }
      }, {
        text: 'Text',
        type: 'text',
        icon: 'fa fa-font',
        templateUrl: {
          'default': 'fobu/templates/types/input.tpl.html',
          'horizontal': 'fobu/templates/types/fieldset/horizontal_input.tpl.html'
        }
      }, {
        text: 'Paragraph text',
        icon: 'fa fa-align-justify',
        type: 'textarea',
        templateUrl: 'fobu/templates/types/textarea.tpl.html'
      }, {
        text: 'Multiple choice',
        icon: 'fa fa-dot-circle-o',
        type: 'radio',
        templateUrl: {
          'default': 'fobu/templates/types/input-checkbox-radio.tpl.html',
          'horizontal': 'fobu/templates/types/fieldset/horizontal_select.tpl.html'
        },
        initialize: function(element) {
          element.elements = element.elements || [{ text: 'Untitled option' }];
        }
      }],

      // It's populated in the config.initialize() method.
      typeStringToIndex: {},

      enabledTypes: [
        'text', 'textarea', 'date', 'number', 'checkbox', 'radio', 'select', 'fieldset', 'hidden'
      ],

      // It's populated in the config.initialize() method.
      enabledTypesDefinitions: [],

      formUrl: '/:formId',

      initialize: function() {
        config.typeStringToIndex = {};
        for (var i = 0; i < config.types.length; i++) {
          config.typeStringToIndex[config.types[i].type] = i;
        }

        config.enabledTypesDefinitions = [];
        for (i = 0; i < config.enabledTypes.length; i++) {
          var index = config.typeStringToIndex[config.enabledTypes[i]];
          config.enabledTypesDefinitions.push(config.types[index]);
        }
      },

      getDataProvider: function() {
        return this.dataProviderFn;
      },

      setDataProvider: function(dataProviderFn) {
        this.dataProviderFn = dataProviderFn;
      }
    };

    config.initialize();

    return config;
  };

  function inArray(array, value) {
    for (var i = 0; i < array.length; i++) {
      if (array[i] === value) { return true; }
    }
    return false;
  }
})

;
