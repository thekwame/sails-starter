var _ = require('lodash'),
  uuid = require('node-uuid');

var generate_token = function () {
  return uuid.v4();
};

/**
 * User.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/#!documentation/models
 */

module.exports = {

  tableName: 'brand_user',

  // Set false to prevent creating id. By default id will be created as index with auto increment
  autoPK: false,

  // Set schema true/false to only allow fields defined in attributes to be saved. Only for schemaless adapters.
  schema: true,

  // migrate: 'alter', // adds and/or removes columns on changes to the schema
  // migrate: 'drop', // drops all your tables and then re-creates them. All data is deleted.
  // doesn't do anything on sails lift- for use in production.
  migrate: 'safe',

  attributes: {

    //--------------------------------------------------------------------------

    uid: {
      type: 'string',
      unique: true,
      primaryKey: true
    },

    email: {
      type: 'email',
      unique: true,
      required: false
    },

    userName: {
      type: 'string',
      columnName: 'user_name'
    },

    firstName: {
      type: 'string',
      columnName: 'first_name'
    },

    lastName: {
      type: 'string',
      columnName: 'last_name'
    },

    //--------------------------------------------------------------------------
    /*
     * One-to-Many association
     */

    passports: {
      collection: 'passport',
      via: 'user'
    },

    //--------------------------------------------------------------------------

    createdAt: {
      type: 'datetime',
      columnName: 'created_at',
      defaultsTo: function () {
        return new Date();
      }
    },
    updatedAt: {
      type: 'datetime',
      columnName: 'updated_at',
      defaultsTo: function () {
        return new Date();
      }
    },

    //--------------------------------------------------------------------------
    /*
     * Methods
     */

    fullname: function () {
      return this.firstName + ' ' + this.lastName;
    }
  },


  beforeCreate: function (user, next) {
    if (_.isString(user.userName) && _.isEmpty(user.userName)) {
      user.userName = null;
    }
    if (_.isString(user.email) && _.isEmpty(user.email)) {
      user.email = null;
    }

    // generare uid
    user.uid = uuid.v4();
    next(null, user);
  },

  beforeUpdate: function (user, next) {
    if (_.isString(user.userName) && _.isEmpty(user.userName)) {
      user.userName = null;
    }
    if (_.isString(user.email) && _.isEmpty(user.email)) {
      user.email = null;
    }

    next(null, user);
  }
};
