var application = sails.config.globals;

var ListenersController = {
	//Renderiza o index da opção Ouvintes Conectados
	index: function(req, res) {
		application.title = 'Listeners';
		return res.view('speaker/listeners/index'); 
	},

	create: function(req, res) {
		
		Listeners.create({name:req.param('name'), name:req.param('email')}).exec(function(err, newUser) {
			if(err){sails.log.debug(err);}
			Listeners.publishCreate({id:newUser.id,name:newUser.name});
			sails.log.debug("############# Usuario name: "+newUser.name+" criado!");
			sails.log.debug("############# Usuario email: "+newUser.email+" criado!");
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

		 Listeners.watch(req.socket)	
		 sails.log.debug("Listener: "+req.socket.id+" subscribed!");
	 	 return res.json({msg:"User: "+req.socket.id+" subscribed!"});
	},

	update: function(req, res) {
		sails.log.debug('###### Update Called!!');
		res.json({create:"Update!"});
	},

	destroy: function(req, res) {
		sails.log.debug('###### Destroy Called!!');
		res.json({create:"Destroy!"});
	},

	join: function(req, res) {
		sails.log.debug("CHAVE DE SESSAO: "+req.param('keySession'));
		sails.log.debug("EMAIL: "+req.param('email'));
		sails.log.debug("PASSWORD: "+req.param('password'));

		var keySession = req.param('keySession');
		
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


		var listener_email = req.param('email');
		Listeners.findOne({email:listener_email}, function findListener(err, listener) {
			//trata erros
			if(err){sails.log.error("ERRO "+err);}

			//Verifica se o ouvinte foi encontrado
			if(!listener && req.isSocket){
				return res.json({msg:"LISTENER_NOT_FOUND", authorization:false});
			}

			//sobrescreve lista de ouvintes 
			Listeners.find({}).exec(function(err, allListeners){
				if(err){return sails.log.error("ERRO "+err);}
	         	Listeners.subscribe(req.socket, allListeners);
	        });

	       // Listeners.watch(req.socket);

	        //Update no status de login off para online 
            Listeners.update({email:listener_email},{online:true}).exec(function update(err,updated){
                if(err){return sails.log.error("ERRO "+err);}
          	    Listeners.publishUpdate(updated[0].id,{ name:updated[0].name });
          	});
	    
        });
	},
};

module.exports = ListenersController;