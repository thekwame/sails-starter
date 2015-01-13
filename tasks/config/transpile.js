/**
 * Processing ES6 module import/export syntax into one of AMD, CommonJS, YUI or globals using the es6-module-transpiler.
 * Also allows you to temporarily enable ES6 modules for other tasks.
 *
 * ---------------------------------------------------------------
 *
 * For usage docs see:
 *    https://github.com/joefiorini/grunt-es6-module-transpiler
 *
 */
module.exports = function (grunt) {

  grunt.config.set('transpile', {
    // Transpile all modules
    modules: {
      type: 'amd',
      files: [{
        expand: true,
        cwd: 'assets/scripts/modules/',
        src: ['**/*.js'],
        dest: '.tmp/transpile/modules'
      }]
    }
  });

};
