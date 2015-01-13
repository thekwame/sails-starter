// JS packaging
var modules = {

  // Main package
  '.tmp/public/scripts/main.js': [
    // main vendors
    'assets/bower_components/jquery/jquery.js',
    'assets/bower_components/handlebars/handlebars.js',
    'assets/bower_components/i18next/i18next.js',
    'assets/bower_components/underscore/underscore.js',
    'assets/bower_components/amd-loadr/loadr.js',
    'assets/bower_components/backbone/backbone.js',
    'assets/bower_components/backbone-validation/dist/backbone-validation.js',

    // boostrap vendors
    'assets/bower_components/bootstrap-sass-official/assets/javascripts/bootstrap/transition.js',
    'assets/bower_components/bootstrap-sass-official/assets/javascripts/bootstrap/dropdown.js',
    'assets/bower_components/bootstrap-sass-official/assets/javascripts/bootstrap/tooltip.js',
    'assets/bower_components/bootstrap-sass-official/assets/javascripts/bootstrap/button.js',
    'assets/bower_components/bootstrap-sass-official/assets/javascripts/bootstrap/collapse.js',

    // main modules
    'assets/scripts/main.js',

    '.tmp/transpile/modules/app.js',
    '.tmp/transpile/modules/main/**/*.js'
  ],

  // HTML 5 Shiv, JSON Polyfill, CSS3 Polyfill
  '.tmp/public/scripts/polyfill.js': [
    'assets/bower_components/html5shiv/dist/html5shiv.js',
    'assets/bower_components/json2/json2.js',
    'assets/bower_components/respond/dest/respond.src.js'
  ],

  // landing page
  '.tmp/public/scripts/landing.js': [
    'assets/bower_components/skrollr/src/skrollr.js',
    'assets/bower_components/jquery.countdown/dist/jquery.countdown.js',
    '.tmp/transpile/modules/landing.js',
    '.tmp/transpile/modules/landing/*.js'
  ],

  // results page
  '.tmp/public/scripts/results.js': [
    '.tmp/transpile/modules/results.js',
    '.tmp/transpile/modules/results/*.js'
  ],

  // game page
  '.tmp/public/scripts/game.js': [
    'assets/bower_components/backbone.marionette/lib/backbone.marionette.js',
    '.tmp/transpile/modules/game.js',
    '.tmp/transpile/modules/game/**/*.js'
  ]

};

module.exports = modules;
