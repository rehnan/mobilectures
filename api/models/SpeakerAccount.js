/**
* SpeakerAccounts.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {
  schema: true,
  attributes: {
  	  name: {
          type: 'string',
          required: true
      },
	    
      email: {
          type: 'string',
          unique: true,
          required: true,
          email: true
      },
    
      password: {
          type: 'string',
          required: true
      },

      //Association with sessions (Uma conta de palestrante pode gerenciar várias sessões)
      //Possui uma coleção de sessões
      sessions:{
            collection: 'session', //do modelo Sessions
            via: 'owner' //via atributo owner (Localizado no modelo Sessions)
      }
  },

  //Before save crypt the password attribute
   beforeCreate: function (attrs, next) {

    if(attrs.password != undefined) {
      var bcrypt = require('bcrypt-nodejs');
      var salt = bcrypt.genSaltSync(10);

      // Hash the password with the salt
      attrs.password = bcrypt.hashSync(attrs.password, salt);
      sails.log.debug('[Action: beforeCreate] Password Updated');
      }

      next();
  },

  beforeUpdate: function (attrs, next) {

      //sails.log.debug(JSON.stringify(attrs));
      //A verificação de Object.keys(attrs).length === 1 foi inserida para que não houvesse update da senha
      if(attrs.password != undefined && Object.keys(attrs).length === 1) {
        var bcrypt = require('bcrypt-nodejs');
        var salt = bcrypt.genSaltSync(10);

        sails.log.error(attrs.password);  

        // Hash the password with the salt
        attrs.password = bcrypt.hashSync(attrs.password, salt);
      sails.log.debug('[Action: beforeUpdate] Password Updated');
      }

      next();
  },

  validationMessages: {

    name: {
     required: 'você deve informar seu nome',
    },

    email: {
     required: 'você deve informar seu email',
     unique: 'Email já cadastrado!',
     email: 'Deve ser um email válido!'
    },

    password: {
     required: 'você deve informar sua senha',
    }, 
  },

  new: {
    name: '',
    email: '',
    password: '',
  }


};

