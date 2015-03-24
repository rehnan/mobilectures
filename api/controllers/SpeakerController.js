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

  getFormProfile: function(req, res) {
  	application.title = req.__('title_edit_account');

  	SpeakerAccount.findOne({id:req.param('id')}).exec(function findSpeakerAccount(error, speaker){
  		if(error){sails.log.debug(error);}
  		if(!speaker){sails.log.debug('SpekarAccount not found to update');}

  		return res.view('speaker/update_profile', {locals:{speaker:speaker, errors: {}, flag:1}});
  	});
  },

  updateProfile: function(req, res) {
      sails.log.debug('PITT '+JSON.stringify(req.params.all()));

      errors_messages = Validator.input_empty(req.params.all());
     
      //Verifica se há algum erro antes de iniciar validação da autenticação
     if(Object.keys(errors_messages).length > 0){
        sails.log.error('Error Validation!!!');
        req.flash('error', 'Existe dados incorretos no formulário!');
        return res.view('speaker/update_profile', {locals:{speaker:req.params.all(), errors: errors_messages, flag:1}});
     }else{
          //Validação de email já existente
          SpeakerAccount.findOne({email:req.param('email')}).exec(function findByEmail(err, found){
                if(err){return sails.log.debug(err);}

                if(found && found.id !== CurrentUserId.get(req)){
                      sails.log.error('Este email já existe!');
                      req.flash('error', 'Existe dados incorretos no formulário!');
                      errors_messages = Validator.inform_error('email', 'Este email já existe!');
                      return res.view('speaker/update_profile', {locals:{speaker:req.params.all(), errors: errors_messages, flag:1}});
                }else{
                   
                    SpeakerAccount.update({id:CurrentUserId.get(req)}, {name:req.param('name'), email:req.param('email')}).exec(function updateSpekarAccount(err, speakerUpdated){
                    req.flash('info', 'Dados atualzizados com sucesso!');
                    sails.log.debug('Dados atualizados com sucesso! '+JSON.stringify(speakerUpdated[0].id));
                    return res.redirect('speaker/show/'+speakerUpdated[0].id+'/profile');
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
                   }//End else
               });
          });
     }//End else
  },

  getFormPassword: function(req, res){
    application.title = req.__('title_edit_account');

    SpeakerAccount.findOne({id:req.param('id')}).exec(function findSpeakerAccount(error, speaker){
      if(error){sails.log.debug(error);}
      if(!speaker){sails.log.debug('SpekarAccount not found to update');}
      return res.view('speaker/update_password', {locals:{errors: {}, password:'undefined', flag:2}});
    });
  },

  updatePassword: function(req, res) {
    //Verifica erros de campo vazio
    errors_messages = Validator.input_empty(req.params.all());

     if(Object.keys(errors_messages).length > 0){
        sails.log.error('Error Validation update password!!!');
        req.flash('error', 'Existe dados incorretos no formulário!')
        return res.view('speaker/update_password', {locals:{password:{}, errors:errors_messages, password:req.params.all(), flag:2}});
     }

      SpeakerAccount.findOne({id:CurrentUserId.get(req)}).exec(function(err, user){
              if(err){return sails.log.deug(err);}

              if(!user){ sails.log.error('User not found!'); return res.notFound();}

              var bcrypt = require('bcrypt-nodejs');
              //Verifica se a senha do usuário encontrado é iguai a senha informada
              bcrypt.compare(req.param('current_password'), user.password, function(err, isEquals) {
                  // res == true
                  if (!isEquals) { 
                    req.flash('error', 'Existe dados incorretos no formulário!');
                    sails.log.error('Senha Incorreta!');
                    errors_messages = Validator.inform_error('current_password', 'Senha incorreta');
                    return res.view('speaker/update_password', {locals:{errors:errors_messages, password:req.params.all(), flag:2}});
                  }else if(req.param('new_password').trim() !== req.param('confirm_password')){
                        req.flash('error', 'Existe dados incorretos no formulário!');
                        sails.log.error('Senha não conferem!');
                        errors_messages = Validator.inform_error('confirm_password', 'A senha de confirmação não confere com a nova senha');
                        return res.view('speaker/update_password', {locals:{errors:errors_messages, password:req.params.all(), flag:2}});
                     }else{
                        SpeakerAccount.update({id:CurrentUserId.get(req)}, {password:req.param('new_password')}).exec(function updaPassword(err){
                            if(err){return sails.log.debug(err);}
                            req.flash('success', 'Senha atualizada com sucesso!');
                            sails.log.error('Senha Correta!');
                            return res.view('speaker/update_password', {locals:{errors:{}, password:req.params.all(), flag:2}});
                        })
                     }
             });
        });

      
  }
  
};

