/**
 * Bootstrap
 *
 * An asynchronous bootstrap function that runs before your Sails app gets lifted.
 * This gives you an opportunity to set up your data model, run jobs, or perform some special logic.
 *
 * For more information on bootstrapping your app, check out:
 * http://sailsjs.org/#documentation
 */

var path = require('path'),
  hbs = require('hbs'),
  helpers = require(path.resolve(__dirname + '/helpers'));

module.exports.bootstrap = function (done) {
  // These convenience methods will register all partials (that have a *.html or *.hbs extension) in the given directory. registerPartials will perform a one-time registration.
  // Partials that are loaded from a directory are named based on their filename, where spaces and hyphens are replaced with an underscore character:
  // template.html      -> {{> template}}
  // template 2.html    -> {{> template_2}}
  // login view.hbs     -> {{> login_view}}
  // template-file.html -> {{> template_file}}
  hbs.registerPartials(path.resolve('views/_partials'));

  // register all helpers located in '/helpers' folder
  // helpers.templating.register(hbs);
  // helpers.misc.register(hbs);
  // helpers.pagination.register(hbs);

  helpers.statics.register(hbs, {
    mapping: __dirname + '/assets.json',
    environment: sails.config.environment,
    hostname: sails.config.static.resources_proxies
  });

  helpers.route.register(hbs, {
    routes: sails.config.routes
  });
  sails.config.route = helpers.route.getRouteHelper({
    routes: sails.config.routes
  });

  // helpers.extUrl.register(hbs, {
  //   aliases: __dirname + '/urlAliases.json'
  // });
  // sails.config.extUrl = helpers.extUrl.getExtURLHelper({
  //   aliases: __dirname + '/urlAliases.json'
  // });

  // sails.services.passport.loadStrategies();

  done();
};
