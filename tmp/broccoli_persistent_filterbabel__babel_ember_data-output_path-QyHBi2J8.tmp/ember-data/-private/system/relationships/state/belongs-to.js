define("ember-data/-private/system/relationships/state/belongs-to", ["exports", "ember", "ember-data/-private/debug", "ember-data/-private/system/promise-proxies", "ember-data/-private/system/relationships/state/relationship"], function (exports, _ember, _emberDataPrivateDebug, _emberDataPrivateSystemPromiseProxies, _emberDataPrivateSystemRelationshipsStateRelationship) {
  var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

  var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; desc = parent = undefined; continue _function; } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

  function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

  function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

  var BelongsToRelationship = (function (_Relationship) {
    _inherits(BelongsToRelationship, _Relationship);

    function BelongsToRelationship(store, internalModel, inverseKey, relationshipMeta) {
      _get(Object.getPrototypeOf(BelongsToRelationship.prototype), "constructor", this).call(this, store, internalModel, inverseKey, relationshipMeta);
      this.internalModel = internalModel;
      this.key = relationshipMeta.key;
      this.inverseRecord = null;
      this.canonicalState = null;
    }

    _createClass(BelongsToRelationship, [{
      key: "setRecord",
      value: function setRecord(newRecord) {
        if (newRecord) {
          this.addRecord(newRecord);
        } else if (this.inverseRecord) {
          this.removeRecord(this.inverseRecord);
        }
        this.setHasData(true);
        this.setHasLoaded(true);
      }
    }, {
      key: "setCanonicalRecord",
      value: function setCanonicalRecord(newRecord) {
        if (newRecord) {
          this.addCanonicalRecord(newRecord);
        } else if (this.canonicalState) {
          this.removeCanonicalRecord(this.canonicalState);
        }
        this.flushCanonicalLater();
      }
    }, {
      key: "addCanonicalRecord",
      value: function addCanonicalRecord(newRecord) {
        if (this.canonicalMembers.has(newRecord)) {
          return;
        }

        if (this.canonicalState) {
          this.removeCanonicalRecord(this.canonicalState);
        }

        this.canonicalState = newRecord;
        _get(Object.getPrototypeOf(BelongsToRelationship.prototype), "addCanonicalRecord", this).call(this, newRecord);
      }
    }, {
      key: "flushCanonical",
      value: function flushCanonical() {
        //temporary fix to not remove newly created records if server returned null.
        //TODO remove once we have proper diffing
        if (this.inverseRecord && this.inverseRecord.isNew() && !this.canonicalState) {
          return;
        }
        if (this.inverseRecord !== this.canonicalState) {
          this.inverseRecord = this.canonicalState;
          this.internalModel.notifyBelongsToChanged(this.key);
        }

        _get(Object.getPrototypeOf(BelongsToRelationship.prototype), "flushCanonical", this).call(this);
      }
    }, {
      key: "addRecord",
      value: function addRecord(newRecord) {
        if (this.members.has(newRecord)) {
          return;
        }

        (0, _emberDataPrivateDebug.assertPolymorphicType)(this.internalModel, this.relationshipMeta, newRecord);

        if (this.inverseRecord) {
          this.removeRecord(this.inverseRecord);
        }

        this.inverseRecord = newRecord;
        _get(Object.getPrototypeOf(BelongsToRelationship.prototype), "addRecord", this).call(this, newRecord);
        this.internalModel.notifyBelongsToChanged(this.key);
      }
    }, {
      key: "setRecordPromise",
      value: function setRecordPromise(newPromise) {
        var content = newPromise.get && newPromise.get('content');
        (0, _emberDataPrivateDebug.assert)("You passed in a promise that did not originate from an EmberData relationship. You can only pass promises that come from a belongsTo or hasMany relationship to the get call.", content !== undefined);
        this.setRecord(content ? content._internalModel : content);
      }
    }, {
      key: "removeRecordFromOwn",
      value: function removeRecordFromOwn(record) {
        if (!this.members.has(record)) {
          return;
        }
        this.inverseRecord = null;
        _get(Object.getPrototypeOf(BelongsToRelationship.prototype), "removeRecordFromOwn", this).call(this, record);
        this.internalModel.notifyBelongsToChanged(this.key);
      }
    }, {
      key: "removeCanonicalRecordFromOwn",
      value: function removeCanonicalRecordFromOwn(record) {
        if (!this.canonicalMembers.has(record)) {
          return;
        }
        this.canonicalState = null;
        _get(Object.getPrototypeOf(BelongsToRelationship.prototype), "removeCanonicalRecordFromOwn", this).call(this, record);
      }
    }, {
      key: "findRecord",
      value: function findRecord() {
        if (this.inverseRecord) {
          return this.store._findByInternalModel(this.inverseRecord);
        } else {
          return _ember["default"].RSVP.Promise.resolve(null);
        }
      }
    }, {
      key: "fetchLink",
      value: function fetchLink() {
        var _this = this;

        return this.store.findBelongsTo(this.internalModel, this.link, this.relationshipMeta).then(function (record) {
          if (record) {
            _this.addRecord(record);
          }
          return record;
        });
      }
    }, {
      key: "getRecord",
      value: function getRecord() {
        var _this2 = this;

        //TODO(Igor) flushCanonical here once our syncing is not stupid
        if (this.isAsync) {
          var promise;
          if (this.link) {
            if (this.hasLoaded) {
              promise = this.findRecord();
            } else {
              promise = this.findLink().then(function () {
                return _this2.findRecord();
              });
            }
          } else {
            promise = this.findRecord();
          }

          return _emberDataPrivateSystemPromiseProxies.PromiseObject.create({
            promise: promise,
            content: this.inverseRecord ? this.inverseRecord.getRecord() : null
          });
        } else {
          if (this.inverseRecord === null) {
            return null;
          }
          var toReturn = this.inverseRecord.getRecord();
          (0, _emberDataPrivateDebug.assert)("You looked up the '" + this.key + "' relationship on a '" + this.internalModel.modelName + "' with id " + this.internalModel.id + " but some of the associated records were not loaded. Either make sure they are all loaded together with the parent record, or specify that the relationship is async (`DS.belongsTo({ async: true })`)", toReturn === null || !toReturn.get('isEmpty'));
          return toReturn;
        }
      }
    }, {
      key: "reload",
      value: function reload() {
        // TODO handle case when reload() is triggered multiple times

        if (this.link) {
          return this.fetchLink();
        }

        // reload record, if it is already loaded
        if (this.inverseRecord && this.inverseRecord.hasRecord) {
          return this.inverseRecord.record.reload();
        }

        return this.findRecord();
      }
    }, {
      key: "updateData",
      value: function updateData(data) {
        var internalModel = this.store._pushResourceIdentifier(this, data);
        this.setCanonicalRecord(internalModel);
      }
    }]);

    return BelongsToRelationship;
  })(_emberDataPrivateSystemRelationshipsStateRelationship["default"]);

  exports["default"] = BelongsToRelationship;
});