import registerModel from 'main/models/register';

var registerView = Backbone.View.extend({

  el: '.auth',

  model: new registerModel(),
  templateFeedback: Handlebars.partials['main/_partials/validation_feedback'],

  events: {
    'submit .auth-register-form': 'register',
    'click .auth-social a': 'connect'
  },

  initialize: function (options) {
    // Setup validation module
    Backbone.Validation.bind(this, {
      model: this.model
    });
    this.model.bind('validated:valid', _.bind(this.showSuccess, this));
    this.model.bind('validated:invalid', _.bind(this.showInvalid, this));
  },

  register: function (type) {
    var form = this.$el.find('.auth-register-form');

    if (!form.length) {
      this.showError();
      return;
    }

    var fields = $(form).serializeArray();

    _.each(fields, _.bind(function (field) {
      this.model.set(field.name, field.value);
    }, this));

    this.model.validate();

    return false;
  },
  showInvalid: function (model, errors) {
    _.each(model.attributes, _.bind(function (value, key) {
      var form_group = this.$el.find('input[name=' + key + ']').parents('.form-group:first'),
        feedback = {},
        help_text = '';

      if (model.isValid(key)) {
        if (form_group.hasClass('has-error')) {
          form_group
            .removeClass('has-error')
            .addClass('has-success')
            .find('.help-block').text(help_text);
          feedback = {
            success: true,
            error: false
          };
        }
        if (key === 'rules') {
          form_group
            .removeClass('has-success');
        }
      } else {
        form_group
          .removeClass('has-success')
          .addClass('has-error')
          .find('.help-block').text(errors[key]);
        feedback = {
          error: true,
          success: false
        };
      }
      if (form_group.hasClass('has-feedback')) {
        form_group.find('.form-control-feedback').remove();
        form_group.append(this.templateFeedback(feedback));
      }
    }, this));
  },
  showSuccess: function (model) {
    this.$el.find('.auth-register-form [type=submit]').button('loading');
    this.$el.find('.auth-register-form')[0].submit();
  },
  connect: function (evt) {
    $(evt.currentTarget).find('.text').button('loading');
  }
});

export
default registerView;
