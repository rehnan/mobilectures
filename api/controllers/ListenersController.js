var application = sails.config.globals;

var ListenersController = {

	show: function(req, res) {
		application.title = 'Listeners';
		res.view('speaker/listeners/show');
	},

    join: function(req, res) {
		sails.log.debug("CHAVE DE SESSAO: "+req.param('keySession'));
		var keySession = req.param('keySession');
		
		//Verificar se chave de sessão existe e se ela está ativa
		Sessions.findOne({key:keySession}, function findSession(err, session) {
			if(err){sails.log.error("ERRO "+err);}

			if(!session){
				return res.json({msg:"SESSION_NOT_FOUND", authorization:false});
			}else if(!session.status == true){
				return res.json({msg:"SESSION_INATIVE", authorization:false});
			}
			
			return res.json({msg: session.name})
		});

		//Verificar se usuário já está cadastrado
		//Se estiver cadastrado: online: true
		/*
		Listeners.findOne({mac:mac}, function findListener(err, listener) {
			if(err){sails.log.error("ERRO "+err);}
			if(!listener){
				return res.json({msg:"LISTENER_NOT_FOUND", authorization:false});
			}

			Listeners.subscribe(req.socket, listener);

	        // Get updates about users being created
	        Listeners.watch(req.socket);


        // Publish this user creation event to every socket watching the User model via User.watch()
        User.publishCreate(user, req.socket);
			
			else{
				return res.json({msg: session.name})
			}
		});*/
	},
};

module.exports = ListenersController;