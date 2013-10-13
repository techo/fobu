angular.module('fobu.config', [])

.factory('config', function() {
  config = {
    types: [{
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
    }, {
      text: 'Column break',
      icon: 'glyphicon-share-alt',
      type: 'column-break',
      templateUrl: 'home/types/column-break.tpl.html'
    }],

    enabledTypes: [
      'text', 'date', 'number', 'select', 'fieldset', 'column-break'
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
