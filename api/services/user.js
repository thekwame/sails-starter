var _ = require('lodash'),
  Q = require('q');

var UserService = module.exports = function () {

  //----------------------------------------------------------------------------
  // Private tools
  //----------------------------------------------------------------------------

  //----------------------------------------------------------------------------
  // EXPOSE
  //----------------------------------------------------------------------------

  return {

    readFull: function (uid) {

      if (!_.isString(uid)) {
        throw new Error('UserService #read : the uid param \
          is mandatory and should be a string');
      }

      return User
        .findOne({
          uid: uid
        })
        .populate('passports')
        .then(function done(user) {
          return user;
        })
        .fail(function (err) {
          sails.log.error('UserService #read : query fails', err);
        });
    },

    readSimple: function (uid) {

      if (!_.isString(uid)) {
        throw new Error('UserService #read : the uid param \
          is mandatory and should be a string');
      }

      return User
        .findOne({
          uid: uid
        })
        .then(function done(user) {
          return user;
        })
        .fail(function (err) {
          sails.log.error('UserService #readSimple : query fails', err);
        });
    },

    //--------------------------------------------------------------------------

    readPassports: function (uid, next) {

      if (!_.isFunction(next)) {
        throw new Error('UserService #readPassports : \
          the callback function is mandatory');
      }

      if (!_.isString(uid)) {
        throw new Error('UserService #readPassports : \
          the uid param is mandatory and should be a string');
      }

      Passport
        .find({
          user: uid
        })
        .then(function done(passports) {
          next(null, passports);
        })
        .fail(function (err) {
          sails.log.error('UserService #readPassports : query fails', err);
          next(err);
        });
    },

    //--------------------------------------------------------------------------

    update: function (uid, newData) {

      if (!_.isString(uid)) {
        throw new Error('UserService #update : the uid param \
          is mandatory and should be a string');
      }

      if (!_.isObject(newData)) {
        throw new Error('UserService #update : the newData param \
          is mandatory');
      }

      return User
        .update({
          uid: uid
        }, newData)
        .then(function done(users) {
          if (!users.length) {
            throw new Error('UserService #update : user not found', uid);
          }
          return users[0];
        })
        .fail(function (err) {
          if (err.code !== 'E_VALIDATION') {
            sails.log.error('UserService #update : query fails', err);
          }
          throw err;
        });
    }

    //--------------------------------------------------------------------------

  };

};
