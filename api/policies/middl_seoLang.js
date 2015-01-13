/**
 *  seoLang Policie
 *
 *  @description:
 *
 *  This filter validates that the language in the URL is supported, otherwise redirects to one that is:
 *  - If URL in language is supported, it will update res.locals, UI and Kasper context with language
 *  - If not, it will try to find the best language from the list of Accepted Languages sent by UA
 *  - If all fails, it will use fallback language
 *  On private pages, it will also update the language when user wants to change
 *
 *
 */

var url = require('url'),
  _ = require('lodash');

var isExists = function (array, key) {
  return _.indexOf(array, key) !== -1;
};

module.exports = function (req, res, next) {

  var config = req._sails.config,
    languagesList = config.i18n.locales,
    fallbackLanguage = config.i18n.defaultLocale,
    setLng = req.query.setLng,
    user = res.locals.user,
    pathname;

  if (req.path === '/favicon.ico' || req.path === '/robots.txt') {
    return next();
  }

  if (req.path === '/') {
    if (setLng) {
      sails.log.info('Home page with, trying to change the language through the setLgn param', {
        setLng: setLng
      });
      return res.redirect(url.format({
        protocol: req.protocol,
        host: req.headers.host,
        pathname: req.path + setLng + '/',
        query: _.omit(req.query, 'setLng')
      }));
    }
    return next();
  }

  var language = req.param('lang') ? req.param('lang').match(/^([a-z]{2})$/) : null;

  // Public pages must have language in URL
  if (!user && !language) {
    sails.log.info('Public page try to access to an url without a SEO friendly URL', {
      path: req.path
    });
    return res.notFound();
  }

  language = language[1] || fallbackLanguage;

  // Private pages with a SEO friendly URL, trying to change the language through the setLgn param
  // We redirect to URL with the lang param updated
  // wait user; if (user && setLng && language) {
  if (setLng && language) {

    if (isExists(languagesList, setLng)) {
      sails.log.info('Private page with a SEO friendly URL, trying to change the language through the setLgn param', {
        path: req.path,
        lang: language,
        setLng: setLng
      });

      if (req.path.match(/^\/([a-z]{2})$/)) {
        pathname = req.path.replace('/' + language, '/' + setLng + '/');
      } else {
        pathname = req.path.replace('/' + language + '/', '/' + setLng + '/');
      }

      return res.redirect(url.format({
        protocol: req.protocol,
        host: req.headers.host,
        pathname: pathname,
        query: _.omit(req.query, 'setLng')
      }));
    }

    sails.log.info('Private page with a SEO friendly URL, trying to change the language through a bad setLgn param', {
      path: req.path,
      lang: language,
      setLng: setLng
    });
    return next();
  }

  // Back to Public pages: does the languages in the URL is supported?
  if (isExists(languagesList, language)) {

    // Update UI language
    sails.log.info('Page with a SEO friendly URL, set the language', {
      path: req.path,
      lang: language
    });
    res.setLocale(language);
    res.locals.locale = language;
    res.cookie('locales', language, {
      maxAge: 1 * 24 * 60 * 60 * 1000,
      httpOnly: true
    });
    // If we don't support the language in the URL, redirect to page with supported language
    // It tries to use one of the accepted languages from the browser request
    // If it still can't find a supported language, it uses the fallback language
  } else {

    if (req.acceptedLanguages.length) {
      req.acceptedLanguages.some(function (lang) {
        lang = lang.substring(0, 2);
        if (isExists(languagesList, lang)) {
          fallbackLanguage = lang;
          return true;
        }
        return false;
      });
    }

    if (req.path.match(/^\/([a-z]{2})$/)) {
      pathname = req.path.replace('/' + language, '/' + fallbackLanguage + '/');
    } else {
      pathname = req.path.replace('/' + language + '/', '/' + fallbackLanguage + '/');
    }

    sails.log.info('Page with a SEO friendly URL, redirecting to page with supported language', {
      path: req.path,
      lang: language,
      fallbackLanguage: fallbackLanguage
    });

    return res.redirect(301, url.format({
      protocol: req.protocol,
      host: req.headers.host,
      pathname: pathname,
      query: req.query
    }));
  }

  next();
};
