define('makerarmy/tests/helpers/resolver', ['exports', 'makerarmy/resolver', 'makerarmy/config/environment'], function (exports, _makerarmyResolver, _makerarmyConfigEnvironment) {

  var resolver = _makerarmyResolver['default'].create();

  resolver.namespace = {
    modulePrefix: _makerarmyConfigEnvironment['default'].modulePrefix,
    podModulePrefix: _makerarmyConfigEnvironment['default'].podModulePrefix
  };

  exports['default'] = resolver;
});