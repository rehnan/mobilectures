
var application = sails.config.globals;
var ObjectID = require('sails-mongo/node_modules/mongodb').ObjectID;

var SessionController = {

	//Action GET Page findAll Sesisons
	show: function(req, res) {
		application.title = 'Session';
		return res.view('speaker/session/show');
		/*
		//Session.find({}).paginate({page: 10, limit: 5})
		Session.find({id_speaker:req.session.passport.user}).exec(function findCB(err,sessions){
			if(err){return err;}
			return res.view('speaker/session/show', {sessions:sessions});
		});*/
	},

	//Action to select sessions
	setSession: function(req, res) {
		var userid = req.session.passport.user;
		var session_id = req.param('id');
		Session.native(function(err, collection) {
		  if (err) return res.serverError(err);

		  //Setando o status de todas as sessões com status:true para false (Inativa)
		  collection.update({status:true, id_speaker:userid}, {$set: {status:false}}, {multi:true}, function(err, result) {
		  		if(err){sails.log.debug(err);}
		  		else
		  		sails.log.debug(result);
		  });

		  //Setando o status da nova sessão para true (Ativa)
		  collection.update({_id:new ObjectID(session_id), id_speaker:userid}, {$set: {status:true}}, function(err, result) {
		  		if(err){sails.log.debug(err);}
		  		else
		  		sails.log.debug(result);
		  });

		});
		res.redirect('speaker/session');
	},

	find: function(req, res) {

	},

	//Action POST Create New Session
	'new': function(req, res) {
		sails.log.debug('POST Create View'+req.params.all());
		Session.create(req.params.all(), function(err, user) {
			if(err){return err;}
		});
		application.message = 'Usuário Criado com Sucesso!';
		return res.redirect('speaker/session');
	},

	//Action GET Page Create New Sesison
	getCreateView: function(req, res) {
		application.title = 'Session';
		sails.log.debug('GET Create View');
		return res.view('speaker/session/new');
	},

	//Action GET PAge Edit Session
	getEditView: function(req, res) {
		application.title = 'Session';

		Session.findOne({id:req.param('id')}, function (err, session) {
            if(err){return next(err);}
            sails.log.debug('Verificando se sessao está cadastrada...');
            if(!session){
                //Registrar Log de message
                return sails.log.debug('Session não encontrada!');
            }else{
                sails.log.debug('Sessão encontrada! Enviando dados da Sesssão!');
                return res.view('speaker/session/edit', {session:session});
            }
        });
	},
	
	//Action PUT to Form Edit
	update: function(req, res) {

		var params = _.extend(req.query || {}, req.params || {}, req.body || {});
	   
	    var id = params.id;

	    sails.log.debug('ID: '+id+' key:'+params.key+' Name:'+params.name+' Descr:'+params.description);
	    
	    if (!id) return res.send("No id specified.",500);

	    Session.update(id, params, function userUpdated(err, updatedUser) {
	      if (err) {
	      	return sails.log.debug('Errooooo');
	      }
	      if(!updatedUser) {
	      	return sails.log.debug('Segundo Erro');
	      }
	      sails.log.debug('Deu certo!');
	      application.message = 'Sessão alterada com sucesso!';
	      return res.redirect('speaker/session');
	    });
	},


	destroy: function(req, res) {

		Session.destroy(req.param('id')).exec(function deleteCB(err){
			if(err){
				sails.log.debug('EROO: '+err);
			}else{
			   application.message = 'Deletado com sucesso!';
  			   sails.log.debug('The record has been deleted');
  			}
  		});
  		return res.redirect('speaker/session');
	},
}

module.exports = SessionController;

/*
Examplo consulta nativa mongodb
index: function (req,res) {
    Pet.native(function(err, collection) {
      if (err) return res.serverError(err);
 
      collection.find({}, {
        name: true
      }).toArray(function (err, results) {
        if (err) return res.serverError(err);
        console.log('->',results);
        return res.ok(results);
      });
    });
  }

*/