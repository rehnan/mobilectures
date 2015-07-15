var application = sails.config.globals;

var PollsController = {

  index: function(req, res) {
    PollsController.beforeAction(req, res, function (session) {
      Poll.findAll(session, function(error, response){
        if(error){return Log.error(error);}

        application.title = req.__('poll.show.title');
        if(response.status){
          res.view('speaker/polls/index', {layout: 'layouts/session', session: session, polls: response.polls});
       } else {
          res.view('speaker/polls/index', {layout: 'layouts/session', session: session, polls: {}});
       }
    });
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
        return res.redirect('speaker/sessions/'+session.id+'/polls/'+record.id+'/alternatives');
     }
  });
 });
},

edit: function(req ,res) {
   Log.info('Action: edit called! ');
   PollsController.beforeAction(req, res, function (session) {
     application.title = req.__('poll.edit.title');

     var conditions = {id: session.id, owner: req.session.passport.user.id };
     var poll_id = req.param('poll_id');
     var session_id = req.param('session_id')

     Session.findOne(conditions).populate('polls', {id: poll_id}).exec(function (err, session){
       if(!session) {
         req.flash('error', 'Sessão inexistente!!!');
         return res.redirect('speaker/sessions');
      }

      if(session.polls.length === 0) {
         req.flash('error', 'Enquete inexistente!!!');
         return res.redirect('/speaker/sessions/'+session.id+'/polls');
      }

      var poll = session.polls[0];
      application.title = req.__('session.edit.title');
      return res.view('speaker/polls/edit', {errors: {}, poll: poll, poll_id: poll_id, session_id:session_id, session:session});
   });
  });
},

update: function(req, res) {
   Log.info('Action: update called!');

   PollsController.beforeAction(req, res, function (session) {

     var params = req.params.all();
     params.session = session.id;
     var poll_id = req.param('poll_id');
     var session_id = req.param('session_id')

     Poll.updateIfValid(params, function (errors, response) {
       if(response.errors){return Log.error(response.errors);}
       if (response.validation_errors) {
         sails.log.debug('Error ==> ' + JSON.stringify(errors));
         req.flash('error', req.__('global.flash.form.error'));
         return res.view('speaker/polls/edit', {errors: response.validation_errors, poll: req.params.all(), poll_id: poll_id, session_id:session_id, session:session});
      }

      if(response.poll_error){
         req.flash('error', response.poll_error);
         return res.redirect('speaker/sessions/'+session.id+'/polls');
      } 

      application.title = req.__('session.edit.title');
      req.flash('info', 'Enquete '+params.title+' atualizada com sucesso!');
      return res.redirect('speaker/sessions/'+session.id+'/polls');

   });
  });
},

destroy: function(req, res) {

 PollsController.beforeAction(req, res, function (session) {
   var params = req.params.all();
   params.owner = session.owner;
   Poll.disable(params, function(err, response){
      if(err) {Log.error(err);}

      if(!response) {
         req.flash('error', 'Erro ao excluir enquete!');
         return res.redirect('/speaker/sessions/'+session.id+'/polls');
      }

      if(response.status){
         req.flash('success', 'Enquete excluída com sucesso!');
         return res.redirect('/speaker/sessions/'+session.id+'/polls');
      }

      req.flash('error', 'Enquete inexistente!!!');
      return res.redirect('/speaker/sessions/'+session.id+'/polls');
   });
});
},

show: function(req, res) {
  Log.info('Action: show called!');

},

chart: function (req, res) {
  PollsController.beforeAction(req, res, function (session) {
    var params = req.params.all();

    Poll.findOne({id:params.poll_id, session:params.session_id}, function (err, found_poll) {
        if (err) {return Log.error(err); }

        if (!found_poll) {
          req.flash('error', 'Enquete inexistente!!');
          return res.redirect('/speaker/sessions/'+session.id+'/polls');
        }

        if (found_poll.status !== 'closed') {
          req.flash('error', 'A enquete deve estar encerrada para a visualização do relatório de estatística!');
          return res.redirect('/speaker/sessions/'+session.id+'/polls');
        }
       
        return res.view('speaker/polls/chart', {layout: 'layouts/session', session: session, poll:found_poll});
    });
  });
},

statistics: function (req, res) {
  PollsController.beforeAction(req, res, function (session) {
    Poll.findOne({id:req.param('poll_id'), status:'closed'}).exec(function(err, poll) { 
      if (err) { return Log.error(err); }
      if (!poll) {
        return res.json([401], {error:'Enquete inexistente!!'});
      }
      return res.json([200], poll.statistics);
    });
  });
},

new_alternatives: function(req, res) {

   PollsController.beforeAction(req, res, function (session) {
      var params = req.params.all();
      params.owner = session.owner;
      Poll.find(params, function(err, response){
         if(err) {Log.error(err);}

         if(response.status){
            return res.view('speaker/polls/alternatives', {layout: 'layouts/session', errors: {}, poll: response.poll, session:session});
         }

         req.flash('error', 'Enquete inexistente!!!');
         return res.redirect('/speaker/sessions/'+session.id+'/polls');
      });
   });
},

update_alternatives: function (req, res) {

   PollsController.beforeAction(req, res, function (session) {

      Poll.updateQuestionIfValid(req.params.all(), function(err, response){
        Log.json(req.params.all());
        if(err) {Log.error(err);}
        if(response.has_errors) {

          req.flash('error', 'Você deve informar a questão de enquete!');
          return res.view('speaker/polls/alternatives', {layout: 'layouts/session', errors: response.errors, poll: req.params.all(), session:session});
       } else {
        req.flash('success', 'Questão e alternativas atualizadas com sucesso!');
        return res.redirect('/speaker/sessions/'+session.id+'/polls/'+response.poll_id+'/alternatives');
     }
  });
   });
},

send: function (req, res) {
   PollsController.beforeAction(req, res, function (session) {
      var params = req.params.all();

      Poll.findOne({id:params.poll_id, session:params.session_id}, function (err, found_poll) {
          if (err) {return Log.error(err); }

          if (!found_poll) {
            req.flash('error', 'Enquete inexistente!!');
            return res.redirect('/speaker/sessions/'+session.id+'/polls');
          }

          if (found_poll.status !== 'ready') {
            req.flash('error', 'Esta enquete é inválida!!');
            return res.redirect('/speaker/sessions/'+session.id+'/polls');
          }

          Poll.before_send(found_poll, function (err, poll){
              if (err) { return Log.error(err); }
              if (poll) {
                req.flash('success', 'Enquete: '+ poll.title +' foi enviada com sucesso!!');
                //Sending questions poll to connected listeners 
                sails.sockets.broadcast(session.id, 'polls-receive', poll);
              } else {
                req.flash('error', 'Enquete inexistente!!');
              }
              return res.redirect('/speaker/sessions/'+session.id+'/polls');
          });
      });
   });
},

close: function (req, res) {
   PollsController.beforeAction(req, res, function (session) {
      var params = req.params.all();

      Poll.findOne({id:params.poll_id, session:params.session_id}, function (err, found_poll) {
          if (err) {return Log.error(err); }

          if (!found_poll) {
            req.flash('error', 'Enquete inexistente!!');
            return res.redirect('/speaker/sessions/'+session.id+'/polls');
          }

          if (found_poll.status !== 'open') {
            req.flash('error', 'Esta enquete não está aberta!!');
            return res.redirect('/speaker/sessions/'+session.id+'/polls');
          }
        
          Poll.close(params, function (err, poll_closed){
             if (err) { return Log.error(err); }
             if(poll_closed) {
                req.flash('success', 'A Enquete '+ poll_closed.title +' foi encerrada!');
                return res.redirect('/speaker/sessions/'+session.id+'/polls');
             }
             req.flash('error', 'Enquete inexistente!!');
             return res.redirect('/speaker/sessions/'+session.id+'/polls/');  
          });
      });
   });
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

module.exports = PollsController;
