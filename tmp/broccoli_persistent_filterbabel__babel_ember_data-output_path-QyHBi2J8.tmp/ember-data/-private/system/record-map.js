define('ember-data/-private/system/record-map', ['exports', 'ember-data/-private/debug', 'ember-data/-private/system/model/internal-model'], function (exports, _emberDataPrivateDebug, _emberDataPrivateSystemModelInternalModel) {
  var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

  function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

  /**
   `RecordMap` is a custom storage map for records of a given modelName
   used by `IdentityMap`.
  
   It was extracted from an implicit pojo based "record map" and preserves
   that interface while we work towards a more official API.
  
   @class RecordMap
   @private
   */

  var RecordMap = (function () {
    function RecordMap(modelName) {
      this.modelName = modelName;
      this._idToRecord = Object.create(null);
      this._records = [];
      this._metadata = null;
    }

    /**
      A "map" of records based on their ID for this modelName
     */

    _createClass(RecordMap, [{
      key: 'get',

      /**
       *
       * @param id
       * @returns {InternalModel}
       */
      value: function get(id) {
        var r = this._idToRecord[id];
        return r;
      }
    }, {
      key: 'has',
      value: function has(id) {
        return !!this._idToRecord[id];
      }
    }, {
      key: 'set',
      value: function set(id, internalModel) {
        (0, _emberDataPrivateDebug.assert)('You cannot index an internalModel by an empty id\'', id);
        (0, _emberDataPrivateDebug.assert)('You cannot set an index for an internalModel to something other than an internalModel', internalModel instanceof _emberDataPrivateSystemModelInternalModel['default']);
        (0, _emberDataPrivateDebug.assert)('You cannot set an index for an internalModel that is not in the RecordMap', this.contains(internalModel));
        (0, _emberDataPrivateDebug.assert)('You cannot update the id index of an InternalModel once set. Attempted to update ' + id + '.', !this.has(id) || this.get(id) === internalModel);

        this._idToRecord[id] = internalModel;
      }
    }, {
      key: 'add',
      value: function add(internalModel, id) {
        (0, _emberDataPrivateDebug.assert)('You cannot re-add an already present InternalModel to the RecordMap.', !this.contains(internalModel));

        if (id) {
          this._idToRecord[id] = internalModel;
        }

        this._records.push(internalModel);
      }
    }, {
      key: 'remove',
      value: function remove(internalModel, id) {
        if (id) {
          delete this._idToRecord[id];
        }

        var loc = this._records.indexOf(internalModel);

        if (loc !== -1) {
          this._records.splice(loc, 1);
        }
      }
    }, {
      key: 'contains',
      value: function contains(internalModel) {
        return this._records.indexOf(internalModel) !== -1;
      }

      /**
       An array of all records of this modelName
       */
    }, {
      key: 'clear',

      /**
       Destroy all records in the recordMap and wipe metadata.
        @method clear
       */
      value: function clear() {
        if (this._records) {
          var records = this._records;
          this._records = [];
          var record = undefined;

          for (var i = 0; i < records.length; i++) {
            record = records[i];
            record.unloadRecord();
            record.destroy(); // maybe within unloadRecord
          }
        }

        this._metadata = null;
      }
    }, {
      key: 'destroy',
      value: function destroy() {
        this._store = null;
        this._modelClass = null;
      }
    }, {
      key: 'idToRecord',
      get: function get() {
        (0, _emberDataPrivateDebug.deprecate)('Use of RecordMap.idToRecord is deprecated, use RecordMap.get(id) instead.', false, {
          id: 'ds.record-map.idToRecord',
          until: '2.13'
        });
        return this._idToRecord;
      }
    }, {
      key: 'length',
      get: function get() {
        return this._records.length;
      }
    }, {
      key: 'records',
      get: function get() {
        return this._records;
      }

      /**
       * meta information about records
       */
    }, {
      key: 'metadata',
      get: function get() {
        return this._metadata || (this._metadata = Object.create(null));
      }

      /**
       deprecated (and unsupported) way of accessing modelClass
        @deprecated
       */
    }, {
      key: 'type',
      get: function get() {
        throw new Error('RecordMap.type is no longer available');
      }
    }]);

    return RecordMap;
  })();

  exports['default'] = RecordMap;
});