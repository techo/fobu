angular.module('fobu.view.search', [
  'fobu.templates-app',
  'fobu.templates-common'
])

.controller('FobuViewSearchCtrl', function($scope, $state, $stateParams, $http) {
  var element = findResourceElement(
    $stateParams.form, $stateParams.elementId, $stateParams.elementType
  );

  $scope.search = function() {
    element.search($scope.query).success(function(results) {
      $scope.results = results;
    });
  };

  $scope.select = function(resource) {
    var data = {};
    data[element.name] = {
      uri: resource.uri,
      text: resource.text || resource[$scope.results.headers[0].name]
    };
    $stateParams.form.fill(data);

    $state.go($state.$previous);
  };

  // TODO: Improve on this to consider nested forms
  $scope.$on('$stateChangeStart', function(e, toState, toParams) {
    toParams.form = $stateParams.form;
  });

  function findResourceElement(element, id, type) {
    if (! element) {
      return;
    }

    if (element.type === type && element.id == id) {
      return element;
    }

    var elements = element.elements || [];
    for (var i = 0; i < elements.length; i++) {
      element = findResourceElement(elements[i], id, type);
      if (element) {
        return element;
      }
    }
  }
})

;
