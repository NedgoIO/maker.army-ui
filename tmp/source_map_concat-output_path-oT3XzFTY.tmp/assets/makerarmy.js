"use strict";



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
define('makerarmy/components/welcome-page', ['exports', 'ember-welcome-page/components/welcome-page'], function (exports, _emberWelcomePageComponentsWelcomePage) {
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function get() {
      return _emberWelcomePageComponentsWelcomePage['default'];
    }
  });
});
define('makerarmy/helpers/app-version', ['exports', 'ember', 'makerarmy/config/environment', 'ember-cli-app-version/utils/regexp'], function (exports, _ember, _makerarmyConfigEnvironment, _emberCliAppVersionUtilsRegexp) {
  exports.appVersion = appVersion;
  var version = _makerarmyConfigEnvironment['default'].APP.version;

  function appVersion(_) {
    var hash = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

    if (hash.hideSha) {
      return version.match(_emberCliAppVersionUtilsRegexp.versionRegExp)[0];
    }

    if (hash.hideVersion) {
      return version.match(_emberCliAppVersionUtilsRegexp.shaRegExp)[0];
    }

    return version;
  }

  exports['default'] = _ember['default'].Helper.helper(appVersion);
});
define('makerarmy/helpers/pluralize', ['exports', 'ember-inflector/lib/helpers/pluralize'], function (exports, _emberInflectorLibHelpersPluralize) {
  exports['default'] = _emberInflectorLibHelpersPluralize['default'];
});
define('makerarmy/helpers/singularize', ['exports', 'ember-inflector/lib/helpers/singularize'], function (exports, _emberInflectorLibHelpersSingularize) {
  exports['default'] = _emberInflectorLibHelpersSingularize['default'];
});
define('makerarmy/initializers/app-version', ['exports', 'ember-cli-app-version/initializer-factory', 'makerarmy/config/environment'], function (exports, _emberCliAppVersionInitializerFactory, _makerarmyConfigEnvironment) {
  var _config$APP = _makerarmyConfigEnvironment['default'].APP;
  var name = _config$APP.name;
  var version = _config$APP.version;
  exports['default'] = {
    name: 'App Version',
    initialize: (0, _emberCliAppVersionInitializerFactory['default'])(name, version)
  };
});
define('makerarmy/initializers/container-debug-adapter', ['exports', 'ember-resolver/container-debug-adapter'], function (exports, _emberResolverContainerDebugAdapter) {
  exports['default'] = {
    name: 'container-debug-adapter',

    initialize: function initialize() {
      var app = arguments[1] || arguments[0];

      app.register('container-debug-adapter:main', _emberResolverContainerDebugAdapter['default']);
      app.inject('container-debug-adapter:main', 'namespace', 'application:main');
    }
  };
});
define('makerarmy/initializers/data-adapter', ['exports', 'ember'], function (exports, _ember) {

  /*
    This initializer is here to keep backwards compatibility with code depending
    on the `data-adapter` initializer (before Ember Data was an addon).
  
    Should be removed for Ember Data 3.x
  */

  exports['default'] = {
    name: 'data-adapter',
    before: 'store',
    initialize: function initialize() {}
  };
});
define('makerarmy/initializers/ember-data', ['exports', 'ember-data/setup-container', 'ember-data/-private/core'], function (exports, _emberDataSetupContainer, _emberDataPrivateCore) {

  /*
  
    This code initializes Ember-Data onto an Ember application.
  
    If an Ember.js developer defines a subclass of DS.Store on their application,
    as `App.StoreService` (or via a module system that resolves to `service:store`)
    this code will automatically instantiate it and make it available on the
    router.
  
    Additionally, after an application's controllers have been injected, they will
    each have the store made available to them.
  
    For example, imagine an Ember.js application with the following classes:
  
    App.StoreService = DS.Store.extend({
      adapter: 'custom'
    });
  
    App.PostsController = Ember.Controller.extend({
      // ...
    });
  
    When the application is initialized, `App.ApplicationStore` will automatically be
    instantiated, and the instance of `App.PostsController` will have its `store`
    property set to that instance.
  
    Note that this code will only be run if the `ember-application` package is
    loaded. If Ember Data is being used in an environment other than a
    typical application (e.g., node.js where only `ember-runtime` is available),
    this code will be ignored.
  */

  exports['default'] = {
    name: 'ember-data',
    initialize: _emberDataSetupContainer['default']
  };
});
define('makerarmy/initializers/export-application-global', ['exports', 'ember', 'makerarmy/config/environment'], function (exports, _ember, _makerarmyConfigEnvironment) {
  exports.initialize = initialize;

  function initialize() {
    var application = arguments[1] || arguments[0];
    if (_makerarmyConfigEnvironment['default'].exportApplicationGlobal !== false) {
      var theGlobal;
      if (typeof window !== 'undefined') {
        theGlobal = window;
      } else if (typeof global !== 'undefined') {
        theGlobal = global;
      } else if (typeof self !== 'undefined') {
        theGlobal = self;
      } else {
        // no reasonable global, just bail
        return;
      }

      var value = _makerarmyConfigEnvironment['default'].exportApplicationGlobal;
      var globalName;

      if (typeof value === 'string') {
        globalName = value;
      } else {
        globalName = _ember['default'].String.classify(_makerarmyConfigEnvironment['default'].modulePrefix);
      }

      if (!theGlobal[globalName]) {
        theGlobal[globalName] = application;

        application.reopen({
          willDestroy: function willDestroy() {
            this._super.apply(this, arguments);
            delete theGlobal[globalName];
          }
        });
      }
    }
  }

  exports['default'] = {
    name: 'export-application-global',

    initialize: initialize
  };
});
define('makerarmy/initializers/injectStore', ['exports', 'ember'], function (exports, _ember) {

  /*
    This initializer is here to keep backwards compatibility with code depending
    on the `injectStore` initializer (before Ember Data was an addon).
  
    Should be removed for Ember Data 3.x
  */

  exports['default'] = {
    name: 'injectStore',
    before: 'store',
    initialize: function initialize() {}
  };
});
define('makerarmy/initializers/store', ['exports', 'ember'], function (exports, _ember) {

  /*
    This initializer is here to keep backwards compatibility with code depending
    on the `store` initializer (before Ember Data was an addon).
  
    Should be removed for Ember Data 3.x
  */

  exports['default'] = {
    name: 'store',
    after: 'ember-data',
    initialize: function initialize() {}
  };
});
define('makerarmy/initializers/transforms', ['exports', 'ember'], function (exports, _ember) {

  /*
    This initializer is here to keep backwards compatibility with code depending
    on the `transforms` initializer (before Ember Data was an addon).
  
    Should be removed for Ember Data 3.x
  */

  exports['default'] = {
    name: 'transforms',
    before: 'store',
    initialize: function initialize() {}
  };
});
define("makerarmy/instance-initializers/browser/clear-double-boot", ["exports"], function (exports) {
  /*globals Ember*/

  // When using `ember fastboot --serve-assets` the application output will
  // already be rendered to the DOM when the actual JavaScript loads. Ember
  // does not automatically clear its `rootElement` so this leads to the
  // "double" applications being visible at once (only the "bottom" one is
  // running via JS and is interactive).
  //
  // This removes any pre-rendered ember-view elements, so that the booting
  // application will replace the pre-rendered output

  exports["default"] = {
    name: "clear-double-boot",

    initialize: function initialize(instance) {
      var originalDidCreateRootView = instance.didCreateRootView;

      instance.didCreateRootView = function () {
        var elements = document.querySelectorAll(instance.rootElement + ' .ember-view');
        for (var i = 0; i < elements.length; i++) {
          var element = elements[i];
          element.parentNode.removeChild(element);
        }

        originalDidCreateRootView.apply(instance, arguments);
      };
    }
  };
});
define("makerarmy/instance-initializers/ember-data", ["exports", "ember-data/-private/instance-initializers/initialize-store-service"], function (exports, _emberDataPrivateInstanceInitializersInitializeStoreService) {
  exports["default"] = {
    name: "ember-data",
    initialize: _emberDataPrivateInstanceInitializersInitializeStoreService["default"]
  };
});
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
define('makerarmy/resolver', ['exports', 'ember-resolver'], function (exports, _emberResolver) {
  exports['default'] = _emberResolver['default'];
});
define('makerarmy/router', ['exports', 'ember', 'makerarmy/config/environment'], function (exports, _ember, _makerarmyConfigEnvironment) {

  var Router = _ember['default'].Router.extend({
    location: _makerarmyConfigEnvironment['default'].locationType,
    rootURL: _makerarmyConfigEnvironment['default'].rootURL
  });

  Router.map(function () {});

  exports['default'] = Router;
});
define('makerarmy/services/ajax', ['exports', 'ember-ajax/services/ajax'], function (exports, _emberAjaxServicesAjax) {
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function get() {
      return _emberAjaxServicesAjax['default'];
    }
  });
});
define('makerarmy/services/fastboot', ['exports', 'ember'], function (exports, _ember) {
  var deprecate = _ember['default'].deprecate;
  var computed = _ember['default'].computed;
  var get = _ember['default'].get;
  var deprecatingAlias = computed.deprecatingAlias;
  var readOnly = computed.readOnly;

  var RequestObject = _ember['default'].Object.extend({
    init: function init() {
      this._super.apply(this, arguments);

      var request = this.request;
      delete this.request;

      this.cookies = request.cookies;
      this.headers = request.headers;
      this.queryParams = request.queryParams;
      this.path = request.path;
      this.protocol = request.protocol;
      this._host = function () {
        return request.host();
      };
    },

    host: computed(function () {
      return this._host();
    })
  });

  var Shoebox = _ember['default'].Object.extend({
    put: function put(key, value) {
      _ember['default'].assert('shoebox.put is only invoked from the FastBoot rendered application', this.get('fastboot.isFastBoot'));
      _ember['default'].assert('the provided key is a string', typeof key === 'string');

      var fastbootInfo = this.get('fastboot._fastbootInfo');
      if (!fastbootInfo.shoebox) {
        fastbootInfo.shoebox = {};
      }

      fastbootInfo.shoebox[key] = value;
    },

    retrieve: function retrieve(key) {
      if (this.get('fastboot.isFastBoot')) {
        var shoebox = this.get('fastboot._fastbootInfo.shoebox');
        if (!shoebox) {
          return;
        }

        return shoebox[key];
      }

      var shoeboxItem = this.get(key);
      if (shoeboxItem) {
        return shoeboxItem;
      }

      var el = document.querySelector('#shoebox-' + key);
      if (!el) {
        return;
      }
      var valueString = el.textContent;
      if (!valueString) {
        return;
      }

      shoeboxItem = JSON.parse(valueString);
      this.set(key, shoeboxItem);

      return shoeboxItem;
    }
  });

  var FastBootService = _ember['default'].Service.extend({
    cookies: deprecatingAlias('request.cookies', { id: 'fastboot.cookies-to-request', until: '0.9.9' }),
    headers: deprecatingAlias('request.headers', { id: 'fastboot.headers-to-request', until: '0.9.9' }),

    init: function init() {
      this._super.apply(this, arguments);

      var shoebox = Shoebox.create({ fastboot: this });
      this.set('shoebox', shoebox);
    },

    host: computed(function () {
      deprecate('Usage of fastboot service\'s `host` property is deprecated.  Please use `request.host` instead.', false, { id: 'fastboot.host-to-request', until: '0.9.9' });

      return this._fastbootInfo.request.host();
    }),

    response: readOnly('_fastbootInfo.response'),
    metadata: readOnly('_fastbootInfo.metadata'),

    request: computed(function () {
      if (!this.isFastBoot) return null;
      return RequestObject.create({ request: get(this, '_fastbootInfo.request') });
    }),

    deferRendering: function deferRendering(promise) {
      _ember['default'].assert('deferRendering requires a promise or thennable object', typeof promise.then === 'function');
      this._fastbootInfo.deferRendering(promise);
    }
  });

  Object.defineProperty(FastBootService.proto(), 'isFastBoot', {
    writable: false,
    enumerable: true,
    value: typeof FastBoot !== 'undefined'
  });

  exports['default'] = FastBootService;
});
/* global FastBoot */
define("makerarmy/templates/application", ["exports"], function (exports) {
  exports["default"] = Ember.HTMLBars.template({ "id": "FHUMRo/V", "block": "{\"statements\":[[\"append\",[\"unknown\",[\"welcome-page\"]],false],[\"text\",\"\\n\"],[\"text\",\"\\n\"],[\"append\",[\"unknown\",[\"outlet\"]],false],[\"text\",\"\\n\"]],\"locals\":[],\"named\":[],\"yields\":[],\"blocks\":[],\"hasPartials\":false}", "meta": { "moduleName": "makerarmy/templates/application.hbs" } });
});


define('makerarmy/config/environment', ['ember'], function(Ember) {
  var prefix = 'makerarmy';
try {
  var metaName = prefix + '/config/environment';
  var rawConfig = document.querySelector('meta[name="' + metaName + '"]').getAttribute('content');
  var config = JSON.parse(unescape(rawConfig));

  var exports = { 'default': config };

  Object.defineProperty(exports, '__esModule', { value: true });

  return exports;
}
catch(err) {
  throw new Error('Could not read config from meta tag with name "' + metaName + '".');
}

});

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

//# sourceMappingURL=makerarmy.map
