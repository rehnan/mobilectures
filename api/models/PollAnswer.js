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

    Poll.findOne({id:params.poll, status:'open'}).exec(function(err, poll){
          if(err) { return callback(err, null) }
          if(!poll) { return callback(null, null); }

      PollAnswer.create(params, function (err, record) {
          if(err){return callback(err, null);}

          PollAnswer.count_votes_alternatives(poll, params.alternatives, function(poll){
              poll.number_participants += 1;
              poll.save(function(err, record){
                if(err){return callback(err, null);}
                  Log.debug('Poll saved From PollAnswer');
                  PollAnswer.publishCreate({id:record, statistics:record.statistics});
                  Log.info('Publish create PollAnswer');
                  return callback(null, poll);
              });
          });
      });
 		});
 	});
 },

 count_votes_alternatives: function (poll, alternatives, cb) {
    for(i = 0; i < alternatives.length; i++) {
            //Log.json(poll.statistics.rows[alternatives[index]]);
            poll.number_votes += 1;
            poll.statistics.rows[alternatives[i]].c[1].v += 1;
    };
    return cb(poll);
 },
};

