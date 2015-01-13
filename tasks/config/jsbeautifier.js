/**
 * Beautify js, css, html and json files using Grunt and https://github.com/einars/js-beautify
 *
 * ---------------------------------------------------------------
 *
 * For usage docs see:
 *    https://github.com/vkadam/grunt-jsbeautifier
 */
module.exports = function (grunt) {

  grunt.config.set('jsbeautifier', {
    modify: {
      src: [
        'Gruntfile.js',
        'newrelic.js',
        'app.js',
        'tasks/**/*.js',
        'api/**/*.js',
        'config/**/*.js',
        'assets/**/*.js',
        '!assets/bower_components/**'
      ],
      options: {
        config: '.jsbeautifyrc',
        ignores: [
          'assets/bower_components/**'
        ]
      }
    },

    verify: {
      src: [
        'Gruntfile.js',
        'newrelic.js',
        'app.js',
        'tasks/**/*.js',
        'api/**/*.js',
        'config/**/*.js',
        'assets/**/*.js',
        '!assets/bower_components/**'
      ],
      options: {
        mode: 'VERIFY_ONLY',
        config: '.jsbeautifyrc'
      }
    }
  });

};
