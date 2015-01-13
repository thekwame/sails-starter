/**
 * Pulls the language from the URL, expecting it to be in the format brand.com/fr
 * Otherwise, it falls back to English (en).
 */
var lang = window.location.pathname.split('/');
lang = (lang.length > 1) ? lang[1] : 'en';

$.i18n.init({
  debug: false,
  resStore: window.translation,
  lng: lang,
  fallbackLng: 'en',
  useCookie: false,
  lowerCaseLng: true
});

Handlebars.registerHelper('t', function (key, args) {
  if (args.hash) {
    // Context must always be a String
    if (args.hash.context) {
      args.hash.context += '';
    }

    return new Handlebars.SafeString($.t(key, args.hash));
  }

  return new Handlebars.SafeString($.t(key));
});

// Add string trim for IE8.
if (typeof String.prototype.trim !== 'function') {
  String.prototype.trim = function () {
    return this.replace(/^\s+|\s+$/g, '');
  };
}

// Setup CSRF sending on jQuery
var meta = $('meta[name=csrf-token]');
$.ajaxPrefilter(function (options, originalOptions, jqXHR) {
  var type = options.type.toLowerCase();
  if (type === 'post' ||  type === 'put' ||  type === 'delete') {
    jqXHR.setRequestHeader('x-csrf-token', meta.attr('content'));
  }
});
