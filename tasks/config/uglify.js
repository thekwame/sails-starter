/**
 * Minify files with UglifyJS.
 *
 * ---------------------------------------------------------------
 *
 * Minifies client-side javascript `assets`.
 *
 * For usage docs see:
 * 		https://github.com/gruntjs/grunt-contrib-uglify
 *
 */
module.exports = function (grunt) {

  grunt.config.set('uglify', {
    options: {
      preserveComments: false,
      compress: {
        dead_code: true
      }
    },
    dist: {
      files: [{
        expand: true,
        cwd: '.tmp/public/scripts/',
        src: ['*.js'],
        dest: '.tmp/public/scripts/',
        ext: '.js'
      }]
    }
  });

};
