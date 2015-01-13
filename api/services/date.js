function sortByKey(s) {
  var t = {};
  Object.keys(s).sort().forEach(function (k) {
    t[k] = s[k];
  });
  return t;
}

/**
 *  'getDays'
 *
 *  @summary Synchrone method service to get a list of days in a month
 *
 *  @return {object}
 */

exports.getDays = function () {
  var result = {},
    i = 1;
  for (; i <= 31; i++) {
    result[i] = i;
  }
  return sortByKey(result);
};

/**
 *  'getMonths'
 *
 *  @summary Synchrone method service to get a list of months
 *
 *  @param months {array} : months from moment
 *
 *  @return {object}
 */

exports.getMonths = function (months) {
  var result = {},
    i = 0;
  for (; i < months.length; i++) {
    result[i + 1] = months[i];
  }
  return sortByKey(result);
};

/**
 *  'getYears'
 *
 *  @summary Synchrone method service to get a list of years from 1920 to now
 *
 *  @return {object}
 */

exports.getYears = function () {
  var years = [],
    i = new Date().getFullYear();
  for (; i >= 1920; i--) {
    years.push(i);
  }
  return years;
};
