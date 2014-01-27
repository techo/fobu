angular.module('app', [
  'ui.router',
  'fobu',
  'fobu.view',
  'fobu.edit'
])

.config(function($stateProvider, fobuConfigProvider) {
  fobuConfigProvider.initializeDefaultStates($stateProvider, ['view', 'edit']);
})

;
