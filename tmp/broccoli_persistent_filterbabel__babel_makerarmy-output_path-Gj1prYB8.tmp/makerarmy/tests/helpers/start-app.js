define('makerarmy/tests/helpers/start-app', ['exports', 'ember', 'makerarmy/app', 'makerarmy/config/environment'], function (exports, _ember, _makerarmyApp, _makerarmyConfigEnvironment) {
  exports['default'] = startApp;

  function startApp(attrs) {
    var attributes = _ember['default'].merge({}, _makerarmyConfigEnvironment['default'].APP);
    attributes = _ember['default'].merge(attributes, attrs); // use defaults, but you can override;

    return _ember['default'].run(function () {
      var application = _makerarmyApp['default'].create(attributes);
      application.setupForTesting();
      application.injectTestHelpers();
      return application;
    });
  }
});