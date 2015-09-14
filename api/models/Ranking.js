/**
* Ranking.js
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

		//Association attribute (One or more QuizAnswers, belongs to one Listener)
      listener: {
         model: 'Listener'
      },
	  /*
		* ######### End Assossiations Attributes
	   */

		pointing: {
			type: 'float',
			defaultsTo: 0.0
		}
	},

	ranking_update: function (conditions, points, cb) {
    
    Ranking.findOne(conditions).exec(function (err, ranking) {
      if(err) { return cb(err); }
     
      Ranking.update(conditions, {pointing: ranking.pointing + points}).exec(function(err, updated){
        if(err) { return cb(err); }
        return cb(updated[0]);
      });
    });
  }
};

