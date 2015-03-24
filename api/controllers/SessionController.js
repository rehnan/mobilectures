
var application = sails.config.globals;
var ObjectID = require('sails-mongo/node_modules/mongodb').ObjectID;

var SessionController = {

	//Action index | Method: GET - Renderiza view do formulário listando todas as sessões
	index: function(req, res) {
		sails.log.debug('Render sessions index view for user' + req.session.passport.user);
		application.title = req.__('option_sessions');
		//Session.find({}).paginate({page: 10, limit: 5}) {id_speaker:req.session.passport.user}
		Session.find({owner:req.session.passport.user.id}, {sort: 'createdAt DESC' }).exec(function findCB(err, sessions){
			if(err){return err;}
		
			return res.view('speaker/sessions/index',{sessions:sessions});
		});
	},

	//Action new | Method: GET - Renderiza view do formulário 
	new: function(req, res) {
		sails.log.debug('Rendering new sessions view form for user: ' + req.session.passport.user);
		return res.view('speaker/sessions/new', {errors: {}, session: Session.new });
	},

	//Action create | Method: POST - Realiza a pesistência dos dados do formulário
	create: function(req, res) {
		sails.log.debug('POST Create View ' + JSON.stringify(req.params.all()));
		sails.log.debug('User ==> ' + req.session.passport.user);

		Session.validate(req.params.all(), function validadeSession(errors){
			if(errors) { 
				errors_messages = SailsValidador(Session, errors);
				sails.log.debug('Error ==> ' + JSON.stringify(errors_messages));
				
				return res.view('speaker/sessions/new', {errors: errors_messages,  session: req.params.all()});
					                                    
			}else{
					SpeakerAccount.findOne({id:CurrentUserId.get(req)}).exec(function findSpeaker(err, speaker) {
						if(err) { 
						    sails.log.debug('Error ==> ' + err);
						    req.flash('error', err);
							return res.view('speaker/sessions/new');
						}else{
							sails.log.debug('Preparando o modelo para salvar...');
							speaker.sessions.add(req.params.all());
							speaker.save(function(err,resp_cb){
								if(err){
								sails.log.debug('Erro ao tentar salvar o modelo+ '+err); 
								req.flash('error', err);}
						    	//sails.log.debug('######## Callback Save() Seccess! '+ JSON.stringify(resp_cb));
						    	//req.flash('success', 'Sessão <strong>'+req.param('name')+ '</strong> criada com sucesso!');
						    	//Depois de tudo criado, redireriona para o index sessions
						  		return res.redirect('speaker/sessions');
						  	});
						}
					});
			}//End else
		});
	},

	select: function(req, res) {
		application.title = req.__('option_current_session');
		sails.log.debug('Selecionando sessão')
		req.session.current_session = null;
		//Session.find({}).paginate({page: 10, limit: 5})
		Session.findOne({id:req.param('id'), owner: CurrentUserId.get(req)}).exec(function findCB(err, session){
			if(err){return err;	}
			if(!session){
				req.flash('error', 'Sessão inexistente!!!');
				return res.redirect('speaker/sessions');	
			}
			req.session.current_session = session;
			return res.view('speaker/sessions/current', {layout: 'layout_options', current_session:session});
		});
	},

	//Action to select sessions
	/*setSession: function(req, res) {
		var userid = req.session.passport.user;
		var session_id = req.param('id');
		Session.native(function(err, collection) {
		  if (err) return res.serverError(err);

		  //Setando o status de todas as sessões com status:true para false (Inativa)
		  collection.update({status:true, id_speaker:userid}, {$set: {status:false}}, {multi:true}, function(err, result) {
		  		if(err){sails.log.debug(err);}
		  		else
		  		sails.log.debug(result);
		  });

		  //Setando o status da nova sessão para true (Ativa)
		  collection.update({_id:new ObjectID(session_id), id_speaker:userid}, {$set: {status:true}}, function(err, result) {
		  		if(err){sails.log.debug(err);}
		  		else
		  		sails.log.debug(result);
		  });

		});
		res.redirect('speaker/session');
	},

	find: function(req, res) {

	},*/

/*
	//Action GET Page Create New Sesison
	getCreateView: function(req, res) {
		application.title = 'Session';
		sails.log.debug('GET Create View');
		return res.view('speaker/session/new');
	},

	//Action GET PAge Edit Session
	getEditView: function(req, res) {
		application.title = 'Session';

		Session.findOne({id:req.param('id')}, function (err, session) {
            if(err){return next(err);}
            sails.log.debug('Verificando se sessao está cadastrada...');
            if(!session){
                //Registrar Log de message
                return sails.log.debug('Session não encontrada!');
            }else{
                sails.log.debug('Sessão encontrada! Enviando dados da Sesssão!');
                return res.view('speaker/session/edit', {session:session});
            }
        });
	},
	*/

	//Action edit | Method: GET - Renderiza view do formulário de edição
	edit: function(req, res) {
		sails.log.debug('Rendering edit sessions view form for user: ' + req.session.passport.user);
		Session.findOne({id:req.param('id')}).exec(function findSession(err, session){
			if(err){sails.log.debug(err);}
			return res.view('speaker/sessions/edit', {errors: {}, session:session});
		});
	},

	//Action PUT to Form Edit
	update: function(req, res) {

		var id = req.param('id');
		var key = req.param('key');
		var name = req.param('name');
		var descript = req.param('description');
		
	    Session.update({id:id}, {name: name, key: key, description: descript}).exec(function sessionUpdated(errors, updatedUser) {
	      if (errors) {
	      	req.flash('error', errors);
	        errors_messages = SailsValidador(Session, errors);
			sails.log.debug('Error ==> ' + JSON.stringify(errors_messages));
	      	return res.view('speaker/sessions/edit', {errors: errors_messages,
					                                     session: req.params.all()});
	      }
	      sails.log.debug('Action update called: '+JSON.stringify(req.params.all()));
	      req.flash('info', 'Sessão <strong>'+updatedUser[0].id+ '</strong> atualizada sucesso!');
	      return res.redirect('speaker/sessions');
	    });
	},


	destroy: function(req, res) {
		sails.log.debug(req.param('id'));
		Session.destroy({id:req.param('id')}).exec(function sessionDestroy(err){
			if(err){
				req.flash('error', errors);
				sails.log.debug('EROO: '+err);
			}else{
  			   sails.log.debug('The record has been deleted');
  			   req.flash('warning', 'A Sessão <strong>'+req.param('id')+ '</strong> foi deletada!');
  			   return res.redirect('speaker/sessions');
  			}
  		});
	},
}

module.exports = SessionController;

/*
Examplo consulta nativa mongodb
index: function (req,res) {
    Pet.native(function(err, collection) {
      if (err) return res.serverError(err);
 
      collection.find({}, {
        name: true
      }).toArray(function (err, results) {
        if (err) return res.serverError(err);
        console.log('->',results);
        return res.ok(results);
      });
    });
  }

*/