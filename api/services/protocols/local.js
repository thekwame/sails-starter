var validator = require('validator');
/**
 * Local Authentication Protocol
 *
 * The most widely used way for websites to authenticate users is via a username
 * and/or email as well as a password. This module provides functions both for
 * registering entirely new users, assigning passwords to already registered
 * users and validating login requesting.
 *
 * For more information on local authentication in Passport.js, check out:
 * http://passportjs.org/guide/username-password/
 */

/**
 * Register a new user
 *
 * This method creates a new user from a specified email, username and password
 * and assign the newly created user a local Passport.
 *
 * @param {Object}   req
 * @param {Object}   res
 * @param {Function} next
 */

exports.register = function (req, res, next) {
  var email = req.param('email'),
    userName = req.param('username'),
    password = req.param('password'),
    query = {};

  if (!email) {
    req.flash_alert('danger', 'Error.Passport.Email.Missing');
    return next(new Error('No email was entered.'));
  }

  if (!password) {
    req.flash_alert('danger', 'Error.Passport.Password.Missing');
    return next(new Error('No password was entered.'));
  }

  User.create({
    userName: userName,
    email: email.toLowerCase()
  })
  .then(function createPassport(user) {
    sails.log.info('Passport.local.register#service: create a local user', user.uid);
    Passport.create({
        protocol: 'local',
        password: password,
        user: user.uid
      })
      .then(function done(passport) {
        sails.log.info('Passport.local.register#service: create a local passport', passport.id);
        req._registered = true;
        next(null, user);
      })
      .fail(function (err) {
        if (err.code === 'E_VALIDATION') {
          req.flash_alert('danger', 'Error.Passport.Password.Invalid');
        }
        user.destroy().then(function () {
          sails.log.warn('Passport.local.register#service: destroy a user, because a passport failed');
          next(err);
        }).fail(next);
      });
  }).fail(function (err) {
    if (err.code === 'E_VALIDATION') {
      if (err.invalidAttributes.email) {
        req.flash_alert('danger', 'Error.Passport.Email.Exists');
      } else {
        req.flash_alert('danger', 'Error.Passport.User.Exists');
      }
    }
    next(err);
  });
};

/**
 * Assign local Passport to user
 *
 * This function can be used to assign a local Passport to a user who doens't
 * have one already. This would be the case if the user registered using a
 * third-party service and therefore never set a password.
 *
 * @param {Object}   req
 * @param {Object}   res
 * @param {Function} next
 */
exports.connect = function (req, res, next) {
  var user = req.user,
    password = req.param('password');

  Passport.findOrCreate({
    protocol: 'local',
    user: user.uid
  }, {
    protocol: 'local',
    password: password,
    user: user.uid
  }).then(function (passport) {
    sails.log.info('Passport.local.connect#service: find|create a passport for a connected user', passport.id);
    next(null, user);
  }).fail(next);
};

/**
 * Validate a login request
 *
 * Looks up a user using the supplied identifier (email or username) and then
 * attempts to find a local Passport associated with the user. If a Passport is
 * found, its password is checked against the password supplied in the form.
 *
 * @param {Object}   req
 * @param {string}   identifier
 * @param {string}   password
 * @param {Function} next
 */

var getHash = function (str) {
  return require('crypto').createHash('sha512').update(str).digest('hex');
};

exports.login = function (req, identifier, password, next) {
  var isEmail = validator.isEmail(identifier),
    query = {};

  if (isEmail) {
    query.email = identifier.toLowerCase();
  } else {
    query.userName = identifier;
  }

  User
    .findOne(query)
    .then(function checkUserExists(user) {
      if (!user) {
        if (isEmail) {
          req.flash_alert('danger', 'Error.Passport.Email.NotFound');
        } else {
          req.flash_alert('danger', 'Error.Passport.Username.NotFound');
        }
        throw Error('abort');
      }
      return user;
    })
    .then(function findPassport(user) {
      return [user, Passport.findOne({
        protocol: 'local',
        user: user.uid
      })];
    })
    .spread(function checkPassportExistsForLegacyUser(user, passport) {
      // legacy user (secret hash property) with no passport yet
      if (!passport && user.secret) {

        var hash = getHash(password),
          secret = getHash(user.creation_date + hash);

        if (secret === user.secret) {
          passport = Passport.create({
            protocol: 'local',
            password: password,
            user: user.uid
          }).then(function handleLegacyUser(passport) {
            sails.log.info('Passport.local.login#service: create a passport for a legacy user');
            return passport;
          });
        } else {
          req.flash_alert('danger', 'Error.Passport.Password.Wrong');
          throw Error('abort');
        }
      }
      return [user, passport];
    })
    .spread(function checkPassportExists(user, passport) {
      if (!passport) {
        req.flash_alert('danger', 'Error.Passport.Password.NotSet');
        throw Error('abort');
      }
      return [user, passport];
    })
    .spread(function validatePassword(user, passport) {
      var valid = passport.validatePassword(password);
      return [user, valid];
    }).spread(function (user, valid) {
      if (!valid) {
        req.flash_alert('danger', 'Error.Passport.Password.Wrong');
        throw Error('abort');
      }
      return user;
    })
    .then(function generateToken(user) {
      user.auth_token = user.generateToken();
      user = user.save().then(function (user) {
        sails.log.info('Passport.local.login#service: generate token for user', user.uid);
        return user;
      });
      return user;
    })
    .then(function loginUser(user) {
      sails.log.info('Passport.local.login#service: success login for user', user.uid);
      user.trackLoggedIn('local');
      next(null, user);
    })
    .fail(function (err) {
      if (err.message === 'abort') {
        return next(null, false);
      }
      next(err);
    }).done();
};
