/**
 * Handlebars Misc helpers
 *
 */
var _ = require('lodash'),
  path = require('path'),
  numeral = require('numeral'),
  hbs = require('hbs'),
  utils = require(path.resolve('api/utils'));

/**
 * Helpers
 */
var helpers = {

  /**
   *  'nthItem'
   *  =========
   *
   *  Description
   *  -----------
   *
   *  Show a block only for specific nth item in an iterator.
   *
   *  Use case:
   *    You have an iterator in your template with a list of 12 items.
   *    But you only want to display something for every 3rd item. (3, 6, 9 and 12)
   *
   *  Usage
   *  -----
   *
   *  First parameter is iteration index
   *  Second parameter is the number of the nth item wanted
   *
   *  {{#each itemsList}}
   *    {{#nthItem @index 3}}
   *      Will be displayed *only* for every third item!
   *    {{/nthItem}}
   *  {{/each}}
   *
   *  Also works with an {{else}} statement
   *
   */
  nthItem: function (index, position, options) {

    if (typeof index !== 'number' || typeof position !== 'number') {
      throw new Error(
        'Waiting for an index and a position parameters as numbers'
      );
    }

    var modulo = (index + 1) % position;

    if (!modulo) {
      return options.fn(this);
    } else {
      return options.inverse(this);
    }
  },

  /**
   *  'mergeContexts'
   *  ===============
   *
   *  Description
   *  -----------
   *
   *  In Handlebars, when you are in a {{each}} block, you loose the root context.
   *  See this open issue: https://github.com/wycats/handlebars.js/issues/392
   *
   *  We have Helpers that depends on the root context (eg. {{route}} ).
   *  The mergeContexts helper allows to merge the current context with a parent context.
   *  BEWARE: there might be property name collisions.
   *
   *  Usage
   *  -----
   *
   *  {{#each items}}
   *    {{#mergeContexts parent=..}}
   *      {{route …}}
   *    {{/mergeContexts}}
   *  {{/each}}
   *
   */
  mergeContexts: function (options) {
    return options.fn(_.merge({}, this, options.hash.parent));
  },

  /**
   *  'set'
   *  ===============
   *
   *  Description
   *  -----------
   *
   *  Truncate a string
   *
   *  Usage
   *  -----
   *
   *  {{truncate stringvariable 10 '...'}}
   *
   */

  truncate: function (ressource, length, dots) {
    if (!_.isString(ressource) || _.isEmpty(ressource)) {
      throw new Error('truncate#helper: The ressource agurments must be a string');
    }

    if (!_.isNumber(length)) {
      throw new Error('truncate#helper: The length agurments must be a number');
    }

    if (!_.isString(dots)) {
      dots = '';
    }

    if (ressource.length <= length) {
      return ressource;
    }

    var str = ressource + ' ';
    str = ressource.substr(0, length);
    str = ressource.substr(0, str.lastIndexOf(' '));
    str = (str.length > 0) ? str : ressource.substr(0, length);
    return new hbs.SafeString(str + dots);
  },

  /**
   *  'set'
   *  ===============
   *
   *  Description
   *  -----------
   *
   *  Set a variable in the current context
   *
   *  Usage
   *  -----
   *
   *  {{#set 'termsroute'}}
   *     {{route 'about.terms' lang=locale}}
   *  {{/set}}
   *
   */

  set: function (ressource, options) {
    if (!_.isString(ressource) || _.isEmpty(ressource)) {
      throw new Error('The ressource agurments must be passed to the "set" helper and it must be a string');
    }

    this[ressource] = options.fn(this);
  },

  /**
   *  'eq'
   *  ===============
   *
   *  Description
   *  -----------
   *
   *  compare an equality
   *
   *  Usage
   *  -----
   *
   *  {{#eq stringvariable 'string'}}
   *     do something
        {{else}}
        do something else
   *  {{/eq}}
   *
   */

  eq: function (lvalue, rvalue, options) {
    if (arguments.length < 3) {
      throw new Error('Handlebars Helper equal needs 2 parameters');
    }
    if (lvalue === rvalue) {
      return options.fn(this);
    }
    return options.inverse(this);
  },

  /**
   *  'numeral'
   *  ===============
   *
   *  Description
   *  -----------
   *
   *  format number: add comma at each thousands
   *
   *  Usage
   *  -----
   *
   *  {{#set 'termsroute'}}
   *     {{route 'about.terms' lang=locale}}
   *  {{/set}}
   *
   */

  numeral: function (ressource) {
    if (isNaN(Number(ressource))) {
      throw new Error('The ressource agurments must be passed to the "splitNumber" helper and it must be a string or a number');
    }

    return numeral(ressource).format('0,0');
  },

  displayPrice: function (price, country, rateUSDtoEUR) {
    if (!_.isNumber(price)) {
      throw new Error('displayPrice#helper: The price agurment must be a number');
    }

    if (!_.isString(country)) {
      throw new Error('displayPrice#helper: The country agurment must be a string');
    }

    if (!_.isNumber(rateUSDtoEUR)) {
      rateUSDtoEUR = null;
    }
    return new hbs.SafeString(utils.convertAndDisplayPrice(price, country, rateUSDtoEUR));
  },

  displayCurrency: function (country) {
    if (!_.isString(country)) {
      throw new Error('displayCurrency#helper: The country agurment must be a string');
    }
    return new hbs.SafeString(utils.displayCurrency(country));
  }

};

/**
 * Register helpers in handlebars
 *
 * @param {hbs} Instance from require('hbs')
 */
module.exports.register = function (hbs) {

  // register helpers in handlebars
  _.forEach(helpers, function (helper, name) {
    hbs.registerHelper(name, helper);
  });
};
