var _ = require('lodash');

module.exports = function (req, res, next) {
  var token;

  if (req.headers && req.headers.authorization) {
    var parts = req.headers.authorization.split(' ');
    if (parts.length === 2) {
      var scheme = parts[0],
        credentials = parts[1];

      if (/^Bearer$/i.test(scheme)) {
        token = credentials;
      }
    }
  }

  if (!token && req.body && !_.isEmpty(req.body.access_token)) {
    token = req.body.access_token;
  }

  if (!token && req.query && !_.isEmpty(req.query.access_token)) {
    token = req.query.access_token;
  }

  if (token) {
    // set access_token to the request.
    req.access_token = token;
  }

  return next();
};
