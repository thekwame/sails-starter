var registerModel = Backbone.Model.extend({

  defaults: {
    username: '',
    email: '',
    password: '',
    passwordRepeat: '',
    rules: false
  },

  validation: {
    username: {
      required: false,
      msg: $.t('auth.empty_username')
    },
    email: [{
      required: true,
      msg: $.t('auth.empty_email')
    }, {
      pattern: 'email',
      msg: $.t('auth.valid_email')
    }],
    password: [{
      required: true,
      msg: $.t('auth.empty_password')
    }, {
      minLength: 4,
      msg: $.t('auth.min_password', {
        count: 4
      })
    }],
    passwordRepeat: [{
      required: true,
      msg: $.t('auth.empty_passwordRepeat')
    }, {
      equalTo: 'password',
      msg: $.t('auth.same_password')
    }]
  }
});

export
default registerModel;
