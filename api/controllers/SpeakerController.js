/**
 * SpeakerController
 *
 * @description :: Server-side logic for managing Speakers
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */
var application = sails.config.globals;
module.exports = {
	

  /**
   * `SpeakerController.index()`
   */
  index: function (req, res) {
	application.title = req.__('start_page');
	//sails.log.debug('User: '+req.session.passport.user);
    return res.view('speaker/index');
  },

  show: function(req, res) {
  	application.title = req.__('title_edit_account');

  	SpeakerAccount.findOne({id:req.param('id')}).exec(function findSpeakerAccount(error, speaker){
  		if(error){sails.log.debug(error);}
  		if(!speaker){sails.log.debug('SpekarAccount not found to update');}

  		return res.view('speaker/edit', {locals:{speaker:speaker, errors: {}}});
  	});
  },

  update: function(req, res) {
      sails.log.debug('PITT '+req.param('name'));
      var errors_messages = {};
      Messages.signin.clear_errors(errors_messages);
      Messages.signin.push_error(req.param('name'), 'name', 'Por favor, informe seu nome!', errors_messages);
      Messages.signin.push_error(req.param('email'), 'email', 'Por favor, informe seu email!', errors_messages);

      //Verifica se há algum erro antes de iniciar validação da autenticação
     if(Object.keys(errors_messages).length > 0){
        sails.log.error('Error Validation!!!');
        return res.view('speaker/edit', {locals:{speaker:req.params.all(), errors: errors_messages}});
     }else{
          //Validação de email já existente
          SpeakerAccount.findOne({email:req.param('email')}).exec(function findByEmail(err, found){
                if(err){return sails.log.debug(err);}

                if(found && found.id !== CurrentUserId.get(req)){
                      sails.log.error('Este email já existe!');
                      req.flash('error', 'Este email já existe!');
                      Messages.signin.push_error(req.param('email'), 'email', 'Este email já existe!', errors_messages);
                      return res.view('speaker/edit', {locals:{speaker:req.params.all(), errors: errors_messages}});
                }else{
                   
                    SpeakerAccount.update({id:req.session.passport.user}, req.params.all()).exec(function updateSpekarAccount(err, speakerUpdated){
                    req.flash('info', 'Dados atualzizados com sucesso!');
                    sails.log.debug('Dados atualizados com sucesso!');
                    return res.redirect('speaker/show/'+speakerUpdated[0].id);
                  });
                }
          });
    }
  },

  //Method to compare password
  comparePassword: function(req, res) {
    if(req.param('password').trim() === ''){
       sails.log.error('Nenhuma senha informada!');
       return res.json({response:null});
    }else{
        SpeakerAccount.findOne({id:CurrentUserId.get(req)}).exec(function(err, user){
              if(err){return sails.log.deug(err);}

              if(!user){ sails.log.error('User not found!'); return res.notFound();}

              var bcrypt = require('bcrypt-nodejs');
              //Verifica se a senha do usuário encontrado é iguai a senha informada
              bcrypt.compare(req.param('password'), user.password, function(err, isEquals) {
                  // res == true
                  if (!isEquals) { 
                    sails.log.error('Senha Incorreta!');
                    return res.json({response:false});
                  }else{
                    sails.log.error('Senha Correta!');
                    return res.json({response:true});
                  }
             });
        });
    }
  }
};

