/**
 * Handlebars route helpers
 *
 */
var _ = require('lodash');

/*
 * Options (default options and validation method)
 */
var options;
var defaultOptions = {};

var validateOptions = function (opts) {
  options = _.merge({}, defaultOptions, opts);
  // Checks
  if (!_.isPlainObject(options.routes)) {
    throw new Error('The routes option must be passed to init the helper and it must be a plain object.');
  }
};

/**
 * Helpers
 */
module.exports = {

  /**
   *  'route'
   *  =========
   *
   *  Description
   *  -----------
   *
   *  Display a route app.
   *
   *  Usage
   *  -----
   *
   *  {{#route 'about'}}
   *  {{#route 'user' id=id name=name}}
   */
  route: function (resource, obj) {

    var args = [].slice.call(arguments);

    if (_.isEmpty(args)) {
      throw new Error('The "route" helper was called with no arguments');
    }

    if (!_.isString(resource)) {
      throw new Error('The "route" helper path must be a string');
    }

    var routes = options.routes,
      params = {
        controller: resource.split('.')[0] || '',
        action: resource.split('.')[1] || ''
      },
      targetRoute = this.capitalize(params.controller) + 'Controller.' + params.action;

    var uri = _.findKey(routes, function (target) {
      // catch uri with string target
      // 'get /login': 'AuthController.login'
      if (_.isString(target) && _.isEqual(target, targetRoute)) {
        return true;
      }
      // catch uri with object target
      // '/:lang/game': {
      //   controller: 'game',
      //   action: 'index'
      // }
      if (_.isEqual(target.controller, params.controller) && _.isEqual(target.action, params.action)) {
        return true;
      }
      return undefined;
    });

    if (!_.isString(uri)) {
      throw new Error('The "route" helper ' + resource + ' could not be found; \n' +
        'Controller and action in config.routes are required ; \n' +
        'Example :{{route \'about.index\'}} about:controller index:action'
      );
    }

    // catch uri with method
    // 'get /login': 'AuthController.login'
    var uriAfterMethod = uri.split(' ')[1];
    if (_.isString(uriAfterMethod)) {
      uri = uriAfterMethod;
    }

    // If has been passed a simple String as a parameter.
    if (args.length > 1 && _.isString(args[1])) {
      throw new Error('The "route" helper must receive an optional sequence of key-value pairs');
    }

    // If empty parameters in helper
    if (_.isEmpty(obj.hash)) {
      return uri;
    }

    // reverse route from uri pattern
    return this.reverse(uri, obj.hash);

  },

  reverse: function (url, obj) {
    return url.replace(/(\/:\w+\??)/g, function (m, c) {
      c = c.replace(/[/:?]/g, '');
      return obj[c] ? '/' + obj[c] : '';
    });
  },

  capitalize: function (s) {
    return s[0].toUpperCase() + s.slice(1);
  },

  register: function (hbs, options) {
    // sanity check on options
    validateOptions(options);

    var _this = this;
    hbs.registerHelper('route', function () {
      return _this.route.apply(_this, arguments);
    });
  },

  getRouteHelper: function (options) {
    // sanity check on options
    validateOptions(options);
    return this.route.bind(this);
  },

};
