var application = sails.config.globals;

var ListenersController = {

   /*
    * Renderiza o index da opção Ouvintes Conectados
    */
   index: function(req, res) {
      application.title = req.__('option_listeners');
      ListenersController.beforeAction(req, res, function (session) {
         application.title = req.__('listener.index.title');
         return res.view('speaker/listeners/index', {layout: 'layouts/session', session: session});
      });
   },

   /**
    * Subscribes all Listeners to see changes
    */
   subscribe: function(req, res) {
      Listener.find({}).exec(function(e,listeners){
         Listener.subscribe(req.socket, listeners, ['create', 'update']);
      });
      Listener.watch(req.socket);
      sails.log.debug("Listener: " + req.socket.id + " subscribed!");
      return res.json({msg:"User: " + req.socket.id + " subscribed!"});
   },


   /**
    * Controller methods
    * Find the session
    */
   beforeAction: function(req, res, callback) {
      var conditions = {id: req.param('session_id'), owner: req.session.passport.user.id};
      sails.log.debug('Listener conditions ==> ' + JSON.stringify(conditions));
      Session.findOne(conditions).exec(function (err, session){
         if(err){return err;}
         if(!session) {
            req.flash('error', 'Sessão inexistente!!!');
            return res.redirect('speaker/sessions');
         }

         sails.log.debug('Listener session ==> ' + JSON.stringify(session));
         callback(session);
      });
   },
};

module.exports = ListenersController;
