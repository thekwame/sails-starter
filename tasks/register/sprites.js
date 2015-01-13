module.exports = function (grunt) {
  grunt.registerTask('sprites', [
    'compass:sprites',
    'copy:sprites'
  ]);
};
