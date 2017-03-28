define('makerarmy/app', ['exports', 'ember', 'makerarmy/resolver', 'ember-load-initializers', 'makerarmy/config/environment'], function (exports, _ember, _makerarmyResolver, _emberLoadInitializers, _makerarmyConfigEnvironment) {

  var App = undefined;

  _ember['default'].MODEL_FACTORY_INJECTIONS = true;

  App = _ember['default'].Application.extend({
    modulePrefix: _makerarmyConfigEnvironment['default'].modulePrefix,
    podModulePrefix: _makerarmyConfigEnvironment['default'].podModulePrefix,
    Resolver: _makerarmyResolver['default']
  });

  (0, _emberLoadInitializers['default'])(App, _makerarmyConfigEnvironment['default'].modulePrefix);

  exports['default'] = App;
});