define('makerarmy/router', ['exports', 'ember', 'makerarmy/config/environment'], function (exports, _ember, _makerarmyConfigEnvironment) {

  var Router = _ember['default'].Router.extend({
    location: _makerarmyConfigEnvironment['default'].locationType,
    rootURL: _makerarmyConfigEnvironment['default'].rootURL
  });

  Router.map(function () {});

  exports['default'] = Router;
});