angular.module('app', [
  'ui.router',
  'fobu',
  'fobu.view',
  'fobu.edit'
])

.config(function($stateProvider, fobuConfigProvider) {
  fobuConfigProvider.initializeDefaultStates($stateProvider, ['view', 'edit']);

  var data = {
    'nombre': 'Eduardo',
    'subencuesta-basica': [{
      'nombre': 'Eduardo',
      'apellido': 'Grajeda',
      'edad': 26
    }, {
      'nombre': 'Luis',
      'apellido': 'Grajeda',
      'edad': 20
    }]
  };
  fobuConfigProvider.setDataProvider(function(form, $stateParams) {
    if ($stateParams.nestedFormId && $stateParams.row === undefined) {
      form.fill({});
    } else if ($stateParams.nestedFormId) {
      form.fill(data[form.nestedName][$stateParams.row]);
    } else {
      form.fill(data);
    }
  });
})

;
