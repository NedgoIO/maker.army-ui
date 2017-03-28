define("ember-data/-private/system/record-array-manager", ["exports", "ember", "ember-data/-private/system/record-arrays", "ember-data/-private/system/ordered-set", "ember-data/-private/debug"], function (exports, _ember, _emberDataPrivateSystemRecordArrays, _emberDataPrivateSystemOrderedSet, _emberDataPrivateDebug) {
  var get = _ember["default"].get;
  var MapWithDefault = _ember["default"].MapWithDefault;
  var emberRun = _ember["default"].run;

  /**
    @class RecordArrayManager
    @namespace DS
    @private
    @extends Ember.Object
  */
  exports["default"] = _ember["default"].Object.extend({
    init: function init() {
      var _this = this;

      this.filteredRecordArrays = MapWithDefault.create({
        defaultValue: function defaultValue() {
          return [];
        }
      });

      this.liveRecordArrays = MapWithDefault.create({
        defaultValue: function defaultValue(modelName) {
          (0, _emberDataPrivateDebug.assert)("liveRecordArrays.get expects modelName not modelClass as the param", typeof modelName === 'string');
          return _this.createRecordArray(modelName);
        }
      });

      this.changedRecords = [];
      this._adapterPopulatedRecordArrays = [];
    },

    recordDidChange: function recordDidChange(record) {
      if (this.changedRecords.push(record) !== 1) {
        return;
      }

      emberRun.schedule('actions', this, this.updateRecordArrays);
    },

    recordArraysForRecord: function recordArraysForRecord(internalModel) {
      internalModel._recordArrays = internalModel._recordArrays || _emberDataPrivateSystemOrderedSet["default"].create();
      return internalModel._recordArrays;
    },

    /**
      This method is invoked whenever data is loaded into the store by the
      adapter or updated by the adapter, or when a record has changed.
       It updates all record arrays that a record belongs to.
       To avoid thrashing, it only runs at most once per run loop.
       @method updateRecordArrays
    */
    updateRecordArrays: function updateRecordArrays() {
      var _this2 = this;

      this.changedRecords.forEach(function (internalModel) {

        if (internalModel.isDestroyed || internalModel.currentState.stateName === 'root.deleted.saved') {
          _this2._recordWasDeleted(internalModel);
        } else {
          _this2._recordWasChanged(internalModel);
        }
      });

      this.changedRecords.length = 0;
    },

    _recordWasDeleted: function _recordWasDeleted(internalModel) {
      var recordArrays = internalModel._recordArrays;

      if (!recordArrays) {
        return;
      }

      recordArrays.forEach(function (array) {
        return array._removeInternalModels([internalModel]);
      });

      internalModel._recordArrays = null;
    },

    _recordWasChanged: function _recordWasChanged(internalModel) {
      var _this3 = this;

      var modelName = internalModel.modelName;
      var recordArrays = this.filteredRecordArrays.get(modelName);
      var filter = undefined;
      recordArrays.forEach(function (array) {
        filter = get(array, 'filterFunction');
        _this3.updateFilterRecordArray(array, filter, modelName, internalModel);
      });
    },

    //Need to update live arrays on loading
    recordWasLoaded: function recordWasLoaded(internalModel) {
      var _this4 = this;

      var modelName = internalModel.modelName;
      var recordArrays = this.filteredRecordArrays.get(modelName);
      var filter = undefined;

      recordArrays.forEach(function (array) {
        filter = get(array, 'filterFunction');
        _this4.updateFilterRecordArray(array, filter, modelName, internalModel);
      });

      if (this.liveRecordArrays.has(modelName)) {
        var liveRecordArray = this.liveRecordArrays.get(modelName);
        this._addInternalModelToRecordArray(liveRecordArray, internalModel);
      }
    },

    /**
      Update an individual filter.
       @method updateFilterRecordArray
      @param {DS.FilteredRecordArray} array
      @param {Function} filter
      @param {String} modelName
      @param {InternalModel} internalModel
    */
    updateFilterRecordArray: function updateFilterRecordArray(array, filter, modelName, internalModel) {
      var shouldBeInArray = filter(internalModel.getRecord());
      var recordArrays = this.recordArraysForRecord(internalModel);
      if (shouldBeInArray) {
        this._addInternalModelToRecordArray(array, internalModel);
      } else {
        recordArrays["delete"](array);
        array._removeInternalModels([internalModel]);
      }
    },

    _addInternalModelToRecordArray: function _addInternalModelToRecordArray(array, internalModel) {
      var recordArrays = this.recordArraysForRecord(internalModel);
      if (!recordArrays.has(array)) {
        array._pushInternalModels([internalModel]);
        recordArrays.add(array);
      }
    },

    syncLiveRecordArray: function syncLiveRecordArray(array, modelName) {
      (0, _emberDataPrivateDebug.assert)("recordArrayManger.syncLiveRecordArray expects modelName not modelClass as the second param", typeof modelName === 'string');
      var hasNoPotentialDeletions = this.changedRecords.length === 0;
      var recordMap = this.store._recordMapFor(modelName);
      var hasNoInsertionsOrRemovals = recordMap.length === array.length;

      /*
        Ideally the recordArrayManager has knowledge of the changes to be applied to
        liveRecordArrays, and is capable of strategically flushing those changes and applying
        small diffs if desired.  However, until we've refactored recordArrayManager, this dirty
        check prevents us from unnecessarily wiping out live record arrays returned by peekAll.
       */
      if (hasNoPotentialDeletions && hasNoInsertionsOrRemovals) {
        return;
      }

      this.populateLiveRecordArray(array, modelName);
    },

    populateLiveRecordArray: function populateLiveRecordArray(array, modelName) {
      (0, _emberDataPrivateDebug.assert)("recordArrayManger.populateLiveRecordArray expects modelName not modelClass as the second param", typeof modelName === 'string');

      var recordMap = this.store._recordMapFor(modelName);
      var records = recordMap.records;
      var record = undefined;

      for (var i = 0; i < records.length; i++) {
        record = records[i];

        if (!record.isDeleted() && !record.isEmpty()) {
          this._addInternalModelToRecordArray(array, record);
        }
      }
    },

    /**
      This method is invoked if the `filterFunction` property is
      changed on a `DS.FilteredRecordArray`.
       It essentially re-runs the filter from scratch. This same
      method is invoked when the filter is created in th first place.
       @method updateFilter
      @param {Array} array
      @param {String} modelName
      @param {Function} filter
    */
    updateFilter: function updateFilter(array, modelName, filter) {
      (0, _emberDataPrivateDebug.assert)("recordArrayManger.updateFilter expects modelName not modelClass as the second param, received " + modelName, typeof modelName === 'string');

      var recordMap = this.store._recordMapFor(modelName);
      var records = recordMap.records;
      var record = undefined;

      for (var i = 0; i < records.length; i++) {
        record = records[i];

        if (!record.isDeleted() && !record.isEmpty()) {
          this.updateFilterRecordArray(array, filter, modelName, record);
        }
      }
    },

    /**
      Get the `DS.RecordArray` for a modelName, which contains all loaded records of
      given modelName.
       @method liveRecordArrayFor
      @param {String} modelName
      @return {DS.RecordArray}
    */
    liveRecordArrayFor: function liveRecordArrayFor(modelName) {
      (0, _emberDataPrivateDebug.assert)("recordArrayManger.liveRecordArrayFor expects modelName not modelClass as the param", typeof modelName === 'string');

      return this.liveRecordArrays.get(modelName);
    },

    /**
      Create a `DS.RecordArray` for a modelName.
       @method createRecordArray
      @param {String} modelName
      @return {DS.RecordArray}
    */
    createRecordArray: function createRecordArray(modelName) {
      (0, _emberDataPrivateDebug.assert)("recordArrayManger.createRecordArray expects modelName not modelClass as the param", typeof modelName === 'string');

      return _emberDataPrivateSystemRecordArrays.RecordArray.create({
        modelName: modelName,
        content: _ember["default"].A(),
        store: this.store,
        isLoaded: true,
        manager: this
      });
    },

    /**
      Create a `DS.FilteredRecordArray` for a modelName and register it for updates.
       @method createFilteredRecordArray
      @param {String} modelName
      @param {Function} filter
      @param {Object} query (optional
      @return {DS.FilteredRecordArray}
    */
    createFilteredRecordArray: function createFilteredRecordArray(modelName, filter, query) {
      (0, _emberDataPrivateDebug.assert)("recordArrayManger.createFilteredRecordArray expects modelName not modelClass as the first param, received " + modelName, typeof modelName === 'string');

      var array = _emberDataPrivateSystemRecordArrays.FilteredRecordArray.create({
        query: query,
        modelName: modelName,
        content: _ember["default"].A(),
        store: this.store,
        manager: this,
        filterFunction: filter
      });

      this.registerFilteredRecordArray(array, modelName, filter);

      return array;
    },

    /**
      Create a `DS.AdapterPopulatedRecordArray` for a modelName with given query.
       @method createAdapterPopulatedRecordArray
      @param {String} modelName
      @param {Object} query
      @return {DS.AdapterPopulatedRecordArray}
    */
    createAdapterPopulatedRecordArray: function createAdapterPopulatedRecordArray(modelName, query) {
      (0, _emberDataPrivateDebug.assert)("recordArrayManger.createAdapterPopulatedRecordArray expects modelName not modelClass as the first param, received " + modelName, typeof modelName === 'string');

      var array = _emberDataPrivateSystemRecordArrays.AdapterPopulatedRecordArray.create({
        modelName: modelName,
        query: query,
        content: _ember["default"].A(),
        store: this.store,
        manager: this
      });

      this._adapterPopulatedRecordArrays.push(array);

      return array;
    },

    /**
      Register a RecordArray for a given modelName to be backed by
      a filter function. This will cause the array to update
      automatically when records of that modelName change attribute
      values or states.
       @method registerFilteredRecordArray
      @param {DS.RecordArray} array
      @param {String} modelName
      @param {Function} filter
    */
    registerFilteredRecordArray: function registerFilteredRecordArray(array, modelName, filter) {
      (0, _emberDataPrivateDebug.assert)("recordArrayManger.registerFilteredRecordArray expects modelName not modelClass as the second param, received " + modelName, typeof modelName === 'string');

      var recordArrays = this.filteredRecordArrays.get(modelName);
      recordArrays.push(array);

      this.updateFilter(array, modelName, filter);
    },

    /**
      Unregister a RecordArray.
      So manager will not update this array.
       @method unregisterRecordArray
      @param {DS.RecordArray} array
    */
    unregisterRecordArray: function unregisterRecordArray(array) {

      var modelName = array.modelName;

      // unregister filtered record array
      var recordArrays = this.filteredRecordArrays.get(modelName);
      var removedFromFiltered = remove(recordArrays, array);

      // remove from adapter populated record array
      var removedFromAdapterPopulated = remove(this._adapterPopulatedRecordArrays, array);

      if (!removedFromFiltered && !removedFromAdapterPopulated) {

        // unregister live record array
        if (this.liveRecordArrays.has(modelName)) {
          var liveRecordArrayForType = this.liveRecordArrayFor(modelName);
          if (array === liveRecordArrayForType) {
            this.liveRecordArrays["delete"](modelName);
          }
        }
      }
    },

    willDestroy: function willDestroy() {
      this._super.apply(this, arguments);

      this.filteredRecordArrays.forEach(function (value) {
        return flatten(value).forEach(destroy);
      });
      this.liveRecordArrays.forEach(destroy);
      this._adapterPopulatedRecordArrays.forEach(destroy);
    }
  });

  function destroy(entry) {
    entry.destroy();
  }

  function flatten(list) {
    var length = list.length;
    var result = [];

    for (var i = 0; i < length; i++) {
      result = result.concat(list[i]);
    }

    return result;
  }

  function remove(array, item) {
    var index = array.indexOf(item);

    if (index !== -1) {
      array.splice(index, 1);
      return true;
    }

    return false;
  }
});
/**
  @module ember-data
*/