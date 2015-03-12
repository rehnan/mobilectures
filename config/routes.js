/**
 * Route Mappings
 * (sails.config.routes)
 *
 * Your routes map URLs to views and controllers.
 *
 * If Sails receives a URL that doesn't match any of the routes below,
 * it will check for matching files (images, scripts, stylesheets, etc.)
 * in your assets directory.  e.g. `http://localhost:1337/images/foo.jpg`
 * might match an image file: `/assets/images/foo.jpg`
 *
 * Finally, if those don't match either, the default 404 handler is triggered.
 * See `api/responses/notFound.js` to adjust your app's 404 logic.
 *
 * Note: Sails doesn't ACTUALLY serve stuff from `assets`-- the default Gruntfile in Sails copies
 * flat files from `assets` to `.tmp/public`.  This allows you to do things like compile LESS or
 * CoffeeScript for the front-end.
 *
 * For more information on configuring custom routes, check out:
 * http://sailsjs.org/#/documentation/concepts/Routes/RouteTargetSyntax.html
 */

module.exports.routes = {

  /***************************************************************************
  *                                                                          *
  * Make the view located at `views/homepage.ejs` (or `views/homepage.jade`, *
  * etc. depending on your default view engine) your home page.              *
  *                                                                          *
  * (Alternatively, remove this and add an `index.html` file in your         *
  * `assets` directory)                                                      *
  *                                                                          *
  ***************************************************************************/
  /*
  '/': {
    view: 'homepage'
  }
  */

  //Routes Authentication
  '/': {
    controller: 'AuthController',
    action: 'root'
  },

  'GET /login': {
    controller: 'AuthController',
    action: 'index'
  },

  'POST /login': {
    controller: 'AuthController',
    action: 'signin'
  },

  'GET /signup': {
    controller: 'AuthController',
    action: 'signup'
  },

  'POST /signup': {
    controller: 'AuthController',
    action: 'create'
  },

  '/logout': {
    controller: 'AuthController',
    action: 'logout'
  },


    //SpeakerController Routes:
    'GET /speaker':{
        controller: 'SpeakerController',
        action: 'index'
    },

    'GET /speaker/session':{
        controller: 'SessionController',
        action: 'show'
    },

    //Rest to session quiz
    'GET /speaker/quiz':{
        controller: 'QuizController',
        action: 'show'
    },

    //Rest to session doubts
    'GET /speaker/doubts':{
        controller: 'DoubtsController',
        action: 'show'
    },

    //Rest to session polls
    'GET /speaker/polls':{
        controller: 'PollsController',
        action: 'show'
    },

    //######################################## REST TO LISTENERS

    'GET /speaker/listeners':{
        controller: 'ListenersController',
        action: 'index'
    },

    'GET /speaker/listeners/find': {
      controller: 'ListenersController',
      action: 'getAll'
    },

    'POST /speaker/listeners/create': {
      controller: 'ListenersController',
      action: 'create'
    },

    'PUT /speaker/listeners/update/:id': {
      controller: 'ListenersController',
      action: 'update'
    },

    'DELETE /speaker/listeners/delete/:id': {
      controller: 'ListenersController',
      action: 'destroy'
    },

    'GET /speaker/listeners/subscribe': {
      controller: 'ListenersController',
      action: 'subscribe'
    },

    'GET /listeners/join/:keySession':{
        controller: 'ListenersController',
        action: 'join'
    },

    //########################################
};
