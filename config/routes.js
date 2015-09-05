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
    * Force default locale
    */ 
   '/*': function(req, res, next) {
      req.setLocale('pt');
      res.setLocale('pt');
      return next();
   },

   /* ################# BEGIN AUTHENTICATION ROUTES ####################### */
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
   /* ################# END AUTHENTICATION ROUTES ####################### */


   /* ################# BEGIN SPEAKER ROUTES ####################### */
   'GET /speaker':{
      controller: 'SpeakersController',
      action: 'index'
   },
   /*
    * Routes to change current user perfil
    */
   'GET /speaker/:id/profile':{
      controller: 'SpeakersController',
      action: 'editProfile'
   },
   'POST /speaker/:id/profile':{
      controller: 'SpeakersController',
      action: 'updateProfile'
   },
   'GET /speaker/:id/password':{
      controller: 'SpeakersController',
      action: 'editPassword'
   },
   'POST /speaker/:id/password':{
      controller: 'SpeakersController',
      action: 'updatePassword'
   },
   /* ################# END SPEAKER ROUTES ####################### */
   
   /* ################# BEGIN SESSIONS ROUTES ####################### */
   'GET /speaker/sessions':{
      controller: 'SessionsController',
      action: 'index'
   },

   //Route to renderize form to new session
   'GET /speaker/sessions/new':{
      controller: 'SessionsController',
      action: 'new'
   },

   //Route to select some one session
   'GET /speaker/sessions/:id':{
      controller: 'SessionsController',
      action: 'show'
   },

   //Route to action create the new session
   'POST /speaker/sessions':{
      controller: 'SessionsController',
      action: 'create'
   },

   //Route to renderize edit form some one session
   'GET /speaker/sessions/edit/:id':{
      controller: 'SessionsController',
      action: 'edit'
   },

   //Route to action update the session in edit
   'POST /speaker/sessions/:id':{
      controller: 'SessionsController',
      action: 'update'
   },

   //Route to delete some one session
   'GET /speaker/sessions/delete/:id':{
      controller: 'SessionsController',
      action: 'destroy'
   },

/* ################# END SESSION REST ROUTES ####################### */

/* ################# BEGIN QUIZ REST ROUTES ####################### */

   'GET /speaker/sessions/:session_id/quizes':{
      controller: 'QuizesController',
      action: 'index'
   },

   'GET /speaker/sessions/:session_id/quizes/new':{
      controller: 'QuizesController',
      action: 'new'
   },

   'POST /speaker/sessions/:session_id/quizes':{
      controller: 'QuizesController',
      action: 'create'
   },

   'GET /speaker/sessions/:session_id/quizes/:quiz_id/questions/new':{
      controller: 'QuizesController',
      action: 'new_question'
   },

   'POST /speaker/sessions/:session_id/quizes/:quiz_id/questions':{
      controller: 'QuizesController',
      action: 'create_question'
   },

   'GET /speaker/sessions/:session_id/quizes/:quiz_id/questions/:question_id/delete':{
      controller: 'QuizesController',
      action: 'destroy_question'
   },

   'GET /speaker/sessions/:session_id/quizes/:quiz_id/questions/:question_id/edit':{
      controller: 'QuizesController',
      action: 'edit_question'
   },

   'POST /speaker/sessions/:session_id/quizes/:quiz_id/questions/:question_id':{
      controller: 'QuizesController',
      action: 'update_question'
   },

   'GET /speaker/sessions/:session_id/quizes/:quiz_id/questions':{
      controller: 'QuizesController',
      action: 'index_question'
   },

   'GET /speaker/sessions/:session_id/quizes/:quiz_id/edit':{
      controller: 'QuizesController',
      action: 'edit'
   },

   'POST /speaker/sessions/:session_id/quizes/:quiz_id/edit':{
      controller: 'QuizesController',
      action: 'update'
   },

   'GET /speaker/sessions/:session_id/quizes/:quiz_id/delete':{
      controller: 'QuizesController',
      action: 'destroy'
   },

   'GET /speaker/sessions/:session_id/quizes/:quiz_id/send':{
      controller: 'QuizesController',
      action: 'send'
   },


   'POST /speaker/sessions/:session_id/quizzes/:quiz_id/quizanswers/subscribe':{
      controller: 'QuizesController',
      action: 'subscribe'
   },

   /*'GET /speaker/sessions/:session_id/quizes/:quiz_id/close':{
      controller: 'QuizesController',
      action: 'close'
   },

   'GET /speaker/sessions/:session_id/quizes/:quiz_id/reports':{
      controller: 'QuizesController',
      action: 'reports'
   },

   'POST /speaker/sessions/:session_id/quizes/:quiz_id/quizesanswers/subscribe':{
      controller: 'QuizesController',
      action: 'subscribe'
   },*/

   /* ################# END QUIZ REST ROUTES ####################### */


   /* ################# BEGIN DOUBTS REST ROUTES ####################### */
   'GET /speaker/sessions/:session_id/doubts':{
      controller: 'DoubtsController',
      action: 'show'
   },

   'POST /speaker/sessions/:session_id/doubts/check/:doubt_id':{
      controller: 'DoubtsController',
      action: 'check'
   },

   'DELETE /speaker/sessions/:session_id/doubts/:doubt_id':{
      controller: 'DoubtsController',
      action: 'destroy'
   },

   'POST /speaker/sessions/:session_id/doubts/subscribe':{
      controller: 'DoubtsController',
      action: 'subscribe'
   },

   'GET /speaker/sessions/:session_id/doubts/count':{
      controller: 'DoubtsController',
      action: 'count'
   },

   /* ################# END DOUBTS REST ROUTES ####################### */


   /* ################# BEGIN LISTENERS ROUTES ####################### */
   'GET /speaker/sessions/:session_id/listeners':{
      controller: 'ListenersController',
      action: 'index'
   },

   'POST /speaker/sessions/:session_id/listeners/subscribe':{
      controller: 'ListenersController',
      action: 'subscribe'
   },
   /* ################# END LISTENERS ROUTES ####################### */



    /* ################# BEGIN POLL ROUTES ####################### */

    'GET /speaker/sessions/:session_id/polls':{
      controller: 'PollsController',
      action: 'index'
   },

    'POST /speaker/sessions/:session_id/polls':{
      controller: 'PollsController',
      action: 'create'
    },

    'GET /speaker/sessions/:session_id/polls/new':{
      controller: 'PollsController',
      action: 'new'
    },

   'GET /speaker/sessions/:session_id/polls/:poll_id':{
      controller: 'PollsController',
      action: 'show'
   },

   'GET /speaker/sessions/:session_id/polls/:poll_id/edit':{
      controller: 'PollsController',
      action: 'edit'
   },

   'POST /speaker/sessions/:session_id/polls/:poll_id/edit':{
      controller: 'PollsController',
      action: 'update'
   },

   'GET /speaker/sessions/:session_id/polls/:poll_id/delete':{
      controller: 'PollsController',
      action: 'destroy'
   },

   'GET /speaker/sessions/:session_id/polls/:poll_id/alternatives':{
      controller: 'PollsController',
      action: 'new_alternatives'
   },

   'POST /speaker/sessions/:session_id/polls/:poll_id/alternatives':{
      controller: 'PollsController',
      action: 'update_alternatives'
   },

   'GET /speaker/sessions/:session_id/polls/:poll_id/send':{
      controller: 'PollsController',
      action: 'send'
   },

   'GET /speaker/sessions/:session_id/polls/:poll_id/close':{
      controller: 'PollsController',
      action: 'close'
   },

   'GET /speaker/sessions/:session_id/polls/:poll_id/reports':{
      controller: 'PollsController',
      action: 'reports'
   },

   'POST /speaker/sessions/:session_id/polls/:poll_id/pollanswers/subscribe':{
      controller: 'PollsController',
      action: 'subscribe'
   },

    /* ################# END POLL ROUTES   ####################### */


   /* ################# MOBILE API ####################### */
   'POST /api/listeners':{
      controller: 'api/AuthApiController',
      action: 'create'
   },
   
   'POST /api/listeners/join':{
      controller: 'api/AuthApiController',
      action: 'join'
   },

   'GET /api/listeners/leave':{
      controller: 'api/AuthApiController',
      action: 'leave',
   },

   'GET /api/sessions/:session_id/listeners': {
      controller: 'api/ListenersApiController',
      action: 'index'
   },

   'GET /api/doubts':{
      controller: 'api/DoubtsApiController',
      action: 'index'
   },

   'POST /api/doubts':{
      controller: 'api/DoubtsApiController',
      action: 'create'
   },

   'POST /api/poll_answers':{
      controller: 'api/PollAnswersApiController',
      action: 'create'
   },

   'POST /api/quiz_answers':{
      controller: 'api/QuizAnswersApiController',
      action: 'create'
   }

   /* ################# END MOBILE API ################### */

};
