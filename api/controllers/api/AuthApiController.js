/**
 * Auth Controller API
 */
var application = sails.config.globals;
var passport = require('passport');

var AuthApiController = {

   /**
    * Create a listener
    */
   create: function (req, res) {
      Log.debug('Params create listener => ' + JSON.stringify(req.params.all()));
      var params = req.param('user');
      Listener.createIfValid(params, function (errors, listener) {
         if (errors) {
            Log.debug('Error create listener => ' + JSON.stringify(errors));
            res.json([401], {errors: errors, listener: req.params.all()});
         } else {
            res.json([200], {listener: listener});
         }
      });
   },

   /**
    * listener Join in session
    */
   join: function(req, res) {
      Log.info("Controller: ApiAuth; action: join; params " + JSON.stringify(req.params.all()));

      var user_params = req.param('user');
      var session_conditions = { key: req.param('session_id') };

      /*
       * First check if a session exists
       */
      Session.findOne(session_conditions, function (s_err, session){
         if (s_err || !session) {
            Log.info("Listener authenticate session not found " + JSON.stringify(s_err));
            return res.json([401], { authorization: 'denied', error: { message: sails.__('api.listener.auth.session_not_found') }});
         }
         Log.info("Listener authenticate session found " + JSON.stringify(session));

         // Check if session is open
         if (session.status == false) {
            return res.json([401], { authorization: 'denied', error: { message: sails.__('api.listener.auth.session_closed') }});
         }

         Listener.authenticate(user_params, function(u_err, listener){
            if (u_err) { 
               u_err['authorization'] = 'denied';
               return res.json([401], u_err);
            }
            Log.info("Listener authenticate with succcess" + JSON.stringify(listener));

            // Added user on session
            session.listeners.add(listener);
            session.save(function(ss_err, s) {
               if(ss_err){
                  Log.debug('Listesne ['+JSON.stringify(ss_err)+']');}
                  else{
                     //Publica Criação de um novo listener na sessão
                     Listener.publishCreate(listener);
                     sails.log.debug('Registro de um novo listener na sessão');
                  }
            });

            /* This subscribes clients to one or more existing model instances
             (records). It allows clients to see message emitted by
             .publishUpdate(), .publishDestroy(), .publishAdd() and
             .publishRemove
              Sobrescrevendo lista de sessoes e dúvidas            
            */
            Listener.subscribe(req.socket, session.listeners, ['update', 'create']);

            // Subscribes a socket to a generic room.
            sails.sockets.join(req.socket, session.id);

            //Modelos a serem assistidos pela requisição socket
            Listener.watch(req.socket);

            // Update listener logged room
            listener.logged_room = session.id
            listener.save(function (err, record) {
               Log.debug('Published Update ' + JSON.stringify(listener));
               Listener.publishUpdate(listener.id, {logged_room:session.id});
            });

            // Save listener on session
            req.session.listener = listener;

            sails.sockets.broadcast(session.id, 'welcome-msg', 'Seja bem vindo a palestra ' + session.name);
            return res.json([200],{authorization: 'authorized', session: session});
         });
      });
   },

   /**
    * listener leave a session 
    */
   leave: function(req, res) {
      Listener.leave(req.session, req.socket);
      return res.json([200],{authorization: 'bye'});
   },
};

module.exports = AuthApiController;
