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
			minLength: 15
		},

		enabled: {
			type: 'boolean',
			defaultsTo: true
		},

    //Uma ou mais enquetes pertence há uma sessão
    session: {
    	model: 'Session'
    },

    question: {
      type: 'text',
      defaultsTo: ''
   },

   alternatives: {
      type: 'array',
      defaultsTo: []
   },

   choice_multiple: {
      type: 'boolean',
      defaultsTo: false
   },

   valid: {
      type: 'boolean',
      defaultsTo: false
   }
},

validationMessages: {

  title: {
    required: 'Você deve informar o título da enquete!',
    maxLength: 'O Título deve possuir no máximo 30 caracteres!'
 },

 description: {
    required: 'Você deve informar a descrição da enquete!',
    minLength: 'A descrição deve possuir no mínimo 15 caracteres'
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
    },

    updateIfValid: function (params, callback) {

      var response = {};
      response.errors = null
      response.validation_errors = null;
      response.poll_error = null; 

      Poll.validate(params, function (errors) {

         if (errors) {
            Log.debug('Poll Errors ==> ' + JSON.stringify(errors));
            pretty_errors = SailsValidador(Poll, errors);
            Log.debug('Pretty Errors ==> ' + JSON.stringify(pretty_errors));
            response.validation_errors = pretty_errors;
            return callback(null, response);
         }
         
         Poll.update({session:params.session, id:params.poll_id}, params).exec(function (err, updated) {
            if(err) { return callback(err, null) }

             if(Validator.objectIsEmpty(updated)){
              response.poll_error = 'Enquete não encontrada para atualização!';
              return callback(null, response);
           } 

           response.poll = updated;
           return callback(null, response);
        });
      });
   },

   findAll: function (session, callback){

      Session.findOne({id:session.id, owner:session.owner}).populate('polls').exec(function (err, session) {
       if(err){return callback(err, null);}

       var response = {};

       if(session && session.polls.length > 0) {
        response.polls = session.polls;
        response.status = true;
     } else {
        response.polls = {};
        response.status = false;
     }
     callback(null, response);
  });
   },

   find: function (params, callback) {

      Session.findOne({id:params.session_id, owner:params.owner}).populate('polls', {id:params.poll_id}).exec(function (err, session) {
       if(err){return callback(err, null);}

       var response = {};
       var index = session.polls.length;

       if(session && index > 0) {
        response.poll = session.polls[index-1];
        response.status = true;
     } else {
        response.poll = {};
        response.status = false;
     }

     callback(null, response);
  });
   },

   updateQuestionIfValid: function (params, callback) {
      var response = {};
      var quantity_altvs = params.alternatives.length;
      response.errors = Validator.verifyEmptyParams(params);

      if (!Validator.objectIsEmpty(response.errors)) {
         response.has_errors = true;
         return callback(null, response);
      }

      response.has_errors = false;
      (params.alternatives[0] === '') ? params.alternatives = [] : '';
      (quantity_altvs >= 2 && params.question.trim() !== '') ? params.valid = true : params.valid = false; 
      Poll.update({id:params.poll_id, session:params.session_id}, params).exec(function (err, updated) {
         if(err) { return callback(err, null) }
         response.poll_id = updated[0].id;
         return callback(null, response);
      });
   }
};

