/**
 * Compile CoffeeScript files to JavaScript.
 *
 * ---------------------------------------------------------------
 *
 * Compiles coffeeScript files from `assest/js` into Javascript and places them into
 * `.tmp/public/js` directory.
 *
 * For usage docs see:
 *    https://github.com/gruntjs/grunt-contrib-coffee
 */
module.exports = function (grunt) {

  grunt.config.set('i18next', {
    build: {
      server_target: '.tmp/locales',
      client_target: '.tmp/public/scripts/locales',
      options: {
        locales: ['en', 'fr'],
        global: 'translation'
      }
    }
  });

};
