var application = sails.config.globals;

var QuizController = {

   index: function(req, res) {
      QuizController.beforeAction(req, res, function (session) {
         application.title = req.__('quiz.show.title');
         return res.view('speaker/quizes/index', {layout: 'layouts/session', session: session});
      });
   },


   /**
    * Controller methods
    * Find the session
    */
   beforeAction: function(req, res, callback) {
      var conditions = {id: req.param('session_id'), owner: req.session.passport.user.id};
      sails.log.debug('Quiz show conditions ==> ' + JSON.stringify(conditions));
      Session.findOne(conditions).exec(function (err, session){
         if(err){return err;}
         if(!session) {
            req.flash('error', 'Sessão inexistente!!!');
            return res.redirect('speaker/sessions');
         }

         sails.log.debug('Quiz show session ==> ' + JSON.stringify(session));
         callback(session);
      });
   },
};

module.exports = QuizController;
