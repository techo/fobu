angular.module('fobu.view.search', [
  'fobu.templates-app',
  'fobu.templates-common'
])

.controller('FobuViewSearchCtrl', function($scope, $stateParams, $http, $state) {
  $scope.search = function() {
    $http.get('http://localhost:3000/api/resources', {
      params: { q: $scope.query }
    }).success(function(data) {
      $scope.results = data;
    });
  };

  $scope.select = function(resource) {
    var element = findResourceElementById($stateParams.form, $stateParams.elementId);

    var data = {};
    data[element.name] = {
      uri: resource.uri,
      text: resource.text || resource[$scope.results.headers[0].name]
    };
    $stateParams.form.fill(data);

    $state.go($state.$previous);
  };

  $scope.$on('$stateChangeStart', function(e, toState, toParams) {
    toParams.form = $stateParams.form;
  });

  // TODO: Abstract this with the one at view.js?
  function findResourceElementById(element, id) {
    if (! element) {
      return;
    }

    if (element.type === 'resource' && element.id == id) {
      return element;
    }

    var elements = element.elements || [];
    for (var i = 0; i < elements.length; i++) {
      element = findResourceElementById(elements[i], id);
      if (element) {
        return element;
      }
    }
  }
})

;
