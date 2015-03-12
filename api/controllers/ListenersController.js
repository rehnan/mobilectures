var application = sails.config.globals;

var ListenersController = {
	//Renderiza o index da opção Ouvintes Conectados
	index: function(req, res) {
		application.title = 'Listeners';
		return res.view('speaker/listeners/index'); 
	},

	create: function(req, res) {
		
		Listeners.create({name:req.param('name'), email:req.param('email'), password:req.param('password')}).exec(function(err, newUser) {
			if(err){sails.log.debug(err);}
			Listeners.publishCreate({id:newUser.id,name:newUser.name});
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
			
			Listeners.update({id:req.param('id')},{name:req.param('newName')}).exec(function afterwards(err,updated){
				//res.serverError(err)
				if(err){sails.log.debug(err);}	 
				Listeners.publishUpdate(updated[0].id, {name:updated[0].name});		
			   console.log('Updated user to have name '+updated[0].name);
			});
	},

	destroy: function(req, res) {
		sails.log.debug('###### Destroy Called!!');
		res.json({create:"Destroy!"});
	},

	join: function(req, res) {
		//sails.log.debug("CHAVE DE SESSAO: "+req.param('keySession'));
		sails.log.debug("EMAIL: "+req.param('email'));
		sails.log.debug("PASSWORD: "+req.param('password'));

		var keySession = req.param('keySession');
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
		Listeners.findOne({email:listener_email}, function findListener(err, listener) {
			//trata erros
			if(err){sails.log.error("ERRO "+err);}

			//Verifica se o ouvinte foi encontrado
			if(!listener){
				return res.json({msg:"LISTENER_NOT_FOUND", authorization:"false"});
			}

			//subscribe
	         Listeners.find({}).exec(function(e,listOfListeners){
	         	if(err){return sails.log.error("ERRO "+err);}
		      Listeners.subscribe(req.socket, listOfListeners,['create', 'update']);
		 	});

			Listeners.watch(req.socket);	

	        //Update no status de login off para online 
            Listeners.update({email:listener_email},{online:true}).exec(function update(err,updated){
                if(err){return sails.log.error("ERRO "+err);}
          	    Listeners.publishUpdate(updated[0].id,{online:true});
          	});

            return res.json({msg:"welcome", authorization:"true"});
        });
	},

	leave: function(req, res) {
		Listeners.findOne({id:req.param('id')}, function findListener(err, listener) {
			 Listeners.update({id:listener.id},{online:false}).exec(function update(err,updated){
                if(err){return sails.log.error("ERRO "+err);}
          	    Listeners.publishUpdate(updated[0].id,{online:false});
          	});
		});
	}
};

module.exports = ListenersController;