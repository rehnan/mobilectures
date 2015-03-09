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

   

   port: process.env.PORT || 1337,
   environment: process.env.NODE_ENV || 'development',

   connections: {
    'default': 'MongodbDev',

      MongodbDev: {
	    adapter: 'sails-mongo',
	    host: 'localhost',
	    port: 27017,
	    user: '',
	    password: '',
	    database: 'mobilecturesdb',
	    schema: true
	  }
   },

   models: {
     connection: 'MongodbDev'
   },

   
  /***************************************************************************
   * Set the port in the production environment to 80                        *
   ***************************************************************************/

  // port: 80,

  /***************************************************************************
   * Set the log level in production environment to "silent"                 *
   ***************************************************************************/

  // log: {
  //   level: "silent"
  // }
};
