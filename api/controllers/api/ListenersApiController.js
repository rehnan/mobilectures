var application = sails.config.globals;

var ListenersApiController = {
   
   /*
    * Renderiza o index da opção Ouvintes Conectados
    */
   index: function(req, res) {
      var conditions = {id: req.param('session_id')};
      Session.findOne(conditions).populate('listeners').exec(function (err, session){
         if(err){return err;}
         var listeners = session.listeners;
         return res.json(listeners);
      });
   },
};

module.exports = ListenersApiController;
