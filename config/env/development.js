/**
 * Development environment settings
 *
 * This file can include shared settings for a development team,
 * such as API keys or remote database passwords.  If you're using
 * a version control solution for your Sails app, this file will
 * be committed to your repository unless you add it to your .gitignore
 * file.  If your repository will be publicly viewable, don't add
 * any private information to this file!
 *
 */

module.exports = {

  /***************************************************************************
   * Set the default database connection for models in the development       *
   * environment (see config/connections.js and config/models.js )           *
   ***************************************************************************/

  log: {
    level: 'verbose'
  },

  connections: {
    Postgresql: {
      adapter: 'sails-postgresql',
      url: 'postgres://oubcukdgrmjfrz:Yepe_9jrgK0yIVuyhpan-JrWH5@ec2-54-228-224-127.eu-west-1.compute.amazonaws.com:5432/d4pq9slihvgnns',
      ssl: true
    }
  },

  models: {
    connection: 'Postgresql'
  },

  passport: {
    facebook: {
      options: {
        // FB app with canvas = http://localhost:1337/
        clientID: 'clientID',
        clientSecret: 'clientSecret'

        // FB app with canvas = http://192.168.0.9:1337/
        // clientID: 'clientID',
        // clientSecret: 'clientSecret'
      }
    },
    google: {
      options: {
        clientID: 'clientID',
        clientSecret: 'clientSecret'
      }
    }
  },

  api: {
    google: {
      key: '',
      version: '3'
    },
    analytics: {
      writeKey: 'writeKey'
    },
    aws: {
      key: '',
      secret: '',
      version: ''
    }
  }

};
