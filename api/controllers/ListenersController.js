var application = sails.config.globals;

var ListenersController = {
	//Renderiza o index da opção Ouvintes Conectados
	index: function(req, res) {
		application.title = req.__('option_listeners');
		if(req.session.current_session != undefined){
			//sails.log.debug(req.session.current_session.id);
			return res.view('speaker/listeners/index', {layout: 'layout_options'}); 
		}else{
			req.flash('error', 'Você deve criar/selecionar uma sessão')
			return res.redirect('speaker/sessions');
		}
	},

	create: function(req, res) {
		//Verificando se há alguma ocorrência do email na base de dados
		Listener.findOne({email:req.param('email')}).exec(function(err, listener){
			if(err){sails.log.debug(err);}
			if(!listener){
				//Caso nenhuma ocorrência do email solicitado for encontrada, o usuário é criado
				Listener.create({name:req.param('name'), email:req.param('email'), password:req.param('password')}).exec(function(err, newListener) {
					if(err){sails.log.debug(err);}
					Listener.publishCreate({id:newListener.id,name:newListener.name});
					sails.log.debug('New listener account crated!');	
					return res.json({msg:"Usuário criado com sucesso!"});
				});
			}else{
				sails.log.error('Este email já está cadastrado!');	
				return res.json({msg:"Este email já está cadastrado!"});
			}
		});
	},

	getAll: function(req, res) {
		//Busca todos os ouvintes inscritos na sessão corrente (seleceionada)
		//sails.log.debug(req.session.current_session.id);
		Session.findOne({id:req.session.current_session.id}).populate('listeners').exec(function(err, session) {
			return res.json(session.listeners);
		});
	},
	
	subscribe: function(req, res) {

		 Listener.find({}).exec(function(e,listeners){
		      Listener.subscribe(req.socket, listeners, ['create', 'update']);
		 });
		 
		 Listener.watch(req.socket);	
		 sails.log.debug("Listener: "+req.socket.id+" subscribed!");
	 	 return res.json({msg:"User: "+req.socket.id+" subscribed!"});
	},
	
	update: function(req, res) {
		//Verificando se há alguma ocorrência do email na base de dados
		Listener.findOne({id:req.param('id')}).exec(function(err, userFound){
			if(err){sails.log.debug(err);}	
			if(userFound){
				Listener.update({id:req.param('id')},{name:req.param('newName')}).exec(function afterwards(err,updated){
					//res.serverError(err)
					if(err){sails.log.debug(err);}	 
					Listener.publishUpdate(updated[0].id, {name:updated[0].name});		
				   sails.log.debug('Nome do usuaŕio alterado com sucesso!'+updated[0].name);
				   return res.json({msg:"Nome do usuaŕio alterado com sucesso!"});
				});
			}
			sails.log.debug('Usuário não encontrado para alteração');
			return res.json({msg:"Este usuário não existe!"});
		});
	},

	destroy: function(req, res) {
		sails.log.debug('###### Destroy Called!!');
		res.json({create:"Destroy!"});
	},

	join: function(req, res) {
		//sails.log.debug("CHAVE DE SESSAO: "+req.param('keySession'));

		var keySession = req.param('keySession');
		sails.log.debug('   '+keySession);
		//VERIFICA SE A CHAVE DE SESSÃO EXISTE
		Session.findOne({key:keySession}, function findSession(err, session) {
			if(err){sails.log.error("ERRO "+err);}

			if(!session){
				sails.log.error('SESSION_NOT_FOUND');
				return res.json({msg:"SESSION_NOT_FOUND", authorization:false});
			}else {
			//retuugrn res.json({msg: session.name}) session.status == true

				var listener_email = req.param('email');
				var listener_password = req.param('password');
				//PROCURA PELA CONTA LISTENERS CADASTRADA
				Listener.findOne({email:listener_email}, function findListener(err, listenerFound) {
					if(err){sails.log.error("ERRO "+err);}

					//VERIFICA SE A CONTA NÃO EXISTE (OU SE NÃO FOI ENCONTRADA)
					if(!listenerFound){
						sails.log.error('LISTENER_NOT_FOUND');
						return res.json({msg:"LISTENER_NOT_FOUND", authorization:"false"});
					}

					//CASO TENHA SIDO ENCONTRADA VERIFICA SE A SENHA ESTÁ CORRETA
					Listener.findOne({email:listenerFound.email, password:listener_password}).exec(function(e,listener){
			         	if(err){return sails.log.error("ERRO "+err);}

				      	if(!listener){
				      		sails.log.error ('INCORRECT_PASSWORD');
				      		return res.json({msg:"INCORRECT_PASSWORD", authorization:"false"});
				      	if(listener.status == true)
				      		sails.log.error ('YOU_ARE_LOGGED_IN');
				      		return res.json({msg:"Está conta já está logada na sessão!", authorization:"true", listener:listener});
				      	}else{

							Listener.subscribe(req.socket, session.listeners, ['create', 'update']);

							Listener.watch(req.socket);	
				      		//sails.log.debug('Session: '+JSON.stringify(session));
				      		//sails.log.debug('Session.listeners: '+JSON.stringify(session.listeners));
				      		
				      		//INSERE OUVINTE NA LISTA DE OUVINTES DA SESSÃO
				      		session.listeners.add(listener);
				      		//EFETUA COMMIT DA INSERÇÃO
				      		session.save(function(error, s){
				      			if(error){sails.log.error('Este Listener já está cadastrado na sessão ['+error[0].err+']');}
				      			else{
				      				sails.log.debug('Registro de um novo listener na sessão');
				      			}
							});

							//INSERE OUVINTE A SALA COM O NOME DA SESSÃO      
							sails.sockets.join(req.socket, session.key);
							//sails.log.debug(JSON.stringify('ROOOOOMS: '+sails.sockets.socketRooms(req.socket)));
							
							//ENVIA MENSAGEM DE BOAS VINDAS
							sails.sockets.broadcast(session.key, 'welcome-message', 'Seja bem vindo a palestra '+session.key);

					        //UPDATE NO STATUS DE LOGIN DO MODELO LISTENER
				            Listener.update({email:listener_email}, {online:true}).exec(function update(err,updated){
				                if(err){return sails.log.error("ERRO "+err);}
				                //PUBLICA UPDATE DE LISTENER LOGADO 
				          	    Listener.publishUpdate(updated[0].id,{online:true});
				          	});

				          	sails.log.debug('###### Ouvinte autenticado com sucesso! #####');
		            		return res.json({msg:"Seja Bem-vindo!", authorization:"true", listener:listener, session:session.key});
				      	}

				 	  });
		          	});
			}//End Else
	  	});//End Sessions.findOne
	},

	leave: function(req, res) {

		Listener.findOne({id:req.param('userId')}, function findListener(err, listener) {
			if(err){return sails.log.error("ERRO "+err);}

			if(listener.online == true){
			 	Listener.update({id:listener.id},{online:false}).exec(function update(err,updated){
	                if(err){return sails.log.error("ERRO "+err);}
	                //Publica logout
	          	    Listener.publishUpdate(updated[0].id,{online:false});
	          	    //Deixa a sala (Deixa a sessão)
	          	    sails.sockets.leave(req.socket, req.param('sessionkey'));
	          	    //Cancela assinatura para receber atualizações de instâncias do modelo Listener
          		});
          		sails.log.debug('###### Ouvinte deixando a sessão #####');
          		return res.json({msg:"Bye!", authorization:"false"});
			}else{
				sails.log.debug('Este ouvinte não está logado!!!');
				return res.json({msg:"Este ouvinte não está logado!!", authorization:"false"});
			}
		});
	},

	doubtReceived: function(req, res) {
		sails.log.debug('Doubt Received '+req.param('doubt'));
	},

	sendMessage: function(req, res) {
		sails.log.debug('Sending this message: '+req.param('message')+' to room => '+req.param('room'));
		//ENVIA MENSAGEM DE BOAS VINDAS
		sails.sockets.broadcast(req.param('room'), 'welcome-message', req.param('message'));
	}


};

module.exports = ListenersController;