/**
* Sessions.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {
  schema: true,
  attributes: {

  		name: {
  			type: 'string',
			required: true,
  		},

		key: {
			type: 'string',
			required: true,
			minLength: 6
		},

		description: {
			type: 'string',
			required: true,
		},

		status: {
			type: 'boolean',
			defaultsTo: false 
		},

		//Pertence à um proprietário (palestrante)
		owner:{
            model:'speakeraccount' //Referente ao modelo SpeakerAccounts
        }
  },

  validationMessages: {
    name: {
 	   required: 'Você deve informar o nome da sessão',
    },
    key: {
 	   required: 'você deve informar a chave de sessão',
 	   minLength: 'deve possuir no mínimo 6 números'
    },
    description: {
 	   required: 'você deve informar uma descrição sobre a sessão',
    },
  },

  new: {
  	name: '',
  	key: '',
  	description: '',
  	status: false
  } 
};

