define('ember-resolver/utils/class-factory', ['exports'], function (exports) {
  exports['default'] = classFactory;

  function classFactory(klass) {
    return {
      create: function create(injections) {
        if (typeof klass.extend === 'function') {
          return klass.extend(injections);
        } else {
          return klass;
        }
      }
    };
  }
});