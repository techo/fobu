angular.module('app', [
  'ui.router',
  'fobu.view',
  'fobu.edit'
])

.config(function($stateProvider) {
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
    templateUrl: 'fobu/view/view.tpl.html'
  }).state('view.nested', {
    url: '/{formId}/{nestedFormId}/{row}',
    controller: 'FobuViewCtrl',
    templateUrl: 'fobu/view/view.tpl.html'
  }).state('view.nestedNew', {
    url: '/{formId}/{nestedFormId}',
    controller: 'FobuViewCtrl',
    templateUrl: 'fobu/view/view.tpl.html'
  }).state('edit', {
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
})

;
