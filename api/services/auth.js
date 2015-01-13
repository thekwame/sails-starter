var _ = require('lodash');

function Auth() {
  // construtor
}

Auth.prototype.getProviders = function (passports) {

  /**
   *  'getProviders'
   *
   *  @summary Synchrone service to get available providers
   *
   *  @param passports {array:optionnal} : the providers linked from an user
   *
   *  @return {object}
   */

  var strategies = _.pick(sails.config.passport, 'facebook', 'twitter', 'google'),
    providers = {};

  // Get a list of available providers for use in your templates.
  Object.keys(strategies).forEach(function (key) {
    providers[key] = {
      name: strategies[key].name,
      slug: key,
      isLinked: !_.isEmpty(_.where(passports, {
        'provider': key
      })),
      isFacebook: key === 'facebook',
      isGoogle: key === 'google',
      isTwitter: key === 'twitter',
      isGithub: key === 'github'
    };
  });

  return providers;
};

module.exports = Auth;
