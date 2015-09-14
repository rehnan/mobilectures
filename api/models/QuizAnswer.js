/**
* QuizAnswer.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {
   attributes: {
  /*
	* #########  Assossiations Attributes
   */
  		//Association attribute (One or more QuizAnswers, belongs to one Quiz)
  		quiz: {
  			model: 'Quiz'
  		},

  		//Association attribute (One or more quizquestion, belongs to one Quiz)
  		quizquestion: {
  			model: 'QuizQuestion'
  		},

      //Association attribute (One or more QuizAnswers, belongs to one Listener)
      listener: {
         model: 'Listener'
      },
  /*
	* ######### End Assossiations Attributes
   */
      //Required any alternative index
      alternative: { 
         type: 'integer',
         required: true
      },

      correct_alternative: { 
         type: 'integer',
         required: true
      },

      pointing: {
         type: 'float',
         defaultsTo: 0.0
      },

      time: {
         type: 'integer',
         defaultsTo: 0
      },

      hit: {
        type: 'boolean',
        defaultsTo: false
      }
   },

   validationMessages: {

      alternative: {
         required: 'Você deve selecionar uma das alternativas!',
         integer: 'O parâmetro da alternativa correta deve ser do tipo integer!'
      }
   },

   createIfValid: function (params, callback) {
      QuizAnswer.validate(params, function (errors) {

         if (errors) {
            var pretty_errors = SailsValidador(QuizAnswer, errors);
            Log.debug('Error create QuizAnswer ==> ' + JSON.stringify(pretty_errors));
            return callback(pretty_errors, null);
         }

         //Find Quiz
         /*Problema: poulate retornando apenas umas questão: quanso o save 
            é executado, ele substitui a array de questões pela última upada
            Achar outra solução!!!!
         */
         Quiz.findOne({id:params.quiz, status:'open', sent:true, enabled:true}).populate('questions', {id:params.quizquestion}).exec(function(err, quiz){
            if(err) { return callback(err, null) }
            if(!quiz) { return callback(null, null); }
            if(!quiz.questions.length > 0) {return callback(null, null);}
            Log.info('@@@@@@@@@@@@@@@');
            Log.info(params);
            QuizQuestion.findOne({id:params.quizquestion}).exec(function(err, quizquestion){
              if(err){return callback(err, null);}

                quizquestion.answers.add(params);
                quizquestion.number_participants += 1;
                quizquestion.number_votes += 1;
                quizquestion.statistics[params.alternative][1] += 1;

                quizquestion.save(function(err, record){
                  if(err){return callback(err, null);}
                 
                  //Update Publish create answer quiz
                  QuizAnswer.publishCreate({id:record.id, statistics:record.statistics});
                  Log.info('############## Publish create QuizAnswer');
                  return callback(null, record);
                });
            });
         });
      });
  }
};

