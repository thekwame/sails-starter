var moment = require('moment'),
  utils = require('../utils');

module.exports = function (req, res, next) {

  /**
   * Moment.js date formatting initialization
   *
   * Assign a function `format_date` to req object
   * that is an instance of moment.js object
   * set to current language
   *
   * TODO Should this be a middleware ? It is attached to *every* request !!!
   *
   * @returns {formatDate}
   */

  req.format_date = function (val) {
    var singleton = moment(val),
      navLang = res.getLocale();

    singleton.lang(navLang);

    return singleton;
  };

  req.flash_alert = function (type, message) {
    if (!arguments.length) {
      return req.flash('alert')[0];
    }

    if (arguments.length === 1) {
      return req.flash('alert', {
        type: 'info',
        message: res.i18n(type)
      });
    }

    return req.flash('alert', {
      type: type,
      message: res.i18n(message)
    });
  };

  req.flash_alert = function (type, message) {
    if (!arguments.length) {
      return req.flash('alert')[0];
    }

    if (arguments.length === 1) {
      return req.flash('alert', {
        type: 'info',
        message: res.i18n(type)
      });
    }

    return req.flash('alert', {
      type: type,
      message: res.i18n(message)
    });
  };

  req._display_price = function (price, country, rateUSDtoEUR) {
    return utils.convertAndDisplayPrice(price, country, rateUSDtoEUR);
  };

  req.country_price = function (price, country, rateUSDtoEUR) {
    return utils.countryPrice(price, country, rateUSDtoEUR);
  };

  return next();

};
