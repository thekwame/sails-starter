var passport = require('passport'),
  path = require('path'),
  url = require('url'),
  _ = require('lodash');

/**
 * Passport Service
 *
 * A painless Passport.js service for your Sails app that is guaranteed to
 * Rock Your Socks™. It takes all the hassle out of setting up Passport.js by
 * encapsulating all the boring stuff in two functions:
 *
 *   passport.endpoint()
 *   passport.callback()
 *
 * The former sets up an endpoint (/auth/:provider) for redirecting a user to a
 * third-party provider for authentication, while the latter sets up a callback
 * endpoint (/auth/:provider/callback) for receiving the response from the
 * third-party provider. All you have to do is define in the configuration which
 * third-party providers you'd like to support. It's that easy!
 *
 * Behind the scenes, the service stores all the data it needs within "Pass-
 * ports". These contain all the information required to associate a local user
 * with a profile from a third-party provider. This even holds true for the good
 * ol' password authentication scheme – the Authentication Service takes care of
 * encrypting passwords and storing them in Passports, allowing you to keep your
 * User model free of bloat.
 */

// Load authentication protocols
passport.protocols = require('./protocols');

/**
 * Connect a third-party profile to a local user
 *
 * This is where most of the magic happens when a user is authenticating with a
 * third-party provider. What it does, is the following:
 *
 *   1. Given a provider and an identifier, find a mathcing Passport.
 *   2. From here, the logic branches into two paths.
 *
 *     - A user is not currently logged in:
 *       1. If a Passport wassn't found, create a new user as well as a new
 *          Passport that will be assigned to the user.
 *       2. If a Passport was found, get the user associated with the passport.
 *
 *     - A user is currently logged in:
 *       1. If a Passport wasn't found, create a new Passport and associate it
 *          with the already logged in user (ie. "Connect")
 *       2. If a Passport was found, nothing needs to happen.
 *
 * As you can see, this function handles both "authentication" and "authori-
 * zation" at the same time. This is due to the fact that we pass in
 * `passReqToCallback: true` when loading the strategies, allowing us to look
 * for an existing session in the request and taking action based on that.
 *
 * For more information on auth(entication|rization) in Passport.js, check out:
 * http://passportjs.org/guide/authenticate/
 * http://passportjs.org/guide/authorize/
 *
 * @param {Object}   req
 * @param {Object}   query
 * @param {Object}   user
 * @param {Object}   profile
 * @param {Function} next
 */
passport.connect = function (req, query, userObj, profile, next) {
  var strategies = sails.config.passport,
    config = strategies[profile.provider],
    identifier = query.identifier.toString(),
    userQuery,
    provider;

  // Get the authentication provider from the query.
  query.provider = req.param('provider');

  // Use profile.provider or fallback to the query.provider if it is undefined
  // as is the case for OpenID, for example
  provider = profile.provider || query.provider;

  // If the provider cannot be identified we cannot match it to a passport so
  // throw an error and let whoever's next in line take care of it.
  if (!provider) {
    return next(new Error('No authentication provider was identified.'));
  }

  if (provider === 'facebook') {
    userQuery = {
      facebook_id: identifier
    };
    userObj.facebook_id = identifier;
  } else if (provider === 'twitter') {
    userQuery = {
      twitter_id: identifier
    };
    // force email creation to avoid not null email contraint
    userObj.twitter_id = identifier;
    userObj.twitter_name = userObj.userName;
  }

  // If neither an email or a username was available in the profile, we don't
  // have a way of identifying the user in the future. Throw an error and let
  // whoever's next in the line take care of it.
  if (!userObj.userName && !userObj.email) {
    return next(new Error('Neither a username or email was available', null));
  }

  Passport.findOne({
      provider: provider,
      identifier: identifier
    })
    .then(function getUser(passport) {
      var _user;
      if (!req.user) {
        if (!passport) {
          if (userQuery) {
            _user = User.findOne(userQuery);
          }
        } else {
          _user = User.findOne({
            uid: passport.user
          });
        }
      } else {
        _user = req.user;
      }
      return [_user, passport];
    })
    .spread(function createUser(user, passport) {
      if (!user) {
        user = User.create(userObj).then(function (user) {
          sails.log.info('Passport.connect#service: create a user', user.uid);
          user.trackSignedUp(provider);
          req._registered = true;
          return user;
        });
      }
      return [user, passport];
    })
    .spread(function createPassport(user, passport) {
      if (!passport) {
        query.user = user.uid;
        passport = Passport.create(query).then(function (passport) {
          sails.log.info('Passport.connect#service: create a passport', passport.id);
          if (req.user) {
            user.trackConnectedProvider(provider);
          }
          return passport;
        });
      }
      return [user, passport];
    })
    .spread(function updatePassportAndUser(user, passport) {
      // If the tokens have changed since the last session, update them
      if (query.hasOwnProperty('tokens') && query.tokens !== passport.tokens) {
        passport.tokens = query.tokens;
        passport = passport.save().then(function (passport) {
          sails.log.info('Passport.connect#service: update passport', passport.id);
          return passport;
        });
      }
      // If properties are missing, try to update user.
      Object.keys(userObj).forEach(function (key) {
        if (!user[key] && userObj[key]) {
          user[key] = userObj[key];
        }
      });
      user.auth_token = user.generateToken();
      user = user.save().then(function (user) {
        sails.log.info('Passport.connect#service: update user', user.uid);
        return user;
      });
      return [user, passport];
    })
    .spread(function loginUser(user, passport) {
      sails.log.info('Passport.connect#service: login user', user.uid);
      user.trackLoggedIn(provider);
      next(null, user);
    })
    .fail(function handleValiationErrors(err) {
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
 * Create an authentication endpoint
 *
 * For more information on authentication in Passport.js, check out:
 * http://passportjs.org/guide/authenticate/
 *
 * @param  {Object} req
 * @param  {Object} res
 */
passport.endpoint = function (req, res, next) {
  var strategies = sails.config.passport,
    // TODO: when bearer strategy, try a way to set the param provider
    provider = req.param('provider') || req._provider,
    options = {},
    loginRoute = sails.config.route('auth.login', {
      hash: {
        'lang': res.getLocale()
      }
    }),
    loginRouteMobile = sails.config.route('auth.login', {
      hash: {
        'lang': res.getLocale(),
        'mobile': 'm'
      }
    });

  // If a provider doesn't exist for this endpoint, send the user back to the
  // login page
  if (!strategies.hasOwnProperty(provider)) {
    req.flash_alert('danger', 'Error.Passport.Generic');
    return res.redirect(req._isMobile ? loginRouteMobile : loginRoute);
  }

  // Attach scope if it has been set in the config
  if (strategies[provider].hasOwnProperty('scope')) {
    options.scope = strategies[provider].scope;
  }

  // handle a specific case for bearer authentification
  if (provider === 'bearer' && strategies[provider].hasOwnProperty('options')) {
    options = strategies[provider].options;
  }

  this.loadStrategies(req);

  // Redirect the user to the provider for authentication. When complete,
  // the provider will redirect the user back to the application at
  //     /auth/:provider/callback
  this.authenticate(provider, options)(req, res, (next || req.next));
};

/**
 * Create an authentication callback endpoint
 *
 * For more information on authentication in Passport.js, check out:
 * http://passportjs.org/guide/authenticate/
 *
 * @param {Object}   req
 * @param {Object}   res
 * @param {Function} next
 */
passport.callback = function (req, res, next) {
  var provider = req.param('provider', 'local'),
    action = req.param('action');

  // Passport.js wasn't really built for local user registration, but it's nice
  // having it tied into everything else.
  if (provider === 'local' && action !== undefined) {
    if (action === 'register' && !req.user) {
      this.protocols.local.register(req, res, next);
    } else if (action === 'connect' && req.user) {
      this.protocols.local.connect(req, res, next);
    } else if (action === 'disconnect' && req.user) {
      this.protocols.local.disconnect(req, res, next);
    } else {
      next(new Error('Invalid action'));
    }
  } else {
    if (action === 'disconnect' && req.user) {
      this.disconnect(req, res, next);
    } else {
      this.loadStrategies(req);

      // The provider will redirect the user to this URL after approval. Finish
      // the authentication process by attempting to obtain an access token. If
      // access was granted, the user will be logged in. Otherwise, authentication
      // has failed.
      this.authenticate(provider, next)(req, res, req.next);
    }
  }
};

/**
 * Load all strategies defined in the Passport configuration
 *
 * For example, we could add this to our config to use the GitHub strategy
 * with permission to access a users email address (even if it's marked as
 * private) as well as permission to add and update a user's Gists:
 *
    github: {
      name: 'GitHub',
      protocol: 'oauth2',
      scope: [ 'user', 'gist' ]
      options: {
        clientID: 'CLIENT_ID',
        clientSecret: 'CLIENT_SECRET'
      }
    }
 *
 * For more information on the providers supported by Passport.js, check out:
 * http://passportjs.org/guide/providers/
 *
 * @param {Object} req
 */
passport.loadStrategies = function (req) {
  var self = this,
    strategies = sails.config.passport;

  Object.keys(strategies).forEach(function (key) {
    var options = {
        passReqToCallback: true
      },
      baseUrl = require('url').format({
        protocol: req.protocol,
        host: req.headers.host
      }),
      Strategy = strategies[key].strategy;

    if (key === 'local') {
      // Since we need to allow users to login using both usernames as well as
      // emails, we'll set the username field to something more generic.
      _.extend(options, {
        usernameField: 'identifier'
      });

      self.use(new Strategy(options, self.protocols.local.login));

    } else {
      var protocol = strategies[key].protocol,
        callback = strategies[key].callback;

      if (key === 'bearer') {
        return self.use(new Strategy(self.protocols[protocol]));
      }

      if (!callback) {
        if (req && req._isMobile) {
          if (req.access_token) {
            callback = '/m/auth/' + key + '/callback' + '/?access_token=' + req.access_token;
          } else {
            callback = '/m/auth/' + key + '/callback';
          }
        } else {
          callback = '/auth/' + key + '/callback';
        }
      }

      switch (protocol) {
      case 'oauth':
      case 'oauth2':
        options.callbackURL = url.resolve(baseUrl, callback);
        break;
      }

      // Merge the default options with any options defined in the config. All
      // defaults can be overriden, but I don't see a reason why you'd want to
      // do that.
      _.extend(options, strategies[key].options);

      self.use(new Strategy(options, self.protocols[protocol]));
    }
  });
};

/**
 * Disconnect a passport from a user
 *
 * @param  {Object} req
 * @param  {Object} res
 */
passport.disconnect = function (req, res, next) {

  var user = req.user,
    provider = req.param('provider');

  Passport.findOne({
    provider: provider,
    user: user.uid
  }).then(function (passport) {
    Passport.destroy(passport.id).then(function () {
      next(null, user);
    }).fail(next);
  }).fail(next);
};

passport.serializeUser(function (user, next) {
  next(null, user.uid);
});

passport.deserializeUser(function (id, next) {
  User.findOne(id, next);
});

module.exports = passport;
