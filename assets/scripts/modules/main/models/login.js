var loginModel = Backbone.Model.extend({

  url: '/fr/auth/local',

  defaults: {
    identifier: '',
    password: ''
  },

  validation: {
    identifier: {
      required: true,
      msg: $.t('auth.empty_usernameOrEmail')
    },
    password: {
      required: true,
      msg: $.t('auth.empty_password')
    }
  }
});

export
default loginModel;
