angular.module('fobu', [
  'templates-app',
  'templates-common',
  'fobu.home',
  'ui.state',
  'ui.route'
])

.config(function myAppConfig($stateProvider, $urlRouterProvider) {
  $urlRouterProvider.otherwise('/');
})

.run(function run() {

})

;
