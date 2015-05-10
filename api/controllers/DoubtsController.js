var application = sails.config.globals;

var DoubtsController = {

	show: function(req, res) {
		DoubtsController.beforeAction(req, res, function (session) {

			application.title = req.__('doubt.show.title');
			var conditions = {id: session.id, owner: req.session.passport.user.id};
			var join1 = {sort: 'createdAt DESC', enabled:true};
			Session.findOne(conditions).populate('doubts', join1).exec(function (err, session){
				if(err){return err;}
				var doubts = session.doubts;
				res.view('speaker/doubts/show', {layout: 'layouts/session', session: session, doubts: doubts});
			});
		});
	},

	check: function (req, res) {
		DoubtsController.beforeAction(req, res, function (session) {

			application.title = req.__('doubt.show.title');
			var conditions = {id: session.id, owner: req.session.passport.user.id};

			Doubt.update_answered(conditions, req.param('doubt_id'), function (err, response) {
				if(err){Log.error(err);}

				if(response.updated) {
					Log.debug('Dúvida atualziada com sucesso! '+ JSON.stringify(response));
					req.flash('success', response.flash);
					return res.json([200]);
				} else {
					Log.error('Erro na atualização da dúvida!'+ JSON.stringify(response));
					req.flash('error', response.flash);
					return res.json([401]);
				}
			});
		});
	},

	destroy: function(req, res) {
		DoubtsController.beforeAction(req, res, function (session) {
			application.title = req.__('doubt.show.title');
			var conditions = {id: session.id, owner: req.session.passport.user.id};

			Doubt.destroy(conditions, req.param('doubt_id'), function (err, response) {
				if(err){Log.error(err);}
				if(response.destroyed) {
					Log.debug('Dúvida excluída com sucesso! '+ JSON.stringify(response));
					req.flash('info', response.flash);
					return res.json([200]);
				} else {
					Log.error('Esta dúvida não pode ser excluída! '+ JSON.stringify(response));
					req.flash('error', response.flash);
					return res.json([401]);
				}
			});
		});
	},

	subscribe: function(req, res) {

		var conditions = {id: req.param('session_id'), owner: req.session.passport.user.id};
   //Sobrescrevendo/Assistindo apenas o modelo Doubt desta sessão para está requisição socket
   Session.findOne(conditions).populate('doubts').exec(function (err, session) {
   	if(err){return err;}
   	Doubt.subscribe(req.socket, session.doubts, ['create', 'update']);
   });
   Doubt.watch(req.socket);
   return res.json([200], {msg:"Doubt: " + req.socket.id + " subscribed!"});
},

count: function(req, res) {
	DoubtsController.beforeAction(req, res, function (session) {
		var conditions = {id: session.id, owner: req.session.passport.user.id};
		Doubt.count(conditions, function (err, response) {
			if(err){return Log.error(err);}
			return res.json({count:response});
		});
	});
},

   /**
    * Controller methods
    * Find the session
    */
    beforeAction: function(req, res, callback) {

    	var conditions = {id: req.param('session_id'), owner: req.session.passport.user.id};

    	Session.findOne(conditions).exec(function (err, session){
    		if(err){return err;}
    		if(!session) {
    			req.flash('error', 'Sessão inexistente!!!');
    			return res.redirect('speaker/sessions');
    		}

    		callback(session);
    	});
    },
 };

 module.exports = DoubtsController;
