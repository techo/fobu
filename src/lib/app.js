angular.module('fobu', [
  'fobu.config',
  'fobu.templates-app',
  'fobu.templates-common',
  'fobu.edit',
  'fobu.view',
  'ui.router'
])

.factory('fobu', function(config) {
  return {
    config: function(fn) {
      fn(config);
      config.initialize();
    }
  };
})

;
