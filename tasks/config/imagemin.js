/**
 * Minify images.
 *
 * ---------------------------------------------------------------
 *
 * For usage docs see:
 *    https://github.com/gruntjs/grunt-contrib-imagemin
 */
module.exports = function (grunt) {

  grunt.config.set('imagemin', {
    options: {
      optimizationLevel: 3, // default:7 (very slow)
      pngquant: false,
      progressive: false,
    },
    dev: {
      files: [{
        expand: true,
        cwd: 'assets/images/',
        src: ['**/*.{png,jpg}', '!sprites/**', 'sprites/*.{png,jpg}'], // all files expect sprites src
        dest: 'assets/images/'
      }]
    },
    prod: {
      files: [{
        expand: true,
        cwd: 'assets/images/',
        src: ['**/*.{png,jpg}', '!sprites/**', 'sprites/*.{png,jpg}'], // all files expect sprites src
        dest: '.tmp/public/images/'
      }]
    }
  });

};
