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

  port: process.env.PORT || 80,
  environment: process.env.NODE_ENV || 'production',

   connections: {
    'default': 'MongodbProd',

      MongodbProd: {
        adapter: 'sails-mongo',
        schema: true,
        url: process.env.DB_URL
      }
   },

   models: {
     connection: 'MongodbProd'
   }
};
