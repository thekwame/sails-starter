/**
 * Run predefined tasks whenever watched file patterns are added, changed or deleted.
 *
 * ---------------------------------------------------------------
 *
 * Watch for changes on
 * - files in the `assets` folder
 * - the `tasks/pipeline.js` file
 * and re-run the appropriate tasks.
 *
 * For usage docs see:
 * 		https://github.com/gruntjs/grunt-contrib-watch
 *
 */

/*
 * Whether to spawn task runs in a child process.
 * Setting this option to false speeds up the reaction time of the watch (usually 500ms faster for most) and allows subsequent task runs to share the same context.
 * Not spawning task runs can make the watch more prone to failing so please use as needed.
 */

module.exports = function (grunt) {

  grunt.config.set('watch', {
    api: {
      // API files to watch:
      files: ['api/**/*']
    },

    // This task cannot use 'newer' as updates to imported dependencies are not picked up
    images: {
      options: {
        spawn: false,
        interrupt: true
      },
      files: [
        'assets/images/**/*.{png,jpg}'
      ],
      tasks: [
        'copy:images'
      ]
    },

    // This task cannot use 'newer' as updates to imported dependencies are not picked up
    styles: {
      options: {
        spawn: false,
        interrupt: true
      },
      files: [
        'assets/styles/**/*.scss'
      ],
      tasks: [
        'sass:dev'
      ]
    },
    // Transpile all ES6 modules and components. This task could use 'newer' but, as transpile is very
    // fast, it ends up being *slower* that just rebuilding everything
    modules: {
      options: {
        spawn: false
      },
      files: [
        'assets/scripts/modules/**/*.js',
      ],
      tasks: [
        'transpile:modules',
        'newer:concat:dev'
      ]
    },

    // Transpile all ES6 modules and components. This task could use 'newer' but, as transpile is very
    // fast, it ends up being *slower* that just rebuilding everything
    module_partials: {
      options: {
        spawn: false
      },
      files: [
        'assets/scripts/modules/**/_partials/**/*.hbs',
      ],
      tasks: [
        'newer:handlebars:modules',
        'newer:concat:dev'
      ]
    },

    apps: {
      options: {
        spawn: false
      },
      files: [
        'assets/scripts/*.js',
      ],
      tasks: [
        'newer:concat:dev'
      ]
    },

    // We can't use 'newer' here as the lang task doesn't use a src:files attribute
    locales: {
      files: [
        'assets/scripts/locales/**/*.json'
      ],
      tasks: [
        'i18next'
      ]
    }

  });

};
