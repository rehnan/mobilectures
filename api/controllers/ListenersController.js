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
      
      var conditions = {id: req.param('session_id'), owner: req.session.passport.user.id};

      Session.findOne(conditions).populate('listeners').exec(function (err, session) {
       if(err){return err;}
       Listener.subscribe(req.socket, session.listeners, ['create', 'update']);
     });
      Listener.watch(req.socket);
      Log.debug("Listener:  " + req.socket.id + " subscribed!");
      return res.json([200], {msg:"User: " + req.socket.id + " subscribed!"});
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
