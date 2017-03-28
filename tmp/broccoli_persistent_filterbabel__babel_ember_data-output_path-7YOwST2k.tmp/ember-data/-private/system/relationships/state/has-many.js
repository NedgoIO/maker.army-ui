define("ember-data/-private/system/relationships/state/has-many", ["exports", "ember-data/-private/debug", "ember-data/-private/system/promise-proxies", "ember-data/-private/system/relationships/state/relationship", "ember-data/-private/system/ordered-set", "ember-data/-private/system/many-array"], function (exports, _emberDataPrivateDebug, _emberDataPrivateSystemPromiseProxies, _emberDataPrivateSystemRelationshipsStateRelationship, _emberDataPrivateSystemOrderedSet, _emberDataPrivateSystemManyArray) {
  var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

  var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; desc = parent = undefined; continue _function; } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

  function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

  function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

  var ManyRelationship = (function (_Relationship) {
    _inherits(ManyRelationship, _Relationship);

    function ManyRelationship(store, record, inverseKey, relationshipMeta) {
      _get(Object.getPrototypeOf(ManyRelationship.prototype), "constructor", this).call(this, store, record, inverseKey, relationshipMeta);
      this.belongsToType = relationshipMeta.type;
      this.canonicalState = [];
      this.isPolymorphic = relationshipMeta.options.polymorphic;
    }

    _createClass(ManyRelationship, [{
      key: "getManyArray",
      value: function getManyArray() {
        if (!this._manyArray) {
          this._manyArray = _emberDataPrivateSystemManyArray["default"].create({
            canonicalState: this.canonicalState,
            store: this.store,
            relationship: this,
            type: this.store.modelFor(this.belongsToType),
            record: this.record,
            meta: this.meta,
            isPolymorphic: this.isPolymorphic
          });
        }
        return this._manyArray;
      }
    }, {
      key: "destroy",
      value: function destroy() {
        if (this._manyArray) {
          this._manyArray.destroy();
        }
      }
    }, {
      key: "updateMeta",
      value: function updateMeta(meta) {
        _get(Object.getPrototypeOf(ManyRelationship.prototype), "updateMeta", this).call(this, meta);
        if (this._manyArray) {
          this._manyArray.set('meta', meta);
        }
      }
    }, {
      key: "addCanonicalRecord",
      value: function addCanonicalRecord(record, idx) {
        if (this.canonicalMembers.has(record)) {
          return;
        }
        if (idx !== undefined) {
          this.canonicalState.splice(idx, 0, record);
        } else {
          this.canonicalState.push(record);
        }
        _get(Object.getPrototypeOf(ManyRelationship.prototype), "addCanonicalRecord", this).call(this, record, idx);
      }
    }, {
      key: "addRecord",
      value: function addRecord(record, idx) {
        if (this.members.has(record)) {
          return;
        }
        _get(Object.getPrototypeOf(ManyRelationship.prototype), "addRecord", this).call(this, record, idx);
        // make lazy later
        this.getManyArray().internalAddRecords([record], idx);
      }
    }, {
      key: "removeCanonicalRecordFromOwn",
      value: function removeCanonicalRecordFromOwn(record, idx) {
        var i = idx;
        if (!this.canonicalMembers.has(record)) {
          return;
        }
        if (i === undefined) {
          i = this.canonicalState.indexOf(record);
        }
        if (i > -1) {
          this.canonicalState.splice(i, 1);
        }
        _get(Object.getPrototypeOf(ManyRelationship.prototype), "removeCanonicalRecordFromOwn", this).call(this, record, idx);
      }
    }, {
      key: "flushCanonical",
      value: function flushCanonical() {
        if (this._manyArray) {
          this._manyArray.flushCanonical();
        }
        _get(Object.getPrototypeOf(ManyRelationship.prototype), "flushCanonical", this).call(this);
      }
    }, {
      key: "removeRecordFromOwn",
      value: function removeRecordFromOwn(record, idx) {
        if (!this.members.has(record)) {
          return;
        }
        _get(Object.getPrototypeOf(ManyRelationship.prototype), "removeRecordFromOwn", this).call(this, record, idx);
        var manyArray = this.getManyArray();
        if (idx !== undefined) {
          //TODO(Igor) not used currently, fix
          manyArray.currentState.removeAt(idx);
        } else {
          manyArray.internalRemoveRecords([record]);
        }
      }
    }, {
      key: "notifyRecordRelationshipAdded",
      value: function notifyRecordRelationshipAdded(record, idx) {
        (0, _emberDataPrivateDebug.assertPolymorphicType)(this.record, this.relationshipMeta, record);

        this.record.notifyHasManyAdded(this.key, record, idx);
      }
    }, {
      key: "reload",
      value: function reload() {
        var manyArray = this.getManyArray();
        var manyArrayLoadedState = manyArray.get('isLoaded');

        if (this._loadingPromise) {
          if (this._loadingPromise.get('isPending')) {
            return this._loadingPromise;
          }
          if (this._loadingPromise.get('isRejected')) {
            manyArray.set('isLoaded', manyArrayLoadedState);
          }
        }

        if (this.link) {
          this._loadingPromise = (0, _emberDataPrivateSystemPromiseProxies.promiseManyArray)(this.fetchLink(), 'Reload with link');
          return this._loadingPromise;
        } else {
          this._loadingPromise = (0, _emberDataPrivateSystemPromiseProxies.promiseManyArray)(this.store._scheduleFetchMany(manyArray.currentState).then(function () {
            return manyArray;
          }), 'Reload with ids');
          return this._loadingPromise;
        }
      }
    }, {
      key: "computeChanges",
      value: function computeChanges(records) {
        var members = this.canonicalMembers;
        var recordsToRemove = [];
        var length;
        var record;
        var i;

        records = setForArray(records);

        members.forEach(function (member) {
          if (records.has(member)) {
            return;
          }

          recordsToRemove.push(member);
        });

        this.removeCanonicalRecords(recordsToRemove);

        // Using records.toArray() since currently using
        // removeRecord can modify length, messing stuff up
        // forEach since it directly looks at "length" each
        // iteration
        records = records.toArray();
        length = records.length;
        for (i = 0; i < length; i++) {
          record = records[i];
          this.removeCanonicalRecord(record);
          this.addCanonicalRecord(record, i);
        }
      }
    }, {
      key: "fetchLink",
      value: function fetchLink() {
        var _this = this;

        return this.store.findHasMany(this.record, this.link, this.relationshipMeta).then(function (records) {
          if (records.hasOwnProperty('meta')) {
            _this.updateMeta(records.meta);
          }
          _this.store._backburner.join(function () {
            _this.updateRecordsFromAdapter(records);
            _this.getManyArray().set('isLoaded', true);
          });
          return _this.getManyArray();
        });
      }
    }, {
      key: "findRecords",
      value: function findRecords() {
        var manyArray = this.getManyArray();
        var array = manyArray.toArray();
        var internalModels = new Array(array.length);

        for (var i = 0; i < array.length; i++) {
          internalModels[i] = array[i]._internalModel;
        }

        //TODO CLEANUP
        return this.store.findMany(internalModels).then(function () {
          if (!manyArray.get('isDestroyed')) {
            //Goes away after the manyArray refactor
            manyArray.set('isLoaded', true);
          }
          return manyArray;
        });
      }
    }, {
      key: "notifyHasManyChanged",
      value: function notifyHasManyChanged() {
        this.record.notifyHasManyAdded(this.key);
      }
    }, {
      key: "getRecords",
      value: function getRecords() {
        var _this2 = this;

        //TODO(Igor) sync server here, once our syncing is not stupid
        var manyArray = this.getManyArray();
        if (this.isAsync) {
          var promise;
          if (this.link) {
            if (this.hasLoaded) {
              promise = this.findRecords();
            } else {
              promise = this.findLink().then(function () {
                return _this2.findRecords();
              });
            }
          } else {
            promise = this.findRecords();
          }
          this._loadingPromise = _emberDataPrivateSystemPromiseProxies.PromiseManyArray.create({
            content: manyArray,
            promise: promise
          });
          return this._loadingPromise;
        } else {
          (0, _emberDataPrivateDebug.assert)("You looked up the '" + this.key + "' relationship on a '" + this.record.type.modelName + "' with id " + this.record.id + " but some of the associated records were not loaded. Either make sure they are all loaded together with the parent record, or specify that the relationship is async (`DS.hasMany({ async: true })`)", manyArray.isEvery('isEmpty', false));

          //TODO(Igor) WTF DO I DO HERE?
          // TODO @runspired equal WTFs to Igor
          if (!manyArray.get('isDestroyed')) {
            manyArray.set('isLoaded', true);
          }
          return manyArray;
        }
      }
    }, {
      key: "updateData",
      value: function updateData(data) {
        var internalModels = this.store._pushResourceIdentifiers(this, data);
        this.updateRecordsFromAdapter(internalModels);
      }
    }]);

    return ManyRelationship;
  })(_emberDataPrivateSystemRelationshipsStateRelationship["default"]);

  exports["default"] = ManyRelationship;

  function setForArray(array) {
    var set = new _emberDataPrivateSystemOrderedSet["default"]();

    if (array) {
      for (var i = 0, l = array.length; i < l; i++) {
        set.add(array[i]);
      }
    }

    return set;
  }
});