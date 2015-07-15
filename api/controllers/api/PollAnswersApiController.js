/**
 * PollAnswersController
 *
 * @description :: Server-side logic for managing Pollanswers
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

 var PollAnswersApiController = {
 	create: function (req, res) {
 		
 		PollAnswersApiController.beforeAction(req, res, function (session) {
 			var params = req.params.all();
 			    params.listener = req.session.listener.id;
      Log.json(params);
 			PollAnswer.createIfValid(params, function (errors, register) {
 				if (errors) { return res.json([401], {errors: errors}); } 
 				if (!register) { return res.json([401], {errors: 'Enquete inexistente/Encerrada!'});}
 				return res.json([200]);
 			});
 		});
 	},

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

 module.exports = PollAnswersApiController;