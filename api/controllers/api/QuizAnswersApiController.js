/**
 * PollAnswersController
 *
 * @description :: Server-side logic for managing Pollanswers
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

 var QuizAnswersApiController = {
 	create: function (req, res) {
 		
 		QuizAnswersApiController.beforeAction(req, res, function (session) {
 			
      var params = req.params.all();
      
      //Compare answers to pontuation
      if(params.alternative === params.correct_alternative) {
        params.pointing = (params.pointing + params.time);
        params.hit = true;
      } else {
        params.pointing = 0;
      }
         Log.info(params);
 			QuizAnswer.createIfValid(params, function (errors, register) {
 				if (errors) { return res.json([401], {errors: errors}); } 
       
 				if (!register) { 
          Log.error('Quiz Inexistente/Encerrado!');
          return res.json([401], {errors: 'Quiz Encerrado!'});
        } 
        var conditions = {};
        conditions.quiz = params.quiz;
        conditions.listener = params.listener;

        Ranking.ranking_update(conditions, params.pointing, function(err, rank){
          if(err) { Log.error(err); }
          Log.info('Ranking Updated Success!');
        });
        Log.info('Resposta Registrada com Sucesso!');
        return res.json([200], {quiz:register});
 			});
 		});
 	},

  create_ranking: function (req, res) {
    QuizAnswersApiController.beforeAction(req, res, function (session) {
      var params = req.params.all();
          Log.info('Creating Ranking to listener...');
          Log.json(params);
          Ranking.findOrCreate({listener:params.listener, quiz:params.quiz}, params).exec(function (err, ranking){
            if (err) { return res.json([401], {errors: 'Erro ao tentar criar Ranking! '+err});} 
            return res.json([200], {ranking:ranking});
          });
    });
  },

  listener_ranking: function (req, res) {
      QuizAnswersApiController.beforeAction(req, res, function (session) {

         var params = req.params.all();
         var conditions = {quiz: params.quiz_id, sort: { pointing:-1, createdAt: -1 }};
         var data = {};

         Quiz.findOne({id:params.quiz_id}).populate('questions').exec(function(err, quiz){ 
            data.quiz = quiz;
            Ranking.find(conditions).populate('listener').exec(function(err, ranking){
               if(err) { return Log.error(err); }
               data.ranking = ranking;
               data.place = 'Não está no ranking';
               for(i = 0; i < ranking.length; i++) {
                     Log.info(typeof(ranking[i].listener.id)+" == "+typeof(params.listener.id));
                     if(ranking[i].listener.id === params.listener.id) { 
                        data.place = (i+1)+'º Lugar';
                        data.listener = ranking[i].listener;
                     }
               }
               QuizAnswer.count().where({hit:true, quiz:params.quiz_id, listener:params.listener_id}).exec(function(err, hits){
                  if(err) { return Log.error(err); }
                  data.hits = hits;
                  QuizAnswer.find({quiz:params.quiz_id, listener:params.listener_id, hit:true}).sum('pointing').exec(function(err, pointing){
                     if(err) { return Log.error(err); }
                     data.pointing = pointing[0].pointing;
                     Log.error(data.place);
                     return res.json([200], data);
                  });
               });
            });
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

 module.exports = QuizAnswersApiController;