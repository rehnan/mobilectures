var application = sails.config.globals;

var QuizesController = {

   index: function (req, res) {
      QuizesController.beforeAction(req, res, function (session) {
         application.title = req.__('quiz.show.title');
         Session.findOne({id:session.id}).populate('quizes', {enabled:true}).exec(function (err, session) {
           if(err){return Log.error(err);}

           if(session.quizes.length > 0){
             return res.view('speaker/quizes/index', {layout: 'layouts/session', session: session, quizes: session.quizes});
          } else {
             req.flash('info', 'Não há nenhum quiz cadastrado!');
             return res.view('speaker/quizes/index', {layout: 'layouts/session', session: session, quizes: {}});
          }
       });
      });
   },

   new: function (req, res) {
      QuizesController.beforeAction(req, res, function (session) {
         application.title = req.__('quiz.index.title');
         return res.view('speaker/quizes/new', {errors: {}, quiz: Quiz.new, session:session});
      });
   },

   create: function (req, res) {
      QuizesController.beforeAction(req, res, function (session) {
         var params = req.params.all();
         params.session = session.id;
         Log.debug(params);
         Quiz.createIfValid(params, req, function (errors, record) {
            if (errors) {
               sails.log.debug('Error ==> ' + JSON.stringify(errors));
               req.flash('error', req.__('global.flash.form.error'));
               return res.view('speaker/quizes/new', {errors: pretty_errors,  quiz: req.params.all(), session:session});
            }

            if(record) {
               req.flash('success', req.__('global.flash.create.success', {name: req.param('title')}));
               return res.redirect('speaker/sessions/'+session.id+'/quizes/'+record.id+'/questions/new');
               return res.redirect('speaker/sessions/'+session.id+'/quizes');
            } 

            req.flash('error', req.__('Erro ao criar quiz!'));
            return res.redirect('speaker/sessions/'+session.id+'/quizes');
         });
      });
   },

   new_question: function (req, res) {
      QuizesController.beforeAction(req, res, function (session) {
         application.title = req.__('quiz.config.title');
         var params = req.params.all();

         Log.debug(req.params.all());
         Quiz.findOne({id:params.quiz_id, session:params.session_id, enabled:true}).populate('questions').exec(function (err, quiz) {
            if(err){return Log.error(err);}

            Log.json(quiz);
            if(!quiz) {
               req.flash('error',  'Quiz Inexistente!!');
               return res.redirect('speaker/sessions/'+session.id+'/quizes');
            }

            return res.view('speaker/quizes/new_question', {layout: 'layouts/session', errors: {}, quiz: quiz, question:QuizQuestion.new, session:session});
         });
      });
   },

   create_question: function (req, res) {
      Log.debug('Create Action Called');

      QuizesController.beforeAction(req, res, function (session) {
         application.title = req.__('quiz.show.title');
         var params = req.params.all();
         params.quiz = req.param('quiz_id');

         Log.info(params);
         QuizQuestion.createIfValid(params, function (errors, quiz, question) {
            if(errors){
               req.flash('error',  'Possuem erros no formulário de nova questão!');
               return res.view('speaker/quizes/new_question', {layout: 'layouts/session', errors: errors, quiz: quiz, question:params,session:session});
            }

            if(!quiz){
               req.flash('error',  'Quiz Inexistente!!');
               return res.redirect('speaker/sessions/'+session.id+'/quizes');
            } 

            if(!question){
               req.flash('error',  'Não foi possível criar esta questão!');
               return res.redirect('speaker/sessions/'+session.id+'/quizes/'+quiz.id+'/questions/new');
            } 

            req.flash('success',  'Questão criada com sucesso!');
            return res.redirect('speaker/sessions/'+session.id+'/quizes/'+quiz.id+'/questions/new');
         });
      });
   },

   destroy_question: function(req, res) {

      QuizesController.beforeAction(req, res, function (session) {
         var params = req.params.all();
         Quiz.findOne({id:params.quiz_id}).populate('questions').exec(function (err, quiz) {
            if(err) { return Log.error(err); }

            if(!quiz) {
               req.flash('error',  'Quiz Inexistente!');
               return res.redirect('speaker/sessions/'+session.id+'/quizes'); 
            }

            if(quiz.questions.length > 0) {
               quiz.questions.remove(params.question_id);
            } else {
               req.flash('error',  'Não existem questões a serem removidas!');
               return res.redirect('speaker/sessions/'+session.id+'/quizes/'+quiz.id+'/questions/new'); 
            }

            quiz.save(Log.info('Removendo Questão...'));
            req.flash('success',  'Questão removida com sucesso!');
            return res.redirect('speaker/sessions/'+session.id+'/quizes/'+quiz.id+'/questions/new'); 
         });
      });
   },

   edit_question: function (req, res) {
      Log.info('Renderize Form Edit!');
   },

   update_question: function (req, res) {
      Log.info('Call Update Method!');
   },
   /*
    * Controller methods
    * Find the session
    */
    beforeAction: function(req, res, callback) {
      var conditions = {id: req.param('session_id'), owner: req.session.passport.user.id};
      Session.findOne(conditions).exec(function (err, session){
         if(err){return err;}
         if(!session) {
            req.flash('error', 'Sessão inexistente!!!');
            return res.redirect('speaker/sessions');
         }
         callback(session);
      });
   },
};

module.exports = QuizesController;
