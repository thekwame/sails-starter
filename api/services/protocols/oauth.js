/**
 * OAuth Authentication Protocol
 *
 * OAuth 1.0 is a delegated authentication strategy that involves multiple
 * steps. First, a request token must be obtained. Next, the user is redirected
 * to the service provider to authorize access. Finally, after authorization has
 * been granted, the user is redirected back to the application and the request
 * token can be exchanged for an access token. The application requesting access,
 * known as a consumer, is identified by a consumer key and consumer secret.
 *
 * For more information on OAuth in Passport.js, check out:
 * http://passportjs.org/guide/oauth/
 *
 * @param {Object}   req
 * @param {string}   token
 * @param {string}   tokenSecret
 * @param {Object}   profile
 * @param {Function} next
 */

var passport = require('passport');

module.exports = function (req, token, tokenSecret, profile, next) {
  var user = {},
    query = {
      identifier: profile.id,
      protocol: 'oauth',
      tokens: {
        token: token
      },
      profile: profile
    };

  // If the profile object contains a list of emails, grab the first one and
  // add it to the user.
  if (_.has(profile, 'emails') && _.isObject(profile.emails)) {
    user.email = profile.emails[0].value;
  }

  // If the profile object contains a list of photos, grab the first one and
  // add it to the user.
  if (_.has(profile, 'photos') && _.isObject(profile.photos)) {
    user.photo = profile.photos[0].value;
  }

  if (_.has(profile, '_json') && _.isObject(profile._json)) {
    if (_.has(profile._json, 'lang')) {
      user.lang = profile._json.lang;
    }
  }
  // If the profile object contains a username, add it to the user.
  if (_.has(profile, 'displayName') && _.isString(profile.displayName)) {
    var displayName = profile.displayName.split(' ');
    user.firstName = displayName[0];
    user.lastName = displayName[displayName.length - 1];
  }

  // If the profile object contains a username, add it to the user.
  if (_.has(profile, 'username') && _.isString(profile.username)) {
    user.userName = profile.username;
  } else if (user.firstName && user.lastName) {
    user.userName = user.firstName + ' ' + user.lastName;
  }

  if (tokenSecret !== undefined) {
    query.tokens.tokenSecret = tokenSecret;
  }

  passport.connect(req, query, user, profile, next);
};
