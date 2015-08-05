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
      }
   }
};

