/**
 * sessionAuth
 *
 * @module      :: Policy
 * @description :: Simple policy to allow any authenticated user
 *                 Assumes that your login action in one of your controllers sets `req.session.authenticated = true;`
 * @docs        :: http://sailsjs.org/#!documentation/policies
 *
 */

module.exports = function (req, res, next) {

  var loginRoute = sails.config.route('auth.login', {
    hash: {
      'lang': res.getLocale()
    }
  });

  // User is allowed, proceed to the next policy,
  // or if this is the last policy, the controller
  // temp allow *

  if (req.user || req.path === loginRoute) {
    return next();
  }

  req.flash('back', req.path);
  req.flash_alert('Error.Passport.auth.forbidden');
  // User is not allowed
  // (default res.forbidden() behavior can be overridden in `config/403.js`)
  sails.log.info('User not authenticated try to reach a forbidden page', {
    path: req.path
  });
  return res.forbidden('You must be logged in, to view this page', loginRoute);
};
