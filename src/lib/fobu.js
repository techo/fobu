angular.module('fobu', [
  'fobu.config',
  'fobu.templates-app',
  'fobu.templates-common',
  'fobu.directives.formElementRenderer',
  'fobu.services.elementTransformer',
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
