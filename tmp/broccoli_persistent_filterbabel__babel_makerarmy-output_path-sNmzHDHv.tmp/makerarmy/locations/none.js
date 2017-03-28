define('makerarmy/locations/none', ['exports', 'ember'], function (exports, _ember) {
  var computed = _ember['default'].computed;
  var _Ember$computed = _ember['default'].computed;
  var bool = _Ember$computed.bool;
  var readOnly = _Ember$computed.readOnly;
  var service = _ember['default'].inject.service;
  var get = _ember['default'].get;
  var getOwner = _ember['default'].getOwner;

  var TEMPORARY_REDIRECT_CODE = 307;

  exports['default'] = _ember['default'].NoneLocation.extend({
    implementation: 'fastboot',
    fastboot: service(),

    _config: computed(function () {
      return getOwner(this).resolveRegistration('config:environment');
    }),

    _fastbootHeadersEnabled: bool('_config.fastboot.fastbootHeaders'),

    _redirectCode: computed(function () {
      return get(this, '_config.fastboot.redirectCode') || TEMPORARY_REDIRECT_CODE;
    }),

    _response: readOnly('fastboot.response'),
    _request: readOnly('fastboot.request'),

    _normalizePath: function _normalizePath(path, isInitialPath) {
      if (!isInitialPath) {
        // only on redirects (transitionTo, replaceWith, etc...)
        // incoming path does not include rootURL
        var rootURL = get(this, 'rootURL');
        rootURL = rootURL.substr(0, rootURL.length - 1);
        path = '' + rootURL + path;
      }
      return path;
    },

    setURL: function setURL(path) {
      if (get(this, 'fastboot.isFastBoot')) {
        var currentPath = get(this, 'path');
        var isInitialPath = !currentPath || currentPath.length === 0;
        path = this._normalizePath(path, isInitialPath);
        var isTransitioning = currentPath !== path;
        var response = get(this, '_response');

        if (isTransitioning && !isInitialPath) {
          var protocol = get(this, '_request.protocol');
          var host = get(this, '_request.host');
          var redirectURL = protocol + '://' + host + path;

          response.statusCode = this.get('_redirectCode');
          response.headers.set('location', redirectURL);
        }

        // for testing and debugging
        if (get(this, '_fastbootHeadersEnabled')) {
          response.headers.set('x-fastboot-path', path);
        }
      }

      this._super.apply(this, arguments);
    }
  });
});