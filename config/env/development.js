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

  connections: {
        MongodbDev: {
        adapter: 'sails-mongo',
        host: 'localhost',
        port: 27017,
        user: '',
        password: '',
        database: 'mobilecturesdb',
        schema: true
    },

    MongodbProd: {
    adapter: 'sails-mongo',
    schema: true,
    url: 'mongodb://rehnan:mobidb@ds049171.mongolab.com:49171/mobilecturesdb'
  },
  }

  /***************************************************************************
   * Set the default database connection for models in the development       *
   * environment (see config/connections.js and config/models.js )           *
   ***************************************************************************/
   
   environment: process.env.NODE_ENV || 'production',

   models: {
     connection: 'MongodbProd'
   }
};
