angular.module('fobu.config', [])

.factory('config', function() {
  config = {
    types: [{
      text: 'Checkboxes',
      icon: 'fa fa-check-square-o',
      type: 'checkbox',
      templateUrl: 'home/types/input-checkbox-radio.tpl.html',
      initialize: function(element) {
        element.elements = element.elements || [{ text: '' }];
      }
    }, {
      text: 'Column break',
      icon: 'fa fa-meh-o',
      type: 'column-break',
      templateUrl: 'home/types/column-break.tpl.html'
    }, {
      text: 'Date',
      icon: 'fa fa-calendar',
      type: 'date',
      templateUrl: 'home/types/input.tpl.html'
    }, {
      text: 'Fieldset',
      icon: 'fa fa-columns',
      type: 'fieldset',
      templateUrl: 'home/types/fieldset.tpl.html',
      properties: [{
        name: 'columns',
        text: 'Columns',
        type: 'select',
        elements: [
          { text: '1', value: 1 },
          { text: '2', value: 2 },
          { text: '3', value: 3 },
          { text: '4', value: 4 }
        ]
      }],
      initialize: function(element) {
        element.columns = 2;
        element.columnClass = function() {
          switch (parseInt(this.columns, 10)) {
            case 2: return 'col-md-6';
            case 3: return 'col-md-4';
            case 4: return 'col-md-3';
          }

          return 'col-md-12';
        };
      }
    }, {
      text: 'Number',
      icon: 'fa fa-meh-o',
      type: 'number',
      templateUrl: 'home/types/input.tpl.html'
    }, {
      text: 'Dropdown',
      icon: 'fa fa-list-alt',
      type: 'select',
      templateUrl: 'home/types/select.tpl.html',
      initialize: function(element) {
        element.elements = element.elements || [{ text: '' }];
      }
    }, {
      text: 'Text',
      type: 'text',
      icon: 'fa fa-font',
      templateUrl: 'home/types/input.tpl.html'
    }, {
      text: 'Paragraph text',
      icon: 'fa fa-align-justify',
      type: 'textarea',
      templateUrl: 'home/types/textarea.tpl.html'
    }, {
      text: 'Multiple choice',
      icon: 'fa fa-dot-circle-o',
      type: 'radio',
      templateUrl: 'home/types/input-checkbox-radio.tpl.html',
      initialize: function(element) {
        element.elements = element.elements || [{ text: '' }];
      }
    }],

    enabledTypes: [
      'text', 'textarea', 'date', 'number', 'checkbox', 'radio', 'select', 'fieldset', 'column-break'
    ]
  };

  config.typeStringToIndex = {};
  for (var i = 0; i < config.types.length; i++) {
    config.typeStringToIndex[config.types[i].type] = i;
  }

  for (i = 0; i < config.enabledTypes.length; i++) {
    var index = config.typeStringToIndex[config.enabledTypes[i]];
    config.enabledTypes[i] = config.types[index];
  }

  return config;
})

;
