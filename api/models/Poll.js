/**
* Poll.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {

	attributes: {
		title : { 
			type: 'string',
			required: true ,
			maxLength: 30
		},

		description : { 
			type: 'string',
			required: true,
			minLength: 10
		},

		enabled: {
			type: 'boolean',
			defaultsTo: true
		},

      //Uma ou mais enquetes pertence há uma sessão
      session: {
      	model: 'Session'
      }
   },

   validationMessages: {

   	title: {
   		required: 'Você deve informar o título da enquete!',
   		maxLength: 'O Título deve possuir no máximo 30 caracteres!'
   	},

   	description: {
   		required: 'Você deve informar a descrição da enquete!',
   		minLength: 'A descrição deve possuir no mínimo 10 caracteres'
   	}, 
   },

   new: {
   	title: '',
   	description: ''
   },

    /*
    * Validates unique and custom messages
    * Thinking about extract to plugin
    */
    createIfValid: function (params, req, callback) {

    	Poll.validate(params, function (errors) {

    		if (errors) {
    			Log.debug('Poll Errors ==> ' + JSON.stringify(errors));
    			pretty_errors = SailsValidador(Poll, errors);
    			Log.debug('Pretty Errors ==> ' + JSON.stringify(pretty_errors));
    			return callback(pretty_errors, null);
    		}

    		Session.findOne({id:params.session}).populate('polls').exec(function (err, session) {
    			if(err){return callback(err, null);}
    			session.polls.add(params);
    			session.save(function(err, record){
    				if(err){return callback(err, null);}
    				Log.debug('Poll created');
    				var index = record.polls.length;
    				var poll = record.polls[index-1];
    				callback(null, poll);
    			});
    		});
    	});
    }

 };

