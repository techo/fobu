angular.module('app', [
  'ui.router',
  'fobu',
  'fobu.view',
  'fobu.edit'
])

.config(function($stateProvider, fobuConfigProvider) {
  fobuConfigProvider.initializeDefaultStates($stateProvider, ['view', 'edit']);
})

.run(function(fobuConfig, $http) {
  var data = {
    'github': {
      'uri': 'http://api.example.org/api/v1/user/1',
      'text': 'egrajeda'
    },
    'nombre': 'Eduardo',
    'subencuesta-basica': [{
      'nombre': 'Eduardo',
      'apellido': 'Grajeda',
      'edad': '26'
    }, {
      'nombre': 'Luis',
      'apellido': 'Grajeda',
      'edad': '20'
    }]
  };

  fobuConfig.setDataProvider(function(form, $stateParams) {
    if ($stateParams.nestedFormId && $stateParams.row === undefined) {
      form.fill({});
    } else if ($stateParams.nestedFormId) {
      form.fill(data[form.nestedName][$stateParams.row]);
    } else {
      form.fill(data);
    }
  });

  fobuConfig.formUrl = 'http://localhost:3000/api/:formId';

  fobuConfig.types.push({
    text: 'Github',
    icon: 'fa fa-github',
    type: 'github',
    templateUrl: 'fobu/templates/types/resource.tpl.html',
    initialize: function(element) {
      element.search = function(query) {
        return $http.get('https://api.github.com/search/users', {
          params: { q: query }
        }).success(function(results) {
          results.headers = [{
            name: 'login',
            text: 'Username'
          }, {
            name: 'site_admin',
            text: 'Admin?'
          }];
          results.results = results.items;
        });
      };
    }
  });

  fobuConfig.enabledTypes.push('github');

  fobuConfig.initialize();
})

;
