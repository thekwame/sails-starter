module.exports = function (grunt) {
  grunt.registerTask('buildProd', [
    'validate',
    'compileAssets',
    'cssmin',
    'imagemin',
    'strip',
    'uglify',
    'hash',
    'clean:build',
    'copy:build'
  ]);
};
