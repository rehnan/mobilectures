var application = sails.config.globals;

var PollsController = {

   show: function(req, res) {
      PollsController.beforeAction(req, res, function (session) {
         application.title = req.__('poll.show.title');
         res.view('speaker/polls/show', {layout: 'layouts/session', session: session});
      });
   },


   /**
    * Controller methods
    * Find the session
    */
   beforeAction: function(req, res, callback) {
      var conditions = {id: req.param('session_id'), owner: req.session.passport.user.id};
      sails.log.debug('Polls conditions ==> ' + JSON.stringify(conditions));
      Session.findOne(conditions).exec(function (err, session){
         if(err){return err;}
         if(!session) {
            req.flash('error', 'Sessão inexistente!!!');
            return res.redirect('speaker/sessions');
         }

         sails.log.debug('Polls session ==> ' + JSON.stringify(session));
         callback(session);
      });
   },

};

module.exports = PollsController;
