var application = sails.config.globals;

var PollsController = {

 index: function(req, res) {
  PollsController.beforeAction(req, res, function (session) {
   application.title = req.__('poll.show.title');
   res.view('speaker/polls/index', {layout: 'layouts/session', session: session});
});
},

    /* Action new | Method: GET - 
    * Renderiza view do formulário
    */ 
    new: function(req, res) {
      //Log.debug('Rendering new sessions view form for user: ' + req.session.passport.user.id);
      PollsController.beforeAction(req, res, function (session) {
       application.title = req.__('poll.index.title');
       return res.view('speaker/polls/new', {errors: {}, poll: Poll.new, session:session});
    });
   },

   create: function(req, res) {
      PollsController.beforeAction(req, res, function (session) {
        var params = req.params.all();
        params.session = session.id;
        
        Poll.createIfValid(params, req, function (errors, record) {
            if (errors) {
                  sails.log.debug('Error ==> ' + JSON.stringify(errors));
                  req.flash('error', req.__('global.flash.form.error'));
                  return res.view('speaker/polls/new', {errors: pretty_errors,  poll: req.params.all(), session:session});
            } else {
               req.flash('success', req.__('global.flash.create.success', {name: req.param('title')}));
               return res.redirect('speaker/sessions/'+session.id+'/polls');
            }
         });
     });
   },

   show: function(req, res) {

   },

   /**
    * Controller methods
    * Find the session
    */
    beforeAction: function(req, res, callback) {

      if(!req.session.passport.user) {
        req.flash('error', 'Você deve estar logado!!!');
        return res.redirect('/login');
     }

     var conditions = {id: req.param('session_id'), owner: req.session.passport.user.id};
     sails.log.debug('Polls conditions ==> ' + JSON.stringify(conditions));
     Session.findOne(conditions).exec(function (err, session){
       if(err){return err;}
       if(!session) {
        req.flash('error', 'Sessão inexistente!!!');
        return res.redirect('speaker/sessions');
     }

     sails.log.debug('Polls session ==> ' + JSON.stringify(session));
     callback(session);
  });
  },

};

module.exports = PollsController;
