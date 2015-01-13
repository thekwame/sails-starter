/**
 * Handlebars helpers
 *
 * Allow global registration of all helpers or export, one by one, each helpers
 *
 */
var fs = require('fs'),
  path = require('path');

var helpers = {};
var Helpers;
exports = module.exports = function () {
  return Helpers;
};

// load all helpers located in '/helpers' folder
fs.readdirSync(__dirname).forEach(function (filename) {
  if (!/\.js$/.test(filename)) {
    return;
  }

  var name = path.basename(filename, '.js');

  function loadHelper() {
    return require('./' + name);
  }

  helpers[name] = loadHelper();
  exports.__defineGetter__(name, loadHelper);
});

// allow global registration and consultation of existing helpers
Helpers = {
  /**
   * List all helpers
   *
   * @return {Array} Array of string containing names of each helpers
   */
  listAll: function () {
    var names = [];
    for (var name in helpers) {
      names.push(name);
    }

    return names;
  },

  /**
   * Register all helpers in one call
   *
   * @param {Handlebars} Handlebars instance
   * @param {Object} Meta configration object
   *
   * @return {Array} same as listAll() method
   */
  registerAll: function (hbs, config) {
    // sanity check
    if (typeof hbs !== 'object') {
      throw new Error('Expecting first parameter to be an instance of Handlebars');
    }
    config = config || {};

    for (var name in helpers) {
      helpers[name].register(hbs, config[name] || null);
    }

    return this.listAll();
  }
};
