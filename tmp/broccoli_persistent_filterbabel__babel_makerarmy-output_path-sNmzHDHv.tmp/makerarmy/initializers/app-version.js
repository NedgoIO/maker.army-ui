define('makerarmy/initializers/app-version', ['exports', 'ember-cli-app-version/initializer-factory', 'makerarmy/config/environment'], function (exports, _emberCliAppVersionInitializerFactory, _makerarmyConfigEnvironment) {
  var _config$APP = _makerarmyConfigEnvironment['default'].APP;
  var name = _config$APP.name;
  var version = _config$APP.version;
  exports['default'] = {
    name: 'App Version',
    initialize: (0, _emberCliAppVersionInitializerFactory['default'])(name, version)
  };
});