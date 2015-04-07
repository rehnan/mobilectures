/**
* Doubt.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {

  attributes: {

    description : { 
    	type: 'text',
    	required: true 
    },

    'private' : { 
    	type: 'boolean',
    	required: true  
    },

    //Uma ou mais dúvida pertence há uma sessão
    belongs: {
    	model: 'Session'
    }
  }
};

