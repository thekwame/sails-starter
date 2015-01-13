module.exports = function (grunt) {
  grunt.registerTask('default', ['validate', 'compileAssets', 'concurrent:dev']);
};
