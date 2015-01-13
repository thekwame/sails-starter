/**
 *  Init Languages
 *
 *  @description:
 *
 * languages meta-data
 *
 * Initialize languages, inside middleware to retrieve dynamic navLang (from res.getLocale())
 *  - expose languages (all available languages)
 *  - expose these values on res object
 *
 * Updates locals (res.locals)
 *
 */

var url = require('url'),
  _ = require('lodash');

module.exports = function (req, res, next) {

  var config = req._sails.config,
    navLang = res.getLocale(),
    languages = config.i18n.languages;

  if (!_.isString(navLang) || _.isEmpty(navLang)) {
    sails.log.warn('No current language found', {
      navLang: navLang,
      languages: languages,
      path: req.path
    });
  }

  _.forEach(languages, function (lang) {
    lang.current = (lang.code === navLang);
  });

  res.locals.languages = languages;

  next();
};
