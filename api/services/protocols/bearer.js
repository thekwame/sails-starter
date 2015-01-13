module.exports = function (accessToken, next) {
  User.findOne({
    auth_token: accessToken
  }, function (err, user) {
    if (err) {
      return next(err);
    }
    if (!user) {
      return next(null, false);
    }
    next(null, user, {
      scope: '*'
    });
  });
};
