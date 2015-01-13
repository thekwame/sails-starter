/**
 * Validate files with JSHint.
 *
 * ---------------------------------------------------------------
 *
 * For usage docs see:
 *    https://github.com/gruntjs/grunt-contrib-jshint
 */
module.exports = function (grunt) {

  grunt.config.set('jshint', {
    app: {
      src: [
        'config/**/*.js',
        'api/**/*.js'
      ],
      options: {
        jshintrc: '.node.jshintrc',
        ignores: [
          'assets/**'
        ]
      }
    },

    front: {
      src: [
        'assets/scripts/**/*.js'
      ],
      options: {
        jshintrc: '.jshintrc',
        ignores: [
          'assets/bower_components/**'
        ]
      }
    },

    tooling: {
      src: [
        'Gruntfile.js',
        'newrelic.js',
        'app.js',
        'tasks/**/*.js'
      ],
      options: {
        jshintrc: '.node.jshintrc'
      }
    }
  });

};
