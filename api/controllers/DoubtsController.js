var application = sails.config.globals;


var DoubtsController = {

   // References
   // https://github.com/balderdashy/waterline
   // http://stackoverflow.com/questions/23446484/sails-js-populate-nested-associations/26452990#26452990
	show: function(req, res) {
		DoubtsController.beforeAction(req, res, function (session) {
	
			application.title = req.__('doubt.show.title');
			var conditions = {id: session.id, owner: req.session.passport.user.id};
			//var join1 = {sort: 'createdAt DESC', enabled:true};
			var orders_by = {sort: { answered:1, createdAt: -1}, enabled:true};
			Session.findOne(conditions).populate('doubts', orders_by)
            .then(function (session){
				   var doubtsUser = Listener.find({
                  id: _.pluck(session.doubts, 'listener')
               })
               .then(function (doubtsUser){
                  return doubtsUser;
               });

               return [session, doubtsUser];
            })
            .spread(function(session, doubtsUsers){
               var doubtsUsers = _.indexBy(doubtsUsers, 'id');
               //_.indexBy: Creates an object composed of keys generated from
               //the results of running each element of the collection through
               //the given callback. The corresponding value of each key is the
               //last element responsible for generating the key
               session.doubts = _.map(session.doubts, function(doubt) {
                  if (doubt.private){
                     doubt.listener = {name: req.__('doubt.name.anonymous')};
                  } else {
                     doubt.listener = doubtsUsers[doubt.listener];
                  }
                  return doubt;
               });

               var doubts = session.doubts;
              // Log.info(JSON.stringify(doubts));
               _.each(doubts, function (doubt) {  
                   Log.info(doubt.listener);
               }); 
               return res.view('speaker/doubts/show', {layout: 'layouts/session', session: session, doubts: doubts});
            })
            .catch(function(err){
          		req.flash('error', 'Erro na consulta das dúvidas!!!');
    	         return res.redirect('/speaker');
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


    	if(!req.session.passport.user) {
    		req.flash('error', 'Você deve estar logado!!!');
    		return res.redirect('/login');
    	}


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
