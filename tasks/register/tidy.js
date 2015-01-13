module.exports = function (grunt) {
  grunt.registerTask('tidy', 'Run the jsbeautifier modify task', [
    'jsbeautifier:modify'
  ]);
};
