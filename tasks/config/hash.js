/**
 * Hash files;
 * Append a unique hash to the end of a filename for cache busting. For example:
 * examples/test1.js => examples/dist/test1.b93fd451.js
 *
 * ---------------------------------------------------------------
 *
 * For usage docs see:
 *    https://github.com/jgallen23/grunt-hash
 */
module.exports = function (grunt) {

  grunt.config.set('hash', {
    options: {
      mapping: 'config/assets.json',
      srcBasePath: '.tmp/public',
      destBasePath: '.tmp/public',
      flatten: false
    },
    scripts: {
      src: ['.tmp/public/scripts/*.js'],
      dest: '.tmp/public/scripts'
    },
    styles: {
      src: '.tmp/public/styles/*.css',
      dest: '.tmp/public/styles'
    },
    trad: {
      src: '.tmp/public/scripts/locales/translation.js',
      dest: '.tmp/public/scripts/locales'
    }
  });

};
