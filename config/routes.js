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

  'GET /signup/new': {
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


  //Route to renderize the index (inicial page) of application
  'GET /speaker':{
      controller: 'SpeakerController',
      action: 'index'
  },

  //Route to renderize form to new session
  'GET /speaker/show/:id/profile':{
      controller: 'SpeakerController',
      action: 'getFormProfile'
  },

  //Route to renderize form to new session
  'POST /speaker/show/:id/profile':{
      controller: 'SpeakerController',
      action: 'updateProfile'
  },

  //Route to compare password
  'POST /speaker/compare':{
      controller: 'SpeakerController',
      action: 'comparePassword'
  },

  //Route to compare password
  'POST /speaker/show/:id/password':{
      controller: 'SpeakerController',
      action: 'updatePassword'
  },

  //Route to compare password
  'GET /speaker/show/:id/password':{
      controller: 'SpeakerController',
      action: 'getFormPassword'
  },
    
    //################################## Begin SESSIONS Routes
    //Route to get all Sessions
    'GET /speaker/sessions':{
        controller: 'SessionController',
        action: 'index'
    },

    //Route to renderize form to new session
    'GET /speaker/sessions/new':{
        controller: 'SessionController',
        action: 'new'
    },

    //Route to action create the new session
    'POST /speaker/sessions':{
        controller: 'SessionController',
        action: 'create'
    },

    //Route to renderize edit form some one session
    'GET /speaker/sessions/edit/:id':{
        controller: 'SessionController',
        action: 'edit'
    },

    //Route to action update the session in edit
    'POST /speaker/sessions/:id':{
        controller: 'SessionController',
        action: 'update'
    },

    //Route to delete some one session
    'GET /speaker/sessions/delete/:id':{
        controller: 'SessionController',
        action: 'destroy'
    },

    //Route to select some one session
    'GET /speaker/sessions/:id':{
        controller: 'SessionController',
        action: 'select'
    },

    //################################## End SESSIONS Routes


   
    //Rest to session quiz
    'GET /speaker/sessions/:id/quiz':{
        controller: 'QuizController',
        action: 'show'
    },

    //Rest to session doubts
    'GET /speaker/sessions/:id/doubts':{
        controller: 'DoubtsController',
        action: 'show'
    },

    //Rest to session polls
    'GET /speaker/sessions/:id/polls':{
        controller: 'PollsController',
        action: 'show'
    },

    //######################################## REST TO LISTENERS

    'GET /speaker/sessions/:id/listeners':{
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
    
    'GET /speaker/listeners/join':{
        controller: 'ListenersController',
        action: 'join'
    },

    'POST /speaker/listeners/leave':{
        controller: 'ListenersController',
        action: 'leave'
    },

    //Está ação deve estar no controller DoubtsController
    'POST /speaker/listeners/doubt':{
        controller: 'ListenersController',
        action: 'doubtReceived'
    },

    'POST /speaker/listeners/message':{
        controller: 'ListenersController',
        action: 'sendMessage'
    }
    //########################################
};
