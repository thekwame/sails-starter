/**
 * OAuth 2.0 Authentication Protocol
 *
 * OAuth 2.0 is the successor to OAuth 1.0, and is designed to overcome
 * perceived shortcomings in the earlier version. The authentication flow is
 * essentially the same. The user is first redirected to the service provider
 * to authorize access. After authorization has been granted, the user is
 * redirected back to the application with a code that can be exchanged for an
 * access token. The application requesting access, known as a client, is iden-
 * tified by an ID and secret.
 *
 * For more information on OAuth in Passport.js, check out:
 * http://passportjs.org/guide/oauth/
 *
 * @param {Object}   req
 * @param {string}   accessToken
 * @param {string}   refreshToken
 * @param {Object}   profile
 * @param {Function} next
 */
var passport = require('passport'),
  _ = require('lodash');

module.exports = function (req, accessToken, refreshToken, profile, next) {
  var user = {},
    query = {
      identifier: profile.id,
      protocol: 'oauth2',
      tokens: {
        accessToken: accessToken
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
  } else {
    if (profile.provider === 'facebook' && profile.username) {
      user.photo = 'http://graph.facebook.com/' + profile.username + '/picture?type=large';
    } else if (profile.provider === 'google') {
      user.photo = profile._json.picture;
    }
  }

  if (_.has(profile, '_json') && _.isObject(profile._json)) {
    if (_.has(profile._json, 'birthday')) {
      user.birthdate = profile._json.birthday;
    }
    if (_.has(profile._json, 'locale')) {
      var locale = profile._json.locale.split('_'),
        lang = _.isObject(locale) ? locale[0] : locale,
        country = _.isObject(locale) ? locale[1] : locale;
      if (lang) {
        user.lang = lang;
      }
      if (country) {
        user.country = country;
      }
    }
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

  if (refreshToken !== undefined) {
    query.tokens.refreshToken = refreshToken;
  }

  passport.connect(req, query, user, profile, next);
};
