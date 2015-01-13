/**
 * connectedByTOken
 *
 * @module      :: Policy
 * @description :: Try connect a user by the bearer strategy to populate req.user
 *                 Disable the security policy
 *
 */

module.exports = function (req, res, next) {
  var token = req.access_token;

  if (!token) {
    return next();
  }

  sails.services.passport.protocols.bearer(token, function (err, user, scope) {
    if (err) {
      sails.log.error('policy#connectedByToken failed', err);
      return next();
    }
    if (user) {
      sails.log.info('policy#connectedByToken : req.user ', user.uid);
      req.user = user;
    }
    return next();
  });
};
