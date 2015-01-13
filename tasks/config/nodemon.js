/**
 * Grunt task to run nodemon
 *
 * ---------------------------------------------------------------
 *
 * For usage docs see:
 *    https://github.com/ChrisWren/grunt-nodemon
 */
module.exports = function (grunt) {

  grunt.config.set('nodemon', {
    dev: {
      script: 'app.js',
      options: {
        nodeArgs: ['--debug'],
        ignore: ['assets/**', '.tmp'],
        ext: 'js,json,hbs',
        delay: 10,
        watch: [
          'api/**/*',
          'config/**/*',
          'views/_partials/*'
        ]
      }
    },
    prod: {
      script: 'app.js',
      options: {
        args: ['--prod'],
        nodeArgs: ['--debug'],
        ignore: ['assets/**', '.tmp'],
        ext: 'js,json,hbs',
        delay: 10,
        watch: [
          'api/**/*',
          'config/**/*',
          'views/_partials/*'
        ]
      }
    }
  });

};
