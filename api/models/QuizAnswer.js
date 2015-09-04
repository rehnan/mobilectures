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

      pointing: {
         type: 'float',
         defaultsTo: 0.0
      }
   },

   validationMessages: {

      alternative: {
         required: 'Você deve selecionar uma das alternativas!',
         integer: 'O parâmetro da alternativa correta deve ser do tipo inteiro!'
      }
   },

   createIfValid: function (params, callback) {
      QuizAnswer.validate(params, function (errors) {

         if (errors) {
            var pretty_errors = SailsValidador(QuizAnswer, errors);
            Log.debug('Error create QuizAnswer ==> ' + JSON.stringify(pretty_errors));
            return callback(pretty_errors, null);
         }

         Quiz.findOne({id:params.quiz, status:'pending'}).exec(function(err, quiz){
            if(err) { return callback(err, null) }

            if(!quiz) { return callback(null, null); }

            QuizAnswer.create(params, function (err, record) {
               if(err){return callback(err, null);}
               return callback(null, quiz);

               /*QuizAnswer.count_votes_alternatives(quiz, params.alternatives, function(poll){
                  quiz.number_participants += 1;
                  quiz.save(function(err, record){
                  if(err){return callback(err, null);}
                  Log.debug('Poll saved From QuizAnswer');
                  QuizAnswer.publishCreate({id:record, statistics:record.statistics});
                    Log.info('Publish create QuizAnswer');
                    return callback(null, quiz);
                  });
               });*/
            });
         });
      });
  },
};

