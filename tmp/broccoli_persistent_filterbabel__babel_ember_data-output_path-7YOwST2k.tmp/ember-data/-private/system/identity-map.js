define('ember-data/-private/system/identity-map', ['exports', 'ember-data/-private/system/record-map'], function (exports, _emberDataPrivateSystemRecordMap) {
  var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

  function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

  /**
   `IdentityMap` is a custom storage map for records by modelName
   used by `DS.Store`.
  
   @class IdentityMap
   @private
   */

  var IdentityMap = (function () {
    function IdentityMap() {
      this._map = Object.create(null);
    }

    /**
     Retrieves the `RecordMap` for a given modelName,
     creating one if one did not already exist. This is
     similar to `getWithDefault` or `get` on a `MapWithDefault`
      @method retrieve
     @param modelName a previously normalized modelName
     @returns {RecordMap} the RecordMap for the given modelName
     */

    _createClass(IdentityMap, [{
      key: 'retrieve',
      value: function retrieve(modelName) {
        var recordMap = this._map[modelName];

        if (!recordMap) {
          recordMap = this._map[modelName] = new _emberDataPrivateSystemRecordMap['default'](modelName);
        }

        return recordMap;
      }

      /**
       Clears the contents of all known `RecordMaps`, but does
       not remove the RecordMap instances.
        @method clear
       */
    }, {
      key: 'clear',
      value: function clear() {
        var recordMaps = this._map;
        var keys = Object.keys(recordMaps);

        for (var i = 0; i < keys.length; i++) {
          var key = keys[i];
          recordMaps[key].clear();
        }
      }
    }]);

    return IdentityMap;
  })();

  exports['default'] = IdentityMap;
});