var application = sails.config.globals;

var PollsController = {

  index: function(req, res) {
    
    PollsController.beforeAction(req, res, function (session) {
      application.title = req.__('poll.show.title');
      Session.findOne({id:session.id}).populate('polls', {enabled:true}).exec(function (err, session) {
        if(err){return Log.error(err);}
        
        if(session.polls.length > 0){
          res.view('speaker/polls/index', {layout: 'layouts/session', session: session, polls: session.polls});
        } else {
          req.flash('info', 'Não há nenhuma enquete cadastrada!');
          res.view('speaker/polls/index', {layout: 'layouts/session', session: session, polls: {}});
        }
      });
   });
 },

/* Action new | Method: GET - 
* Renderiza view do formulário
*/ 
new: function(req, res) {

   PollsController.beforeAction(req, res, function (session) {
     application.title = req.__('quiz.link.new');
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
     }

     if(record) {
       req.flash('success', req.__('global.flash.create.success', {name: req.param('title')}));
        return res.redirect('speaker/sessions/'+session.id+'/polls/'+record.id+'/alternatives');
     } 
     req.flash('error', req.__('Erro ao criar enquete!'));
     return res.redirect('speaker/sessions/'+session.id+'/polls');
  });
 });
},

edit: function(req ,res) {
   application.title = req.__('poll.edit.title');
   PollsController.beforeAction(req, res, function (session) {

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
      req.flash('success', 'Enquete '+params.title+' atualizada com sucesso!');
      return res.redirect('speaker/sessions/'+session.id+'/polls');

   });
  });
},

destroy: function(req, res) {

 PollsController.beforeAction(req, res, function (session) {
   var params = req.params.all();
   params.owner = session.owner.id;
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

subscribe: function (req, res) {
    var conditions = {id: req.param('poll_id'), session: req.param('session_id')};
   //Sobrescrevendo/Assistindo apenas o modelo Doubt desta sessão para está requisição socket
   Poll.findOne(conditions).populate('pollanswers').exec(function (err, poll) {
    if(err){return err;}

    (poll && poll.pollanswers) ? PollAnswer.subscribe(req.socket, poll.pollanswers, ['create', 'update']) : '';
   
      PollAnswer.watch(req.socket);
      return res.json([200], {msg:"Pollanswer: " + req.socket.id + " subscribed!"});
   });
   
},

reports: function (req, res) {
  PollsController.beforeAction(req, res, function (session) {
    application.title = req.__('Relatório de Enquete');
    var params = req.params.all();

    Poll.findOne({id:params.poll_id, session:params.session_id}, function (err, found_poll) {
        if (err) {return Log.error(err); }

        if (!found_poll) {
          req.flash('error', 'Enquete inexistente!!');
          return res.redirect('/speaker/sessions/'+session.id+'/polls');
        }

        if (found_poll.status === 'pending') {
          req.flash('error', 'A Enquete ainda está pendente!!');
          return res.redirect('/speaker/sessions/'+session.id+'/polls');
        }

        if (found_poll.status === 'ready') {
          req.flash('error', 'Você deve enviar a enquete antes de abrir o relatório!');
          return res.redirect('/speaker/sessions/'+session.id+'/polls');
        }

        return res.view('speaker/polls/reports', {layout: 'layouts/session', session: session, poll: found_poll});
    });
  });
},

new_alternatives: function(req, res) {

   PollsController.beforeAction(req, res, function (session) {
      var params = req.params.all();
      params.owner = session.owner.id;

      Session.findOne({id:params.session_id, owner:params.owner}).populate('polls', {id:params.poll_id}).exec(function (err, session) {
       if(err){return Log.error(err);}
       
       if(session.polls.length > 0) {
        var poll = session.polls[0] ;
        return res.view('speaker/polls/alternatives', {layout: 'layouts/session', errors: {}, poll: poll, session:session});
      } else {
        req.flash('error', 'Enquete inexistente!!!');
        return res.redirect('/speaker/sessions/'+params.session_id+'/polls');
      }
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
              return res.redirect('/speaker/sessions/'+session.id+'/polls/'+poll.id+'/reports');
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
 Session.findOne(conditions).populate('listeners').populate('owner').exec(function (err, session){
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
