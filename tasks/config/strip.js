/**
 * Strip JavaScript nodes (like console.*) out of your source code
 *
 * ---------------------------------------------------------------
 *
 * For usage docs see:
 *    https://github.com/jsoverson/grunt-strip
 */
module.exports = function (grunt) {

  grunt.config.set('strip', {
    prod: {
      src: '.public/scripts/*.js',
      options: {
        inline: true,
        nodes: ['console.log', 'console.info', 'console.warn']
      }
    }
  });

};
