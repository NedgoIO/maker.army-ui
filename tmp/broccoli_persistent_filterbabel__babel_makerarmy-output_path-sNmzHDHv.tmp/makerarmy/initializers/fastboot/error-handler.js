define('makerarmy/initializers/fastboot/error-handler', ['exports', 'ember'], function (exports, _ember) {

  /**
   * Initializer to attach an `onError` hook to your app running in fastboot. It catches any run loop
   * exceptions and other errors and prevents the node process from crashing.
   *
   */
  exports['default'] = {
    name: 'error-handler',

    initialize: function initialize(application) {
      if (!_ember['default'].onerror) {
        // if no onerror handler is defined, define one for fastboot environments
        _ember['default'].onerror = function (err) {
          var errorMessage = 'There was an error running your app in fastboot. More info about the error: \n ' + (err.stack || err);
          _ember['default'].Logger.error(errorMessage);
        };
      }
    }
  };
});