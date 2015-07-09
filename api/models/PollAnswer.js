/**
* PollAnswers.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {

	attributes: {

  	//Association attribute (One or more PollAnswers, belongs to one Listener)
  	poll: {
  		model: 'Poll'
  	},

    //Association attribute (One or more PollAnswers, belongs to one Poll)
    listener: {
    	model: 'Listener'
    },

    alternatives: { 
    	type: 'array',
    	required: true 
    }
 },
 
 validationMessages: {

 	alternatives: {
 		required: 'Selecione a(s) alternativa(s) desejada(s)!'
 	}
 },

 createIfValid: function (params, callback) {
 	PollAnswer.validate(params, function (errors) {

 		if (errors) {
 			var pretty_errors = SailsValidador(PollAnswer, errors);
 			//Log.debug('Error create PollAnswer ==> ' + JSON.stringify(pretty_errors));
 			return callback(pretty_errors, null);
 		}

 		PollAnswer.create(params, function (err, record) {
 			if(err){return callback(err, null);}
 			//Log.debug('PollAnswer created');
 			return callback(null, record);
 		});

 	});
 },
};

