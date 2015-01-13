module.exports = function (req, res, next) {

  var config = req._sails.config;

  var layout = {
    country: {
      code: process.env.COUNTRY_CODE || 'US'
    },
    api: config.api
  };

  _.merge(res.locals, layout);

  next();

};
