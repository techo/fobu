angular.module('app', [
  'ui.router',
  'fobu.view',
  'fobu.edit'
])

.config(function($stateProvider) {
  $stateProvider.state('view', {
    url: '/{formId}',
    views: {
      'main': {
        controller: 'FobuViewCtrl',
        templateUrl: 'fobu/view/view.tpl.html'
      }
    }
  }).state('nestedView', {
    url: '/{formId}/{nestedFormId}',
    views: {
      'main': {
        controller: 'FobuViewCtrl',
        templateUrl: 'fobu/view/view.tpl.html'
      }
    }
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
