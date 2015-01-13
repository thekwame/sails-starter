/**
 * Internationalization / Localization Settings
 * (sails.config.i18n)
 *
 * If your app will touch people from all over the world, i18n (or internationalization)
 * may be an important part of your international strategy.
 *
 *
 * For more informationom i18n in Sails, check out:
 * http://sailsjs.org/#/documentation/concepts/Internationalization
 *
 * For a complete list of i18n options, see:
 * https://github.com/mashpie/i18n-node#list-of-configuration-options
 *
 *
 */

module.exports.i18n = {

  /****************************************************************************
   *                                                                           *
   * Translation lists, i18n also supports hierarchical translation            *
   * catalogs.                                                                 *
   *                                                                           *
   ****************************************************************************/

  objectNotation: false,

  /***************************************************************************
   *                                                                          *
   * Which locales are supported?                                             *
   *                                                                          *
   ***************************************************************************/

  locales: ['en', 'fr'],

  /****************************************************************************
   *                                                                           *
   * What is the default locale for the site? Note that this setting will be   *
   * overridden for any request that sends an "Accept-Language" header (i.e.   *
   * most browsers), but it's still useful if you need to localize the         *
   * response for requests made by non-browser clients (e.g. cURL).            *
   *                                                                           *
   ****************************************************************************/

  defaultLocale: 'en',

  /****************************************************************************
   *                                                                           *
   * Automatically add new keys to locale (translation) files when they are    *
   * encountered during a request?                                             *
   *                                                                           *
   ****************************************************************************/

  // updateFiles: false,

  /****************************************************************************
   *                                                                           *
   * Path (relative to app root) of directory to store locale (translation)    *
   * files in.                                                                 *
   *                                                                           *
   ****************************************************************************/

  // localesDirectory: '/config/locales'

  // sets a custom cookie name to parse locale settings from  - defaults to NULL
  // refers to api/policies/seoLang.js

  cookie: 'locales',

  // humanize languages
  languages: {
    'en': {
      code: 'en',
      name: 'English'
    },
    'fr': {
      code: 'fr',
      name: 'Français'
    }
  }
};
