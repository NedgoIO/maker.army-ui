define('makerarmy/tests/test-helper', ['exports', 'makerarmy/tests/helpers/resolver', 'ember-qunit'], function (exports, _makerarmyTestsHelpersResolver, _emberQunit) {

  (0, _emberQunit.setResolver)(_makerarmyTestsHelpersResolver['default']);
});