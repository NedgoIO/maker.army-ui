if (!runningTests) {
  require("makerarmy/app")["default"].create({"name":"makerarmy","version":"0.0.0+1df2b17b"});
}

define('~fastboot/app-factory', ['makerarmy/app', 'makerarmy/config/environment'], function(App, config) {
  App = App['default'];
  config = config['default'];

  return {
    'default': function() {
      return App.create(config.APP);
    }
  };
});

