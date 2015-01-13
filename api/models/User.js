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

  tableName: 'user',

  // Set false to prevent creating id. By default id will be created as index with auto increment
  autoPK: false,

  // Set schema true/false to only allow fields defined in attributes to be saved. Only for schemaless adapters.
  schema: true,

  // migrate: 'alter', // adds and/or removes columns on changes to the schema
  // migrate: 'drop', // drops all your tables and then re-creates them. All data is deleted.
  // doesn't do anything on sails lift- for use in production.
  migrate: 'safe',

  attributes: {

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

    uid: {
      type: 'string',
      unique: true,
      primaryKey: true
    },

    photo: {
      type: 'string',
      columnName: 'photo_url'
    },

    email: {
      type: 'email',
      unique: true,
      required: false
    },

    firstName: {
      type: 'string',
      columnName: 'first_name'
    },

    lastName: {
      type: 'string',
      columnName: 'last_name'
    },

    /*
     * One-to-Many association
     */

    passports: {
      collection: 'passport',
      via: 'user'
    },

    /*
     * Methods
     */

    fullname: function () {
      return this.firstName + ' ' + this.lastName;
    }
  }
};
