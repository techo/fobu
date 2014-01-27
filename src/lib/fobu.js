angular.module('fobu', [
  'fobu.config',
  'fobu.directives.formElementRenderer',
  'fobu.resources.form'
])

.factory('fobu', function(fobuConfig) {
  return {
    config: function(fn) {
      fn(fobuConfig);
      fobuConfig.initialize();
    }
  };
})

;
