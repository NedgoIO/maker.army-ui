define("ember-data/-private/system/relationships/ext", ["exports", "ember", "ember-data/-private/debug", "ember-data/-private/system/relationship-meta"], function (exports, _ember, _emberDataPrivateDebug, _emberDataPrivateSystemRelationshipMeta) {

  var Map = _ember["default"].Map;
  var MapWithDefault = _ember["default"].MapWithDefault;

  var relationshipsDescriptor = _ember["default"].computed(function () {
    if (_ember["default"].testing === true && relationshipsDescriptor._cacheable === true) {
      relationshipsDescriptor._cacheable = false;
    }

    var map = new MapWithDefault({
      defaultValue: function defaultValue() {
        return [];
      }
    });

    // Loop through each computed property on the class
    this.eachComputedProperty(function (name, meta) {
      // If the computed property is a relationship, add
      // it to the map.
      if (meta.isRelationship) {
        meta.key = name;
        var relationshipsForType = map.get((0, _emberDataPrivateSystemRelationshipMeta.typeForRelationshipMeta)(meta));

        relationshipsForType.push({
          name: name,
          kind: meta.kind
        });
      }
    });

    return map;
  }).readOnly();

  exports.relationshipsDescriptor = relationshipsDescriptor;
  var relatedTypesDescriptor = _ember["default"].computed(function () {
    var _this = this;

    if (_ember["default"].testing === true && relatedTypesDescriptor._cacheable === true) {
      relatedTypesDescriptor._cacheable = false;
    }

    var modelName;
    var types = _ember["default"].A();

    // Loop through each computed property on the class,
    // and create an array of the unique types involved
    // in relationships
    this.eachComputedProperty(function (name, meta) {
      if (meta.isRelationship) {
        meta.key = name;
        modelName = (0, _emberDataPrivateSystemRelationshipMeta.typeForRelationshipMeta)(meta);

        (0, _emberDataPrivateDebug.assert)("You specified a hasMany (" + meta.type + ") on " + meta.parentType + " but " + meta.type + " was not found.", modelName);

        if (!types.includes(modelName)) {
          (0, _emberDataPrivateDebug.assert)("Trying to sideload " + name + " on " + _this.toString() + " but the type doesn't exist.", !!modelName);
          types.push(modelName);
        }
      }
    });

    return types;
  }).readOnly();

  exports.relatedTypesDescriptor = relatedTypesDescriptor;
  var relationshipsByNameDescriptor = _ember["default"].computed(function () {
    if (_ember["default"].testing === true && relationshipsByNameDescriptor._cacheable === true) {
      relationshipsByNameDescriptor._cacheable = false;
    }

    var map = Map.create();

    this.eachComputedProperty(function (name, meta) {
      if (meta.isRelationship) {
        meta.key = name;
        var relationship = (0, _emberDataPrivateSystemRelationshipMeta.relationshipFromMeta)(meta);
        relationship.type = (0, _emberDataPrivateSystemRelationshipMeta.typeForRelationshipMeta)(meta);
        map.set(name, relationship);
      }
    });

    return map;
  }).readOnly();
  exports.relationshipsByNameDescriptor = relationshipsByNameDescriptor;
});