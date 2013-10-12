angular.module('ngBoilerplate.editor-config', [])

.factory('config', function() {
  return {
    types: [{
      text: 'Text',
      icon: 'glyphicon-bold',
      type: 'text',
      templateUrl: 'editor/editor-form-element-input.tpl.html'
    }, {
      text: 'Date',
      icon: 'glyphicon-calendar',
      type: 'date',
      templateUrl: 'editor/editor-form-element-input.tpl.html'
    }, {
      text: 'Number',
      icon: 'glyphicon-bold',
      type: 'number',
      templateUrl: 'editor/editor-form-element-input.tpl.html'
    }, {
      text: 'Dropdown',
      icon: 'glyphicon-list',
      type: 'select',
      templateUrl: 'editor/editor-form-element-select.tpl.html'
    }, {
      text: 'Fieldset',
      icon: 'glyphicon-credit-card',
      type: 'fieldset',
      templateUrl: 'editor/editor-form-element-fieldset.tpl.html'
    }]
  };
})

;
