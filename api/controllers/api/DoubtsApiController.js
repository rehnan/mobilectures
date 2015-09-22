var application = sails.config.globals;

var DoubtsApiController = {

   /*
   */
   index: function(req, res) {

      DoubtsApiController.beforeAction(req, res, function (session) {
         var params = {};
             params.listener_id = req.session.listener.id;
             params.session_id  = req.session.listener.logged_room;

         Doubt.findAll(params, function (err, response) {
            if(err){return res.json([401], {error:err});}

            if(response.status){
               return res.json([200], {doubts: response.doubts});
            } else {
               return res.json([401], {doubts: {}});
            }
         });
      });
   },

   create: function(req, res) {
      DoubtsApiController.beforeAction(req, res, function (session) {
      	var params = req.param('doubt');
      	Doubt.createIfValid(params, req, function (errors, record, index) {
      		if (errors) {
      			sails.log.debug('Error ==> ' + JSON.stringify(errors));
      			res.json([401], {errors: errors});
      		} else {
      			res.json([200], {doubt:record, index:index});
      		}
      	});
      });
   },

   /**
    * Controller methods
    * Find the session
    */
    beforeAction: function(req, res, callback) {
      //Verifica se o ouvinte tem uma sessão e se  ele está está logado na sala
      if (!req.session.listener || !req.session.listener.logged_room) {
            res.json([401], 'Você deve estar logado!');
      } else {
          //Verifica se o ouvintes está logado  Log.info(JSON.stringify(req.session)) : Log.info(JSON.stringify(req.session));
          if(!req.session.listener.logged_room || !req.session.listener.logged_room){Log.error('Este ouvinte não está logado!');}
          
          //Verifica se a sessão existe
          var conditions = {id: req.session.listener.logged_room};
          Session.findOne(conditions).exec(function (err, session){
             if(err){return Log.error(err);}
             if(!session) {
                req.json([401], 'Sessão inexistente!!!');
             }
             callback(session);
          });
      }
    },
};

module.exports = DoubtsApiController;

