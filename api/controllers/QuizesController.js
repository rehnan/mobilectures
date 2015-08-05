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
               //return res.redirect('speaker/sessions/'+session.id+'/quizes/'+record.id+'/alternatives');
               return res.redirect('speaker/sessions/'+session.id+'/quizes');
            } 

            req.flash('error', req.__('Erro ao criar quiz!'));
            return res.redirect('speaker/sessions/'+session.id+'/quizes');
         });
     });
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
