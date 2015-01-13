/**
 * Lint Json files.
 *
 * ---------------------------------------------------------------
 *
 * For usage docs see:
 *    https://github.com/brandonramirez/grunt-jsonlint
 */
module.exports = function (grunt) {

  grunt.config.set('jsonlint', {
    build: {
      src: [
        'bower.json',
        'package.json',
        'config/**/*.json'
      ]
    }
  });

};
