var _ = require('lodash');

/**
 * Authentication Controller
 */

var AuthController = {

  /**
   * Render the login page
   *
   * The login form itself is just a simple HTML form:
   *
      <form role="form" action="/auth/local" method="post">
        <input type="text" name="identifier" placeholder="Username or Email">
        <input type="password" name="password" placeholder="Password">
        <button type="submit">Sign in</button>
      </form>
   *
   * You could optionally add CSRF-protection as outlined in the documentation:
   * http://sailsjs.org/#!documentation/config.csrf
   *
   * A simple example of automatically listing all available providers in a
   * Handlebars template would look like this:
   *
      {{#each providers}}
        <a href="/auth/{{slug}}" role="button">{{name}}</a>
      {{/each}}
   *
   * @param {Object} req
   * @param {Object} res
   */
  login: function (req, res) {
    var strategies = _.pick(sails.config.passport, 'facebook', 'twitter', 'google'),
      providers = (new sails.services.auth()).getProviders(),
      isMobile = req.param('mobile') === 'm';

    res.view({
      providers_row: 12 / _.size(providers),
      providers: providers,
      form: req.flash('form')[0],
      alert: req.flash_alert(),
      layout: isMobile ? 'layout_mobile' : 'layout_light',
      bodyClass: 'auth auth_login ' + (isMobile ? 'layout_light' : ''),
      isMobile: isMobile
    });
  },

  /**
   * Log out a user and return them to the homepage
   *
   * Passport exposes a logout() function on req (also aliased as logOut()) that
   * can be called from any route handler which needs to terminate a login
   * session. Invoking logout() will remove the req.user property and clear the
   * login session (if any).
   *
   * For more information on logging out users in Passport.js, check out:
   * http://passportjs.org/guide/logout/
   *
   * @param {Object} req
   * @param {Object} res
   */
  logout: function (req, res) {
    req.logout();
    res.redirect('/');
  },

  /**
   * Render the registration page
   *
   * Just like the login form, the registration form is just simple HTML:
   *
      <form role="form" action="/auth/local/register" method="post">
        <input type="text" name="username" placeholder="Username">
        <input type="text" name="email" placeholder="Email">
        <input type="password" name="password" placeholder="Password">
        <button type="submit">Sign up</button>
      </form>
   *
   * @param {Object} req
   * @param {Object} res
   */
  register: function (req, res) {
    var strategies = _.pick(sails.config.passport, 'facebook', 'twitter', 'google'),
      providers = (new sails.services.auth()).getProviders(),
      isMobile = req.param('mobile') === 'm';

    res.view({
      providers_row: 12 / _.size(providers),
      providers: providers,
      form: req.flash('form')[0],
      alert: req.flash_alert(),
      layout: isMobile ? 'layout_mobile' : 'layout_light',
      bodyClass: 'auth auth_register ' + (isMobile ? 'layout_light' : ''),
      isMobile: isMobile
    });
  },

  /**
   * Create a third-party authentication endpoint
   *
   * @param {Object} req
   * @param {Object} res
   */
  provider: function (req, res) {
    sails.services.passport.endpoint(req, res);
  },
  providerMobile: function (req, res) {
    req._isMobile = true;
    sails.services.passport.endpoint(req, res);
  },
  /**
   * Create a authentication callback endpoint
   *
   * This endpoint handles everything related to creating and verifying Pass-
   * ports and users, both locally and from third-aprty providers.
   *
   * Passport exposes a login() function on req (also aliased as logIn()) that
   * can be used to establish a login session. When the login operation
   * completes, user will be assigned to req.user.
   *
   * For more information on logging in users in Passport.js, check out:
   * http://passportjs.org/guide/login/
   *
   * @param {Object} req
   * @param {Object} res
   */
  callback: function (req, res) {
    var action = req.param('action'),
      registerRoute = sails.config.route('auth.register', {
        hash: {
          'lang': res.getLocale()
        }
      }),
      loginRoute = sails.config.route('auth.login', {
        hash: {
          'lang': res.getLocale()
        }
      }),
      dashboardRoute = sails.config.route('dashboard.index', {
        hash: {
          'lang': res.getLocale()
        }
      });

    sails.services.passport.callback(req, res, function (err, user) {
      console.log('next');
      if (err && err.code !== 'E_VALIDATION' && err.message !== 'abort') {
        sails.log.error(err);
      }
      console.log('login');
      req.login(user, function (err) {
        // If an error was thrown, redirect the user to the login which should
        // take care of rendering the error messages.
        if (err) {
          req.flash('alert', req.flash_alert() || req.flash_alert('danger', 'Error.Passport.Generic'));
          req.flash('form', req.body);
          if (action === 'register') {
            res.redirect(registerRoute);
          } else if (action === 'disconnect') {
            res.redirect('back');
          } else {
            res.redirect(loginRoute);
          }
        } else {
          console.log('no err');
          if (req._registered === true) {
            (new sails.services.mail(res)).registration(user.firstName, user.userName, user.email);
          }
          console.log('dashboard');
          res.redirect(req.flash('back')[0] || dashboardRoute);
        }
      });
    });
  }

};

module.exports = AuthController;
