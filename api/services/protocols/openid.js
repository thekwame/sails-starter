/**
 * OpenID Authentication Protocol
 *
 * OpenID is an open standard for federated authentication. When visiting a
 * website, users present their OpenID to sign in. The user then authenticates
 * with their chosen OpenID provider, which issues an assertion to confirm the
 * user's identity. The website verifies this assertion in order to sign the
 * user in.
 *
 * For more information on OpenID in Passport.js, check out:
 * http://passportjs.org/guide/openid/
 *
 * @param {Object}   req
 * @param {string}   identifier
 * @param {Object}   profile
 * @param {Function} next
 */
var passport = require('passport');

module.exports = function (req, identifier, profile, next) {
  var user = {},
    query = {
      identifier: identifier,
      protocol: 'openid',
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

  // If the profile object contains a username, add it to the user.
  if (_.has(profile, 'name') && _.isObject(profile.name)) {
    if (_.has(profile.name, 'familyName') && _.isString(profile.name.familyName)) {
      user.lastName = profile.name.familyName;
    }
    if (_.has(profile.name, 'givenName') && _.isString(profile.name.givenName)) {
      user.firstName = profile.name.givenName;
    }
  }

  // If the profile object contains a username, add it to the user.
  if (_.has(profile, 'username') && _.isString(profile.username)) {
    user.userName = profile.username;
  } else if (_.has(profile, 'displayName') && _.isString(profile.displayName)) {
    user.userName = profile.displayName;
  } else if (user.firstName && user.lastName) {
    user.userName = user.firstName + ' ' + user.lastName;
  }

  passport.connect(req, query, user, profile, next);
};
