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
          required: true,
          unique: true
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

  validationMessages: {

    name: {
     required: 'Você deve informar seu nome',
    },

    email: {
     required: 'você deve informar seu email',
     unique: 'Email já cadastrado!'
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

