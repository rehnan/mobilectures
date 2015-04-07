module.exports = {
	
	listenerJoin: function(req, res) {
		var keySession = req.param('keySession');

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
						return res.json({msg:"LISTENER_NOT_FOUND", authorization:false});
					}

					//CASO TENHA SIDO ENCONTRADA VERIFICA SE A SENHA ESTÁ CORRETA
					Listener.findOne({email:listenerFound.email, password:listener_password}).exec(function(e,listener){
			         	if(err){return sails.log.error("ERRO "+err);}

				      	if(!listener){
				      		sails.log.error ('INCORRECT_PASSWORD');
				      		return res.json({msg:"INCORRECT_PASSWORD", authorization:false});
				      	if(listener.status == true)
				      		sails.log.error ('YOU_ARE_LOGGED_IN');
				      		return res.json({msg:"Está conta já está logada na sessão!", authorization:true, listener:listener});
				      	}else{

				      		//Deslogando ouvinte da sessão co
				      		if(listener.logged_room !== null){
							 	Listener.update({id:listener.id},{logged_room:null}).exec(function update(err,updated){
					                if(err){return sails.log.error("ERRO "+err);}
					                sails.log.debug('###### Deslogando ouvinte da sessão: '+listener.logged_room);
					                //Publica logout
					          	    Listener.publishUpdate(updated[0].id,{logged_room:null});
					          	    //Deixa a sala (Deixa a sessão)
					          	    sails.sockets.leave(req.socket, req.param('sessionkey'));
				          			
				          			Listener.unsubscribe(req.socket, listener);
				          		});
							}

							Listener.subscribe(req.socket, session.listeners, ['create', 'update']);

							Listener.watch(req.socket);	
				      		
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


							sails.log.debug('Sockets joined in this room: '+sails.sockets.subscribers(session.key));
							//sails.log.debug(JSON.stringify('ROOOOOMS: '+sails.sockets.socketRooms(req.socket)));
							
							//ENVIA MENSAGEM DE BOAS VINDAS
							sails.sockets.broadcast(session.key, 'welcome-msg', 'Seja bem vindo a palestra '+session.key);

					        //UPDATE NO STATUS DE LOGIN DO MODELO LISTENER
				            Listener.update({email:listener_email}, {logged_room:session.key}).exec(function update(err,updated){
				                if(err){return sails.log.error("ERRO "+err);}
				                //PUBLICA UPDATE DE LISTENER LOGADO 
				          	    Listener.publishUpdate(updated[0].id,{logged_room:session.key});

				          	    sails.log.debug('###### Logando ouvinte na sessão: '+listener.logged_room);
				          	});

				          	sails.log.debug('###### Ouvinte autenticado com sucesso! #####');
		            		return res.json({msg:"Seja Bem-vindo!", authorization:true, listener:listener, session:session});
				      		
				      	}

				 	  });
		          	});
			}//End Else
	  	});//End Sessions.findOne
	},

	listenerLeave: function(req, res){
		sails.log.debug(JSON.stringify(req.params.all()));
		Listener.findOne({email:req.param('listener_email')}, function findListener(err, listener) {
			if(err){return sails.log.error("ERRO "+err);}

			if(listener.logged_room !== null){
			 	Listener.update({id:listener.id},{logged_room:null}).exec(function update(err,updated){
	                if(err){return sails.log.error("ERRO "+err);}
	                sails.log.debug('###### Deslogando ouvinte da sessão: '+listener.logged_room);
	                //Publica logout
	          	    Listener.publishUpdate(updated[0].id,{logged_room:null});
	          	    //Deixa a sala (Deixa a sessão)
	          	    sails.sockets.leave(req.socket, req.param('session_key'));
          			
          			Listener.unsubscribe(req.socket, listener);
          		});
          		
          		return res.json({msg:"Bye!", authorization:false});
			}else{
				sails.log.debug('Este ouvinte não está logado!!!');
				return res.json({msg:"Este ouvinte não está logado!!", authorization:false});
			}
		});
	}
}