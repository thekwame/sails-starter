var _ = require('lodash'),
  url = require('url'),
  Q = require('q'),
  juice = require('juice'),
  nodemailer = require('nodemailer'),
  smtpTransport = require('nodemailer-smtp-transport');

function Mail(res) {
  if (typeof res === 'undefined') {
    throw new Error('Missing res when instantiating Mail service');
  }
  this.res = res;
  this.smtpTransportOptions = {
    host: 'smtp.gmail.com',
    port: 465,
    ignoreTLS: true,
    auth: {
      user: 'no-reply@uralys.com',
      pass: 'n0r3ply098'
    }
  };
  this.defaultsMailOptions = {
    from: 'uralys <contact@uralys.com>'
  };
}

Mail.prototype._sendHtmlMail = function (viewPath, data, options) {
  var smtpTransportOptions = this.smtpTransportOptions,
    defaultsMailOptions = this.defaultsMailOptions,
    templateData = _.defaults({
      layout: 'layout_mail'
    }, data),
    mailOptions = _.merge(defaultsMailOptions, options),
    devRecipent = 'support@uralys.com';

  if (sails.config.application !== 'prod') {
    mailOptions.to = devRecipent;
    sails.log.info('MailService #_sendHtmlMail : redirect email recipient to ' + devRecipent, sails.config.application);
  }

  // get the html of the template
  return Q.npost(this.res, 'render', [viewPath, templateData]).then(function (html) {
    // inline the css of the email
    return Q.nfapply(juice.juiceContent, [html, {
      removeStyleTags: false,
      url: 'http://www.uralys.com'
    }]).then(function (inlinedHtml) {
      mailOptions.html = inlinedHtml;
      // send the enail
      return Q.Promise(function (resolve, reject, notify) {
        nodemailer
          .createTransport(smtpTransport(smtpTransportOptions))
          .sendMail(mailOptions, function (err, info) {
            if (err) {
              return reject(err);
            }
            resolve(info.response);
          });
      });
    });
  });
};

Mail.prototype.registration = function (firstName, userName, email) {

  /**
   *  'registration'
   *
   *  @summary Send a registration mail
   *
   *  @param user {name} : the user firstName
   *  @param user {name} : the user userName
   *  @param user {name} : the user email

   *  @return {promise}
   */

  // the name might be an empty string
  var name = '';

  if (_.isString(firstName) && !_.isEmpty(firstName)) {
    name = firstName;
  }

  if (_.isString(userName) && !_.isEmpty(userName) && _.isEmpty(name)) {
    name = userName;
  }

  if (!_.isString(email) || _.isEmpty(email)) {
    // do not trow an error, just log it
    sails.log.error('mail.registration#service : the email param is mandatory and should not be empty', name);
    return;
  }

  return this._sendHtmlMail('mail/registration', {
    name: name,
    appIosUrl: sails.config.extUrl('app_ios'),
    appAndroidUrl: sails.config.extUrl('app_android')
  }, {
    to: email,
    subject: this.res.i18n('mail.registration.subject')
  }).then(function (response) {
    sails.log.info('mail.registration#service : Message sent to email:' + email + ', ' + response);
    return response;
  }).fail(function (err) {
    sails.log.error('mail.registration#service : failed to email:' + email, err);
    throw err;
  });

};

module.exports = Mail;
