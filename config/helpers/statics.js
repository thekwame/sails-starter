/**
 * Handlebars CDN Statics helpers
 */
var _ = require('lodash'),
  fs = require('fs');

/*
 * Options (default options and validation method)
 */
var options,
  mapping,
  defaultOptions = {};

var validateOptions = function (opts) {
  options = _.merge({}, defaultOptions, opts);

  // Checks
  if (!_.isArray(options.hostname)) {
    throw new Error('The hostname option must be passed to init the helper and it must be an array.');
  }
  if (!_.isString(options.mapping)) {
    throw new Error('The mapping option must be passed to init the helper and it must be a string.');
  }
  if (!_.isString(options.environment)) {
    throw new Error('The environment option must be passed to init the helper and it must be a string.');
  }

  if (fs.existsSync(options.mapping)) {
    mapping = JSON.parse(fs.readFileSync(options.mapping).toString());
  } else {
    mapping = {};
    // production statics mapping
    sails.log.warn('helpers#statics: options.mapping file not found!', options.mapping);
  }

};

/**
 * Helpers
 */
var helpers = {

  /**
   *  'statics'
   *  =========
   *
   *  Description
   *  -----------
   *
   *  Handlebars helper added to manage CDN and cache-busting of files from a
   *  centralized file (assets.json).
   *
   *  These resources are :
   *  - fonts, from _staging/public/fonts
   *  - styles, from _staging/public/styles
   *  - scripts, from _staging/public/scripts
   *  - locales, from _staging/public/locales
   *  - images, from _staging/public/images
   *
   *  This strategy has proven to be the most efficient and unitary to manage
   *  cached resources (if one file change, we only update this file, the rest
   *  stay the same and stay cached).
   *
   *  Usage
   *  -----
   *
   *  {{statics <String::url path/to/resource>}}
   *
   *  In a hbs template : {{statics '/scripts/main.js'}}
   *
   *  This may output (for production) with hostname 'cdn.brand.com':
   *
   *  => //cdn.brand.com/scripts/main.c83b3e48.js
   *
   *  This may output (for production) without hostname:
   *
   *  => /scripts/main.c83b3e48.js
   *
   *  This may output (for development):
   *
   *  => /scripts/main.js
   *
   * @param {String::url} path to static resource
   * @return {String::url} CDN-ized url ready for cache-busting yay
   */
  statics: function (resource) {

    // Check if resource is a string
    if (typeof resource !== 'string') {
      throw new Error('The statics resource path must be a string');
    }

    var hostname;

    if (this.staticHttpsHostname) {
      hostname = options.hostnameHttps[0] && options.hostnameHttps[0].trim();
    } else {
      hostname = options.hostname[0] && options.hostname[0].trim();
    }

    // trim and remove starting slash
    var url = resource.trim();
    if (url.charAt(0) === '/') {
      url = url.substr(1);
    }

    var environment = options.environment;
    if (environment === 'development') {
      return '/' + url;
    }

    // substitute specific assets urls?
    _.forIn(mapping, function (finalUrl, alias) {
      if (alias === url) {
        url = finalUrl;
        return;
      }
    });

    // hostname is empty?
    if (_.isEmpty(hostname)) {
      return '/' + url;
    }

    return '//' + hostname + '/' + url;
  }
};

/**
 * Register helpers in handlebars
 *
 * @param {Handlebars} Instance from require('hbs')
 * @param {Object} Options (will be merge with default options)
 *
 * Expected options are:
 * {
 *   mapping => JSON of static files and their hashed version,
 *   hostname => hostname depending on envrionment
 * }
 */
module.exports.register = function (hbs, options) {

  // sanity check on options
  validateOptions(options);

  // register helpers in handlebars
  _.forEach(helpers, function (helper, name) {
    hbs.registerHelper(name, helper);
  });
};
