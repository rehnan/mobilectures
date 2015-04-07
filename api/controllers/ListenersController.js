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
			var listeners = session.listeners;
			//Empilhando chave de sessão na resposta de requisição
			listeners.push({key:req.session.current_session.key});
			return res.json(listeners);
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
		SessionService.listenerJoin(req, res);
	},

	leave: function(req, res) {
		SessionService.listenerLeave(req, res);
	},

	doubtReceived: function(req, res) {
		sails.log.debug('Doubt Received '+req.param('doubt'));
	},

	sendMessage: function(req, res) {
		sails.log.debug('Sending this message: '+req.param('message')+' to room => '+req.param('room'));
		//ENVIA MENSAGEM DE BOAS VINDAS
		sails.sockets.broadcast(req.param('room'), 'messages-from-server', req.param('message'));
	},

	//Methods to listeners app
	dashboard: function(req, res) {
		application.title = 'Dashboard Listener';
		Session.findOne({key:req.param('key_session')}).exec(function findSession(err, session){
			if(err){sails.log.error(err);}
			if(session){
				return res.view('speaker/listeners/dashboard_app', {layout: 'layout_login', auth:req.params.all(), session:session});
			}
			return res.redirect('signin');
		});
		
	},

	signin: function(req, res) {
		application.title = 'Listener | Sign in';
		return res.view('speaker/listeners/signin_app', {layout: 'layout_login', errors:{}}); 
	},
};

module.exports = ListenersController;