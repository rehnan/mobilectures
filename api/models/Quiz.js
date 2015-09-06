/**
* Quiz.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {

	attributes: {

  /*
	* #########  Assossiations Attributes
   */

	   //Belongs to a Session
	   session: {
	    	model: 'Session'
	   },

	   //Has a QuizQuestions collection viz attribute quiz
	   questions: {
	  		collection: 'QuizQuestion',
	  		via: 'quiz'
	  	},

  /*
	* ######### End Assossiations Attributes
   */

	  /*
	   * Attribute to set title a quiz 
	   */
	   title : { 
	   	type: 'string',
	   	required: true ,
	   	maxLength: 30
	   },

	    /*
	   * Attribute to set description a quiz 
	   */
	   description : { 
	   	type: 'string',
	   	required: true,
	   	minLength: 15
	   },

	   /*
	   * Attribute to disable/enable quiz (In case of delete quiz action) 
	   */
	   enabled: {
	   	type: 'boolean',
	   	defaultsTo: true
	   },

	   /*
	   * Attribute to check status quiz
	   closing: cinza; opening: verde; pending: laranja; ready:azul
	   Deixar default: closed quando enviada: open
	   */
	   status: {
	   	type: 'string',
	   	enum: ['open', 'closed', 'pending', 'ready'],
	   	defaultsTo: 'pending'
	   },

	  /*
	   * Attribute to check if quiz was sent to listeners 
	   */
	   sent: {
	   	type: 'boolean',
	   	defaultsTo: false
	   }
	},

  /*
	* Validation messages method
   */
	validationMessages: {

	  title: {
	    required: 'Você deve informar o título do Quiz!',
	    maxLength: 'O Título deve possuir no máximo 30 caracteres!'
	  },

	  description: {
	    required: 'Você deve informar a descrição do quiz!',
	    minLength: 'A descrição deve possuir no mínimo 15 caracteres'
	  }, 
	},

  /*
	* Get new Quiz instance 
	*/
	new: {
	  title: '',
	  description: ''
	},

	createIfValid: function (params, req, callback) {

    	Quiz.validate(params, function (errors) {

    		if (errors) {
    			Log.debug('Quiz Errors ==> ' + JSON.stringify(errors));
    			pretty_errors = SailsValidador(Quiz, errors);
    			Log.debug('Pretty Errors ==> ' + JSON.stringify(pretty_errors));
    			return callback(pretty_errors, null);
    		}

    		Session.findOne({id:params.session_id}).populate('quizes').exec(function (err, session) {
    			if(err){return callback(err, null);}
    			Log.json(session);
    			session.quizes.add(params);
    			session.save(function(err, record){
    				if(err){return callback(err, null);}
    				Log.debug('Quiz created');
    				var index = record.quizes.length;
    				var quiz = record.quizes[index-1];
    				callback(null, quiz);
    			});
    		});
    	});
    },

    updateIfValid: function (params, callback) {

      Quiz.validate(params, function (errors) {

    		if (errors) {
    			Log.debug('Quiz Errors ==> ' + JSON.stringify(errors));
    			pretty_errors = SailsValidador(Quiz, errors);
    			Log.debug('Pretty Errors ==> ' + JSON.stringify(pretty_errors));
    			return callback(pretty_errors, null);
    		}

    		Quiz.update({session:params.session_id, id:params.quiz_id}, params).exec(function (err, updated) {
		         if(err) { return callback(err, null) }
		         return callback(null, updated[0]);
		   });
    	});
    },

   before_send: function (params, callback) {
   	Log.info(params);
   	var response = {};
   	var conditions = {id:params.quiz_id, session:params.session_id, enabled:true};
      Quiz.findOne(conditions).populate('questions', {status:'invalid'}).exec(function (err, quiz) {
         if (err) { return callback(err, null); }
         response.quiz = quiz;
         
         if (!quiz) { return callback(null, response); }
         
       	if(quiz.questions.length > 0) {
       		response.pending = true;
       		response.quiz = quiz;
       		return callback(null, response);
       	}
       	Quiz.findOne(conditions).populate('questions', {status:'valid'}).exec(function (err, quiz) {
       		if (err) { return callback(err, null); }
       		response.pending = false;
       		response.quiz = quiz;
       		return callback(null, response);
       	});
      });
   },

   disable: function (params, callback) {
   	var response = {};
	   Quiz.update({id:params.quiz_id, session:params.session_id}, {enabled:false}).exec(function(err, quiz){
	     if(err) {callback(err, null);}
	     if(!Validator.objectIsEmpty(quiz)) {
	         response.status = true;
	      	Log.info('Quiz desabilitado!');  
	      	callback(null, response);
	      } else {
	       	response.status = false;
	       	Log.error('Quiz não encontrada!');  
	     		callback(null, response);
	     }
	 });	
   }
};

