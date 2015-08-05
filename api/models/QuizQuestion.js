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

  		title: {
   		type: 'text',
   		required: true 
   	},

      /*
	   * Attribute to add array of alternatives 
	   */
	   alternatives: {
	   	type: 'array',
	   	defaultsTo: []
	   },

	   time: {
	   	type: 'integer',
	   	defaultsTo: 60
   	},

	   points: {
	   	type: 'integer',
	   	defaultsTo: 10
   	},

	   statistics: {
	   	type: 'json',
	   	defaultsTo: {}
   	},

   	number_votes: {
	   	type: 'integer',
	   	defaultsTo: 0
	   },

	   number_participants: {
	   	type: 'integer',
	   	defaultsTo: 0
	   }
   }
};

