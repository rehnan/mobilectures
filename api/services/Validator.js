module.exports = {
	input_empty: function(json){
		 var errors_messages = {};
		 if(Object.keys(json).length > 0){

			 Object.keys(json).forEach(function(key) {
		          //sails.log.debug('ECHO '+json[key]);
		          if(json[key].trim() === ''){
		          errors_messages[key] = new Array();
   				  errors_messages[key].push('Este campo não pode ser vazio!');
   				  }
		     });
		}
		return errors_messages;
	},

	inform_error: function(key, message){
		 var errors_messages = {};
		 errors_messages[key] = new Array();
       	 errors_messages[key].push(message);
		return errors_messages;
	},

	compareBcryptPassword: function(password, id_user){
		SpeakerAccount.findOne({id:id_user}).exec(function(err, user){
              if(err){return sails.log.deug(err);}

              if(!user){ sails.log.error('User not found!'); return res.notFound();}

              var bcrypt = require('bcrypt-nodejs');
              //Verifica se a senha do usuário encontrado é iguai a senha informada
              bcrypt.compare(password, user.password, function(err, isEquals) {
                  // res == true
                  if (!isEquals) { 
                    sails.log.error('Senha Incorreta!');
                    return false;
                  }else{
                    sails.log.error('Senha Correta!');
                    return true;
                  }
             });
        });
	}
}