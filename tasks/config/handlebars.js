var path = require('path');

module.exports = function (grunt) {

  grunt.config.set('handlebars', {
    options: {
      namespace: 'Templates',
      partialsUseNamespace: true,
      partialRegex: /./,
      processPartialName: function processPartialName(partialPath) {
        var rel, name,
          scripts = path.normalize('assets/scripts/modules');

        // Make the path separators consistent
        partialPath = path.normalize(partialPath);

        if (partialPath.indexOf(scripts) !== -1) {
          name = path.dirname(path.relative(scripts, partialPath));
        }

        if (name) {
          name = (name !== '.') ? name + '/' : '';
          name = name.replace(/\\/g, '/');
          name += path.basename(partialPath, '.hbs');
        }

        return name;
      }
    },
    modules: {
      expand: true,
      cwd: 'assets/scripts/modules',
      src: ['**/_partials/**/*.hbs'],
      dest: '.tmp/transpile/modules',
      ext: '.js'
    }
  });

};
