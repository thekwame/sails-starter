/**
 * Create spritesheet.
 *
 * ---------------------------------------------------------------
 *
 * For usage docs see:
 *    https://github.com/gruntjs/grunt-contrib-compass
 */
module.exports = function (grunt) {

  grunt.config.set('compass', {
    sprites: {
      options: {
        clean: false,
        noLineComments: true,
        imagesDir: 'assets/images/sprites/',
        imagesPath: 'assets/images/sprites/',
        generatedImagesDir: 'assets/images/sprites/',
        httpGeneratedImagesPath: '/images/sprites/',
        sassDir: 'assets/styles/sprites/',
        specify: 'assets/styles/sprites/package.scss',
        cssDir: '.tmp/compass'
      }
    }
  });

};
