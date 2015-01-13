var path = require('path'),
  LangHelper = require('./i18next/lib/LangHelper');

module.exports = function (grunt) {
  grunt.registerMultiTask('i18next', 'Log stuff.', function () {

    var _this = this,
      done = this.async(),
      langHelper = new LangHelper({
        app: this.data.app,
        external_components: this.data.external_components,
        external_components_glob: this.data.options.external_components_glob,
        external_components_list: this.data.options.external_components_list,
        locales: this.data.options.locales
      });

    langHelper.build(function (err, translations) {
      if (err) {
        grunt.log.error();
        grunt.verbose.error(err);
        grunt.fail.warn('An error occurred when writing translation files to staging');
        return false;
      }

      var serverLang = translations.server,
        clientLang = translations.client,
        serverTarget = _this.data.server_target,
        clientTarget = _this.data.client_target,
        global = _this.data.options.global || 'translation',
        clientTranslationFile = path.resolve(clientTarget, 'translation.js'),
        resources = {},
        filepath;

      Object.keys(serverLang).forEach(function (locale) {
        grunt.log.write('Writing locale %s', locale, '...');
        // Build a single client-side JavaScript file
        resources[locale] = {
          translation: serverLang[locale]
        };
        grunt.log.ok();
      });

      grunt.file.write(clientTranslationFile, 'window.' + global + ' = ' + JSON.stringify(resources) + ';', {
        encoding: 'utf8'
      });

      done();
    });
  });
};
