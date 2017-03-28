define("ember-data/-private/system/relationships/state/create", ["exports", "ember", "ember-data/-private/system/relationships/state/has-many", "ember-data/-private/system/relationships/state/belongs-to", "ember-data/-private/system/empty-object", "ember-data/-private/debug"], function (exports, _ember, _emberDataPrivateSystemRelationshipsStateHasMany, _emberDataPrivateSystemRelationshipsStateBelongsTo, _emberDataPrivateSystemEmptyObject, _emberDataPrivateDebug) {
  var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

  function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

  var _get = _ember["default"].get;

  function shouldFindInverse(relationshipMeta) {
    var options = relationshipMeta.options;
    return !(options && options.inverse === null);
  }

  function createRelationshipFor(internalModel, relationshipMeta, store) {
    var inverseKey = undefined;
    var inverse = null;

    if (shouldFindInverse(relationshipMeta)) {
      inverse = internalModel.type.inverseFor(relationshipMeta.key, store);
    } else {
      (0, _emberDataPrivateDebug.runInDebug)(function () {
        internalModel.type.typeForRelationship(relationshipMeta.key, store);
      });
    }

    if (inverse) {
      inverseKey = inverse.name;
    }

    if (relationshipMeta.kind === 'hasMany') {
      return new _emberDataPrivateSystemRelationshipsStateHasMany["default"](store, internalModel, inverseKey, relationshipMeta);
    } else {
      return new _emberDataPrivateSystemRelationshipsStateBelongsTo["default"](store, internalModel, inverseKey, relationshipMeta);
    }
  }

  var Relationships = (function () {
    function Relationships(internalModel) {
      this.internalModel = internalModel;
      this.initializedRelationships = new _emberDataPrivateSystemEmptyObject["default"]();
    }

    // TODO @runspired deprecate this as it was never truly a record instance

    _createClass(Relationships, [{
      key: "has",
      value: function has(key) {
        return !!this.initializedRelationships[key];
      }
    }, {
      key: "get",
      value: function get(key) {
        var relationships = this.initializedRelationships;
        var internalModel = this.internalModel;
        var relationshipsByName = _get(internalModel.type, 'relationshipsByName');

        if (!relationships[key] && relationshipsByName.get(key)) {
          relationships[key] = createRelationshipFor(internalModel, relationshipsByName.get(key), internalModel.store);
        }

        return relationships[key];
      }
    }, {
      key: "record",
      get: function get() {
        return this.internalModel;
      }
    }]);

    return Relationships;
  })();

  exports["default"] = Relationships;
});