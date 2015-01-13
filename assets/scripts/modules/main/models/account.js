var accountModel = Backbone.Model.extend({

  validation: {
    'user.userName': {
      required: false,
      msg: $.t('auth.empty_username')
    },
    'user.firstName': {
      required: false,
      msg: $.t('auth.empty_username')
    },
    'user.lastName': {
      required: false,
      msg: $.t('auth.empty_username')
    },
    'user.birthDate': {
      required: false,
      msg: $.t('auth.empty_username')
    },
    'user.email': [{
      required: true,
      msg: $.t('auth.empty_email')
    }, {
      pattern: 'email',
      msg: $.t('auth.valid_email')
    }]
  }
});

export
default accountModel;
