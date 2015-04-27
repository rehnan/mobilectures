var application = sails.config.globals;

var DoubtsController = {

   show: function(req, res) {
      DoubtsController.beforeAction(req, res, function (session) {
         application.title = req.__('doubt.show.title');
         res.view('speaker/doubts/show', {layout: 'layouts/session', session: session});
      });
   },


   /**
    * Controller methods
    * Find the session
    */
   beforeAction: function(req, res, callback) {
      var conditions = {id: req.param('session_id'), owner: req.session.passport.user.id};
      sails.log.debug('Doubts conditions ==> ' + JSON.stringify(conditions));
      Session.findOne(conditions).exec(function (err, session){
         if(err){return err;}
         if(!session) {
            req.flash('error', 'Sessão inexistente!!!');
            return res.redirect('speaker/sessions');
         }

         sails.log.debug('Doubts session ==> ' + JSON.stringify(session));
         callback(session);
      });
   },

};

module.exports = DoubtsController;
