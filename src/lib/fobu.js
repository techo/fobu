angular.module('fobu', [
  'fobu.config',
  'fobu.directives.formElementRenderer',
  'fobu.resources.form'
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
