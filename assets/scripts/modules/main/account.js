import accountModel from 'main/models/account';

var accountView = Backbone.View.extend({

  el: '.account',

  model: new accountModel(),
  templateFeedback: Handlebars.partials['main/_partials/validation_feedback'],

  events: {
    'submit .settings-account-form': 'update'
  },

  initialize: function (options) {
    // Setup validation module
    Backbone.Validation.bind(this, {
      model: this.model
    });
    this.model.bind('validated:valid', _.bind(this.showSuccess, this));
    this.model.bind('validated:invalid', _.bind(this.showInvalid, this));
  },

  update: function (type) {
    var form = this.$el.find('.settings-account-form');

    if (!form.length) {
      this.showError();
      return;
    }

    var fields = $(form).serializeArray();
    delete fields._method;

    _.each(fields, _.bind(function (field) {
      if (field.name === 'user[email]') {
        field.name = 'user.email';
      }
      this.model.set(field.name, field.value);
    }, this));

    this.model.validate();

    return false;
  },
  showInvalid: function (model, errors) {
    _.each(model.attributes, _.bind(function (value, deepKey) {
      var key = deepKey.split('.')[1],
        form_group = this.$el.find('#account_' + key).parents('.form-group:first'),
        feedback = {},
        help_text = '';

      if (model.isValid(deepKey)) {
        if (form_group.hasClass('has-error')) {
          form_group
            .removeClass('has-error')
            .addClass('has-success')
            .find('.help-block').text(help_text);
          feedback = {
            success: true
          };
        }
      } else {
        form_group
          .removeClass('has-success')
          .addClass('has-error')
          .find('.help-block').text(errors[deepKey]);
        feedback = {
          error: true
        };
      }
      if (form_group.hasClass('has-feedback')) {
        form_group.find('.form-control-feedback').remove();
        form_group.append(this.templateFeedback(feedback));
      }
    }, this));
  },
  showSuccess: function (model) {
    this.$el.find('.settings-account-form [type=submit]').button('loading');
    this.$el.find('.settings-account-form')[0].submit();
  }
});

export
default accountView;
