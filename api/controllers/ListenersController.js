var application = sails.config.globals;

var ListenersController = {
	//Renderiza o index da opção Ouvintes Conectados
	index: function(req, res) {
		application.title = 'Listeners';
		return res.view('speaker/listeners/index'); 
	},

	create: function(req, res) {
		//Verificando se há alguma ocorrência do email na base de dados
		Listeners.findOne({email:req.param('email')}).exec(function(err, userFound){
			if(err){sails.log.debug(err);}
			if(!userFound){
				//Caso nenhuma ocorrência do email solicitado for encontrada, o usuário é criado
				Listeners.create({name:req.param('name'), email:req.param('email'), password:req.param('password')}).exec(function(err, newUser) {
					if(err){sails.log.debug(err);}
					Listeners.publishCreate({id:newUser.id,name:newUser.name});
					sails.log.debug('Usuário criado com sucesso!');	
					return res.json({msg:"Usuário criado com sucesso!"});
				});
			}
			sails.log.debug('Este email já está cadastrado!');	
			return res.json({msg:"Este email já está cadastrado!"});
		});
	},

	getAll: function(req, res) {
		Listeners.find({}).exec(function(err, users) {
			return res.json(users);
		});
	},

	subscribe: function(req, res) {

		 Listeners.find({}).exec(function(e,listOfListeners){
		      Listeners.subscribe(req.socket, listOfListeners,['create', 'update']);
		 });

		 Listeners.watch(req.socket);	
		 sails.log.debug("Listener: "+req.socket.id+" subscribed!");
	 	 return res.json({msg:"User: "+req.socket.id+" subscribed!"});
	},

	update: function(req, res) {
		//Verificando se há alguma ocorrência do email na base de dados
		Listeners.findOne({id:req.param('id')}).exec(function(err, userFound){
			if(err){sails.log.debug(err);}	
			if(userFound){
				Listeners.update({id:req.param('id')},{name:req.param('newName')}).exec(function afterwards(err,updated){
					//res.serverError(err)
					if(err){sails.log.debug(err);}	 
					Listeners.publishUpdate(updated[0].id, {name:updated[0].name});		
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

		//var keySession = req.param('keySession');
		/*
		//Verificar se chave de sessão existe e se ela está ativa
		Sessions.findOne({key:keySession}, function findSession(err, session) {
			if(err){sails.log.error("ERRO "+err);}

			if(!session){
				return res.json({msg:"SESSION_NOT_FOUND", authorization:false});
			}else if(!session.status == true){
				return res.json({msg:"SESSION_INATIVE", authorization:false});
			}
			
			//retuugrn res.json({msg: session.name})
		});
		*/

		var listener_email = req.param('email');
		var listener_password = req.param('password');
		Listeners.findOne({email:listener_email}, function findListener(err, listener) {
			if(err){sails.log.error("ERRO "+err);}

			//Verifica se o ouvinte foi encontrado
			if(!listener){
				sails.log.debug('LISTENER_NOT_FOUND');
				return res.json({msg:"LISTENER_NOT_FOUND", authorization:"false"});
			}

			//Compara email e senha
			Listeners.findOne({email:listener.email, password:listener_password}).exec(function(e,found){
	         	if(err){return sails.log.error("ERRO "+err);}

		      	if(!found){
		      		sails.log.debug('INCORRECT_PASSWORD');
		      		return res.json({msg:"INCORRECT_PASSWORD", authorization:"false"});
		      	}else{
		      		//subscribe
			        Listeners.find({}).exec(function(e,listOfListeners){
			         	if(err){return sails.log.error("ERRO "+err);}
				      	Listeners.subscribe(req.socket, listOfListeners,['create', 'update']);
				      	Listeners.watch(req.socket);	
				 	});


			        //Update no status de login off para online 
		            Listeners.update({email:listener_email},{online:true}).exec(function update(err,updated){
		                if(err){return sails.log.error("ERRO "+err);}
		          	    Listeners.publishUpdate(updated[0].id,{online:true});
		          	});
		      	}
		 	});

            sails.log.debug('###### Ouvinte autenticado com sucesso! #####');
            return res.json({msg:"Seja Bem-vindo!", authorization:"true"});
        });
	},

	leave: function(req, res) {
		Listeners.findOne({id:req.param('id')}, function findListener(err, listener) {
			if(err){return sails.log.error("ERRO "+err);}

			if(listener.online == true){
			 	Listeners.update({id:listener.id},{online:false}).exec(function update(err,updated){
	                if(err){return sails.log.error("ERRO "+err);}
	          	    Listeners.publishUpdate(updated[0].id,{online:false});
          		});
          		sails.log.debug('###### Ouvinte deslogado com sucesso! #####');
          		return res.json({msg:"Bye!", authorization:"false"});
			}
			sails.log.debug('Este ouvinte não está logado!!!');
			return res.json({msg:"Este ouvinte não está logado!!", authorization:"false"});
		});
	}
};

module.exports = ListenersController;