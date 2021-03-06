/**
* QuizQuestion.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {

	attributes: {
  /*
	* #########  Assossiations Attributes
	*/
  		//Belongs to a quiz
  		quiz: {
  			model: 'Quiz'
  		},

  		//Has a QuizAnswers collection via attribute quizquestion
  		answers: {
  			collection: 'QuizAnswer',
  			via: 'quizquestion'
  		},

  /*
	* ######### End Assossiations Attributes
	*/

	description: {
		type: 'text',
		required: true,
		maxLength: 200,
		minLength: 5 
	},

      /*
	   * Attribute to add array of alternatives 
	   */
	   alternatives: {
	   	type: 'array',
	   	defaultsTo: []
	   },

	   correct_alternative: {
	   	type: 'integer',
	   	defaultsTo: null
	   },

	   status: {
	   	type: 'string',
	   	enum: ['valid', 'invalid'],
	   	defaultsTo: 'invalid'
	   },

	   points: {
	   	type: 'integer',
	   	required: true,
	   	defaultsTo: 0
	   },

	   statistics: {
	   	type: 'array',
	   	defaultsTo: []
	   },

	   number_votes: {
	   	type: 'integer',
	   	defaultsTo: 0
	   },

	   number_participants: {
	   	type: 'integer',
	   	defaultsTo: 0
	   },

	   hits: {
	   	type: 'integer',
	   	defaultsTo: 0
	   },

	   errors: {
	   	type: 'integer',
	   	defaultsTo: 0
	   },

	   time: {
	   	type: 'integer',
	   	required: true,
	   	defaultsTo: 60
	   }
	},

	validationMessages: {

		description: {
			required: 'Você deve informar a descrição da questão!',
			maxLength: 'A descrição deve possuir no máximo 200 caracteres!',
			minLength: 'A descrição deve possuir no mínimo 5 caracteres!'
		},

		correct_alternative: {
			integer: 'O parâmetro da alternativa correta deve ser do tipo inteiro!'
		},

		points: {
			integer: 'O parâmetro da alternativa correta deve ser do tipo inteiro!',
			required: 'Você deve informar o valor da pontuação desta questão!'
		},

		time: {
			integer: 'O parâmetro do tempo deve ser do tipo inteiro!',
			required: 'Você deve informar o tempo (segundos) necessário para responder a questão!'
		}
	},

	new: {
		description: '',
		points: 0,
		alternatives: [],
	},

	createIfValid: function (params, callback) {
		
		
		Quiz.findOne({id:params.quiz_id}).populate('questions').exec(function (err, quiz) {
			if(err){return callback(err, null, null);}
			if(!quiz) { return callback(null, null, null); }

			QuizQuestion.validate(params, function (errors) {

				if (errors) {
					Log.debug('Quiz Errors ==> ' + JSON.stringify(errors));
					pretty_errors = SailsValidador(QuizQuestion, errors);
					Log.debug('Pretty Errors ==> ' + JSON.stringify(pretty_errors));
					return callback(pretty_errors, quiz, null);
				}

				params.statistics = [];
				for(i = 0; i < params.alternatives.length; i++) {
					Log.info(params.alternatives[i]);
					params.statistics.push([params.alternatives[i], 0]);
				}

		         /* Se possuiu no mínimo duas alternativas
			 		Se POssui a alternativa certa marcada 
			 		Se a alternativa marcada é >= 0 ou <= ao número de alternativa
			 		*/

			 		if(params.alternatives.length >= 2 && params.correct_alternative && (params.correct_alternative >= 0 && params.correct_alternative <= params.alternatives.length)) {
			 			Log.info('Validou!!!');
			 			params.status = 'valid';
			 		} else {
			 			params.status = 'invalid';
			 		}

			 		if(params.points > 10 || params.points < 0) {params.points = 0; }
			 		
			 		quiz.questions.add(params);
			 		quiz.save(function(err, record){
			 			if(err){ return callback(err, quiz, null); }

			 			var index = record.questions.length;
			 			var question = record.questions[index-1];

			 			callback(null, quiz, question);
			 		});
			 	});
});

},

updateIfValid: function (question, callback) {

	QuizQuestion.validate(question, function (errors) {
		
		if (errors) {
			Log.debug('Quiz Errors ==> ' + JSON.stringify(errors));
			pretty_errors = SailsValidador(QuizQuestion, errors);
			Log.debug('Pretty Errors ==> ' + JSON.stringify(pretty_errors));
			return callback(pretty_errors, null);
		}

		question.statistics = [];
		for(i = 0; i < question.alternatives.length; i++) {
			Log.info(question.alternatives[i]);
			question.statistics.push([question.alternatives[i], 0]);
		}

		if(question.alternatives.length >= 2 && question.correct_alternative && (question.correct_alternative >= 0 && question.correct_alternative <= question.alternatives.length)) {
			Log.info('Validou!!!');
			question.status = 'valid';
		} else {
			question.status = 'invalid';
		}

		if(question.points > 10 || question.points < 0) {question.points = 0; }

		QuizQuestion.update({id:question.question_id, quiz:question.quiz_id}, question).exec(function (err, updated) {
			if(err) { return Log.error(err); }

			if(Validator.objectIsEmpty(updated)){
				return callback(null, null);
			} 
			return callback(null, updated[0]);
		});
	});
}
};

