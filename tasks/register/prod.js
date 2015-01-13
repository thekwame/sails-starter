module.exports = function (grunt) {
  grunt.registerTask('prod', [
    'validate',
    'compileAssets',
    'cssmin',
    'imagemin:prod',
    'strip',
    'uglify',
    'hash'
  ]);
};
