var fs = require('fs'),
  path = require('path'),
  _ = require('lodash'),
  utils = require('./utils'),
  async = require('async'),
  LangError = require('./errors/LangError');

/**
 * A helper for building a single concatenated translation file, for each locale,
 * for the client- and server-side.
 */
function LangHelper(config) {
  this.app = config.app || '';
  this.externalComponents = config.external_components;
  this.externalComponentsGlob = config.external_components_glob;
  this.externalComponentsList = config.external_components_list;
  this.locales = config.locales;

  // Generated paths and settings
  this.appTranslations = path.resolve(this.app, 'assets/scripts/locales');

  // NOTE conditionals here is temporary, will be removed after project migration
  this.pageTranslations = path.resolve(this.app, 'assets/scripts/locales');
  this.components = path.resolve(this.app, 'assets/scripts/components');
  console.log(this.appTranslations);
  this.filesGlob = '**/!(~*).json';
  this.rootFileName = 'main';
}

/**
 * Builds a model of the client- and server-side translations
 */
LangHelper.prototype.build = function (done) {
  var _this = this,
    targets = [this.appTranslations, this.pageTranslations],
    server = {},
    client = {},
    json, comp, hasClientTranslations, rel, parent, locale, context, compName, page, isPageTranslation, compPath;

  // Initialise the obj with keys for each locale
  this.locales.forEach(function (locale) {
    server[locale] = {};
    client[locale] = {};
  });

  var callbacks = [];

  // Fetch all local component translations
  callbacks.push(function (next) {
    var compLocales = [];

    fs.readdir(_this.components, function (err, files) {
      if (err) {
        return next(null, compLocales);
      }

      files.forEach(function (file) {
        compPath = path.resolve(_this.components, file);
        if (file.charAt(0) !== '_' && fs.statSync(compPath).isDirectory()) {
          compLocales.push(path.resolve(compPath, 'lang'));
        }
      });

      next(null, compLocales);
    });
  });

  // Fetch all external component translations, if there are any
  callbacks.push(function (compLocales, next) {
    if (!_this.externalComponents || (!_this.externalComponentsList && !_this.externalComponentsGlob)) {
      return next(null, compLocales);
    }

    if (_this.externalComponentsList) {
      fs.readdir(_this.externalComponents, function (err, files) {
        if (err) {
          return next(err);
        }

        files.forEach(function (file) {
          compPath = path.resolve(_this.externalComponents, file);
          if (fs.statSync(compPath).isDirectory() && _this.externalComponentsList.indexOf(file) !== -1) {
            compLocales.push(path.resolve(compPath, 'lang'));
          }
        });
        next(null, compLocales);
      });
    } else if (_this.externalComponentsGlob) {
      utils.glob(_this.externalComponents, _this.externalComponentsGlob, {
        includeAll: true
      }, function (err, files) {
        if (err) {
          return next(err);
        }

        files.forEach(function (file) {
          if (fs.statSync(file).isDirectory()) {
            compLocales.push(path.resolve(file, 'lang'));
          }
        });
        next(null, compLocales);
      });
    }
  });

  // Build the server- and client-side translations
  callbacks.push(function (compLocales, next) {
    targets = targets.concat(compLocales);

    // Build the server- and client-side translations
    utils.glob(targets, _this.filesGlob, function (err, translations) {
      if (err) {
        return next(err);
      }

      try {
        translations.map(path.normalize).forEach(function (transPath) {
          compName = null;
          comp = null;
          page = null;
          isPageTranslation = false;

          // App-level localization
          if (transPath.indexOf(_this.appTranslations) !== -1) {
            parent = _this.appTranslations;
            rel = path.relative(parent, transPath);
          }
          // Page-level localization
          else if (transPath.indexOf(_this.pageTranslations) !== -1) {
            parent = _this.pageTranslations;
            rel = path.relative(parent, transPath);

            isPageTranslation = true;
          }
          // Local component locales
          else if (transPath.indexOf(_this.components) !== -1) {
            parent = path.relative(_this.components, transPath);
            parent = parent.split(path.sep);

            compName = parent[0];
            rel = parent.slice(2, parent.length).join(path.sep);
          }
          // External component locales
          else if (transPath.indexOf(_this.externalComponents) !== -1) {
            parent = path.relative(_this.externalComponents, transPath);
            parent = parent.split(path.sep);

            compName = parent[0];
            rel = parent.slice(2, parent.length).join(path.sep);
          }

          locale = rel.substr(0, rel.indexOf(path.sep));
          rel = rel.substr(rel.indexOf(locale) + locale.length + 1);

          if (server[locale]) {
            if (compName) {
              comp = {};
              comp[compName] = {};
              context = comp[compName];
            } else if (isPageTranslation) {
              page = {};
              context = page;
            } else {
              context = server[locale];
            }

            if (rel === (_this.rootFileName + '.json')) {
              try {
                json = require(transPath);
              } catch (e) {
                throw new LangError('An error occurred reading the root localization JSON file ' + transPath + ' Error: ' + e.message);
              }
              _.merge(context, json);
            } else {
              _.merge(context, _this._buildSubJSON(transPath, rel));
            }

            if (comp) {
              hasClientTranslations = true;
              if (!client[locale].comp) {
                client[locale].comp = {};
              }
              _.merge(client[locale].comp, comp);
            } else if (isPageTranslation) {
              hasClientTranslations = true;
              if (!client[locale].page) {
                client[locale].page = {};
              }
              _.merge(client[locale].page, page);
            }
          }
        });
      } catch (e) {
        return next(e);
      }

      var result = {
        server: server
      };

      if (hasClientTranslations) {
        _.merge(result.server, client);
        result.client = client;
      }

      next(null, result);
    });
  });

  async.waterfall(callbacks, done);
};

/**
 * Build a JSON sub-structure.
 *
 * @param transPath
 * @param relPath
 * @returns {{}}
 * @private
 */
LangHelper.prototype._buildSubJSON = function (transPath, relPath) {
  var root = {},
    _this = this,
    context = root,
    json, parts;

  parts = relPath.split(path.sep);
  parts.forEach(function (part) {
    if (path.extname(part) !== '.json') {
      context[part] = {};
      context = context[part];
    } else {
      part = path.basename(part, '.json');

      if (part !== _this.rootFileName) {
        context[part] = {};
        context = context[part];
      }

      try {
        json = require(transPath);
      } catch (e) {
        throw new LangError('An error occurred reading the root localization JSON file ' + transPath + ' Error: ' + e.message);
      }

      _.merge(context, json);
    }
  });

  return root;
};

exports = module.exports = LangHelper;
