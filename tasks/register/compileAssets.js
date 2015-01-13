module.exports = function (grunt) {
  grunt.registerTask('compileAssets', [
    'clean:dev',
    'sass:dev',
    'es6',
    'handlebars',
    'i18next',
    'copy:dev',
    'concat:dev'
  ]);
};
