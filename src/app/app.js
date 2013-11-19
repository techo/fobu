angular.module('fobu', [
  'templates-app',
  'templates-common',
  'fobu.edit',
  'fobu.view',
  'ui.state',
  'ui.route'
])

.config(function myAppConfig($stateProvider, $urlRouterProvider) {
  $urlRouterProvider.otherwise('/edit');
})

.run(function run() {

})

;
