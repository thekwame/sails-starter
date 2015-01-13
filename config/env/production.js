/**
 * Production environment settings
 *
 * This file can include shared settings for a production environment,
 * such as API keys or remote database passwords.  If you're using
 * a version control solution for your Sails app, this file will
 * be committed to your repository unless you add it to your .gitignore
 * file.  If your repository will be publicly viewable, don't add
 * any private information to this file!
 *
 */

module.exports = {

  log: {
    level: 'info'
  },

  analytics: {
    writeKey: process.env.ANALYTICS_WRITE_KEY,
    readKey: process.env.ANALYTICS_READ_KEY,
    projectId: process.env.ANALYTICS_PROJECT_ID,
    flushAt: 10
  },

  connections: {
    Postgresql: {
      adapter: 'sails-postgresql',
      url: process.env.DATABASE_URL,
      ssl: true
    }
  },

  models: {
    connection: 'Postgresql'
  },

  passport: {
    twitter: {
      options: {
        consumerKey: process.env.TWITTER_CLIENT_ID,
        consumerSecret: process.env.TWITTER_CLIENT_SECRET
      }
    },
    facebook: {
      options: {
        clientID: process.env.FACEBOOK_CLIENT_ID,
        clientSecret: process.env.FACEBOOK_CLIENT_SECRET
      }
    },
    google: {
      options: {
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET
      }
    }
  },

  api: {
    google: {
      key: 'key',
      version: '3'
    },
    analytics: {
      writeKey: process.env.ANALYTICS_WRITE_KEY
    },
    aws: {
      key: '',
      secret: '',
      version: ''
    }
  }

};
