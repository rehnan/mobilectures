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

		//Cliente: Action Join: Enviar MAC e Key Session pro servidor
		//1º //Servidor: verifica se usuário está autenticado [true: redirect admin page; false: next()]
		//2º //Servidor: Verifica se sessão existe pelo parametro keySession [true: next(); false: return 'SESSION_NOT_FOUND' |  'SESSION_INATIVE']
		//3º //Servidor: Verifica se o mac está cadastrado no sistema [true: next(autentica usuário); false: return 'LISTENER_NOT_REGISTRED' ]
		// 

		//Quando a tentativa de Join em uma sessão, o usuário é procurado e verificado se tem um nickname/email definido

		//Verificar se usuário já está cadastrado nesta sessão
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

	create: function(req, res) {
		sails.log.debug('POST send by: '+req.socket.id);
	},

	update: function(req, res) {
		sails.log.debug('UPDATE send by: '+req.socket.id);
	},

	destroy: function(req, res) {
		sails.log.debug('DELETE send by: '+req.socket.id);
	}
};

module.exports = ListenersController;