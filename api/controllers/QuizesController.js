var application = sails.config.globals;

var QuizesController = {

   index: function (req, res) {
      QuizesController.beforeAction(req, res, function (session) {
         application.title = req.__('quiz.show.title');
         var orders_by = {sort: {createdAt: -1}, enabled:true};
         Session.findOne({id:session.id}).populate('quizes', orders_by).exec(function (err, session) {
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

   edit: function(req ,res) {
      application.title = req.__('quiz.edit.title');
      QuizesController.beforeAction(req, res, function (session) {

      if(session.quizes.length === 0) {
         req.flash('error', 'Quiz inexistente!!!');
         return res.redirect('/speaker/sessions/'+session.id+'/quizes');
      }
      
      var quiz = session.quizes[0];
      return res.view('speaker/quizes/edit', {errors: {}, quiz: quiz, quiz_id: quiz.id, session_id:session.id, session:session});
        
      });
   },

   update: function(req, res) {
      QuizesController.beforeAction(req, res, function (session) {

         if(session.quizes.length === 0) {
            req.flash('error', 'Quiz inexistente!!!');
            return res.redirect('/speaker/sessions/'+session.id+'/quizes');
         }
         
         var params = req.params.all();
         Quiz.updateIfValid(params, function (errors, quiz) {
            var quiz = session.quizes[0];
            if(errors){
               req.flash('error', 'Possuem erros no formulário!');
               return res.view('speaker/quizes/edit', {errors: errors, quiz: req.params.all(), quiz_id: quiz.id, session_id:session.id, session:session});
            }

            if (!quiz) {
               req.flash('error', 'Quiz inexistente!!!');
               return res.redirect('/speaker/sessions/'+session.id+'/quizes');
            }

            req.flash('success', 'Quiz '+params.title+' atualizado com sucesso!');
            return res.redirect('speaker/sessions/'+session.id+'/quizes');
         });
     });
   },

   destroy: function(req, res) {
       QuizesController.beforeAction(req, res, function (session) {
         var params = req.params.all();
         params.owner = session.owner.id;
         Quiz.disable(params, function(err, response){
            if(err) {Log.error(err);}

            if(!response) {
               req.flash('error', 'Erro ao excluir quiz!');
               return res.redirect('/speaker/sessions/'+session.id+'/quizes');
            }

            if(response.status){
               req.flash('success', 'Quiz excluído com sucesso!');
               return res.redirect('/speaker/sessions/'+session.id+'/quizes');
            }

            req.flash('error', 'Quiz inexistente!!!');
            return res.redirect('/speaker/sessions/'+session.id+'/quizes');
         });
      });
   },

   send: function (req, res) {

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
            return res.redirect('speaker/sessions/'+session.id+'/quizes/'+quiz.id+'/questions');
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
            return res.redirect('speaker/sessions/'+session.id+'/quizes/'+quiz.id+'/questions'); 
         }

         quiz.save(function(){
            Log.info('Removendo Questão...')
            req.flash('success',  'Questão removida com sucesso!');
            return res.redirect('speaker/sessions/'+session.id+'/quizes/'+quiz.id+'/questions');
         });
      });
   });
},

edit_question: function (req, res) {
 QuizesController.beforeAction(req, res, function (session) {
   application.title = req.__('quiz.config.title');
   var params = req.params.all();

   Quiz.findOne({id:params.quiz_id, session:params.session_id, enabled:true}).populate('questions', {id:params.question_id}).exec(function (err, quiz) {
      if(err){return Log.error(err);}

      if(!quiz) {
         req.flash('error',  'Quiz Inexistente!!');
         return res.redirect('speaker/sessions/'+session.id+'/quizes');
      }

      if(quiz.questions.length > 0) {
         var question = quiz.questions[0];
         return res.view('speaker/quizes/edit_question', {layout: 'layouts/session', errors: {}, quiz: quiz, session:session, question: question});
      }

      req.flash('error',  'Questão inexistente!!');
      return res.redirect('speaker/sessions/'+session.id+'/quizes/'+quiz.id+'/questions');
   });
});
},

update_question: function (req, res) {

   QuizesController.beforeAction(req, res, function (session) {
      QuizQuestion.updateIfValid(req.params.all(), function(errors, question){
         var quiz = session.quizes[0];
         if(errors) {
            Log.error(req.params.all());
            req.flash('error',  'Possuem erros no formulário de edição da questão!');
            return res.view('speaker/quizes/edit_question', {layout: 'layouts/session', errors: errors, quiz: quiz, session:session, question: req.params.all()});
         }

         if(!question) {
            req.flash('error',  'Questão não encontrada para atualização!');
            return res.redirect('speaker/sessions/'+session.id+'/quizes/'+quiz.id+'/questions');
         }

         req.flash('success',  'Questão '+question.id+' atualizada com sucesso!');
         return res.redirect('speaker/sessions/'+session.id+'/quizes/'+quiz.id+'/questions');
      });
   });
},

index_question:  function (req, res) {
   QuizesController.beforeAction(req, res, function (session) {
      application.title = req.__('quiz.config.title');
      var params = req.params.all();
      var orders_by = {sort: { status:'invalid', createdAt: -1}};
      Quiz.findOne({id:params.quiz_id, session:params.session_id, enabled:true}).populate('questions', orders_by).exec(function (err, quiz) {
         if(err){return Log.error(err);}

         if(!quiz) {
            req.flash('error',  'Quiz Inexistente!!');
            return res.redirect('speaker/sessions/'+session.id+'/quizes');
         }

         var questions = quiz.questions.length;
         req.flash('info',  'Este QUIZ possui possui '+questions+' questões cadastradas');

         return res.view('speaker/quizes/index_question', {layout: 'layouts/session', errors: {}, quiz: quiz, session:session});
      });
   });
},
   /*
    * Controller methods
    * Find the session
    */
    beforeAction: function(req, res, callback) {
      var conditions = {id: req.param('session_id'), owner: req.session.passport.user.id};
      Session.findOne(conditions).populate('quizes', {id: req.param('quiz_id')}).exec(function (err, session){
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
