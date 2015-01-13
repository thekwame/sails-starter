var _ = require('lodash'),
  stack = {};

var helpers = {

  /**
   * Push a fragment of HTML onto a named stack
   *
   * @param name
   * @param context
   */
  push: function (name, context) {
    if (!name) {
      throw new Error('You called the #push helper without specifying a name');
    }

    var block = stack[name];
    if (!block) {
      block = stack[name] = [];
    }

    block.push(context.fn(this));
  },

  /**
   * Pop a fragment of HTML from a named stack
   *
   * @param name
   * @param context
   */
  pop: function (name) {
    if (!name) {
      throw new Error('You called the #pop helper without specifying a name');
    }

    var val = (stack[name] || []).join('\n');
    stack[name] = [];

    return val;
  },

  /**
   * Output the current context to the console
   *
   * @param value
   */
  debug: function (value) {
    console.log('Current Context');
    console.log('====================');
    console.log(this);

    if (value) {
      console.log('Value');
      console.log('====================');
      console.log(value);
    }
  }
};

/**
 * Register helpers in handlebars
 *
 * @param {Handlebars} Instance from require('hbs')
 */
exports.register = function (hbs) {

  // register helpers in handlebars
  _.forEach(helpers, function (helper, name) {
    hbs.registerHelper(name, helper);
  });
};

/**
 * Expose a function to allow the stack to be cleared. A middleware
 * function in the app should call this, to reset the stack between requests.
 */
exports.clearStack = function () {
  stack = {};
};
