/**
* Poll.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {

	attributes: {
     /*
   * Attribute to set title a poll 
   */
   title : { 
     type: 'string',
     required: true ,
     maxLength: 30
   },

    /*
   * Attribute to set description a poll 
   */
   description : { 
     type: 'string',
     required: true,
     minLength: 15
   },

   /*
   * Attribute to disable/enable poll (In case of delete poll action) 
   */
   enabled: {
     type: 'boolean',
     defaultsTo: true
   },

    //Association attribute (One or more polls, belongs to one session)
    session: {
    	model: 'Session'
    },

    pollanswers:{
      collection: 'PollAnswer',
      via: 'poll'
    },

  /*
   * Attribute to set description question from a poll
   */
   question: {
    type: 'text',
    defaultsTo: ''
  },

   /*
   * Attribute to add array of alternatives 
   */
   alternatives: {
    type: 'array',
    defaultsTo: []
  },

   /*
   * Attribute to set if poll is multiple choice 
   */
   choice_multiple: {
    type: 'boolean',
    defaultsTo: false
  },

   /*
   * Attribute to check status poll
   closing: cinza; opening: verde; pending: laranja; ready:azul
   */
  status: {
      type: 'string',
      enum: ['open', 'closed', 'pending', 'ready'],
      defaultsTo: 'pending'
  },

  statistics: {
    type: 'json',
    defaultsTo: {}
  },

  /*
   * Attribute to check if poll was sent to listeners 
   */
  sent: {
    type: 'boolean',
    defaultsTo: false
  },

  number_votes: {
    type: 'integer',
    defaultsTo: 0
  },

  number_participants: {
    type: 'integer',
    defaultsTo: 0
  },

  points: {
    type: 'integer',
    defaultsTo: 10
  }
},

validationMessages: {

  title: {
    required: 'Você deve informar o título da enquete!',
    maxLength: 'O Título deve possuir no máximo 50 caracteres!'
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

    before_send: function (poll, callback) {
      Poll.inicialize_statistics(poll, function(statistics){
        Poll.update({id:poll.id}, {status:'open', sent:true, statistics:statistics}).exec(function (err, updated){
          if (err) { return callback(err) }
          var poll;
          (updated.length > 0) ? poll = updated[0] : poll = null;
          return callback(null, poll);
        });
      });
    },

    create_statistics: function (poll_id, callback) {
      Poll.findOne({id:poll_id, status:'closed'}).populate('pollanswers', {}).exec(function(err, poll){
        if(err) { return callback(err, null); }
        if(!poll) { return callback(null, null); }
        return callback(null, poll);
       /* Poll.count_votes_alternatives(poll, function(poll){
          //Saving votes apuration
           poll.save(function(err, record){
               if(err){return callback(err, null);}
               Log.debug('Poll saved from Poll');
              return callback(null, record);
            });
        });*/
      });
    },


/*    count_votes_alternatives: function (poll, cb) {
        var i = 0;
        var j = 0;
        for(i; i < poll.pollanswers.length; i++) {
          for(j; j < poll.pollanswers[i].alternatives.length; j++) {
            var answer = poll.pollanswers[i].alternatives[j];
            if (poll.alternatives.indexOf(answer) === 0) {
                  var index_found = poll.alternatives.indexOf(answer);
                  Log.json(poll.statistics.rows[index_found].c[1].v);
                  poll.statistics.rows[index_found].c[1].v += 1;
                  Log.info('Votes to: '+answer+' => '+poll.statistics.rows[index_found].c[1].v) ;
            }
          }
        }
        return cb(poll);
    },*/

    inicialize_statistics: function (poll, callback) {
      poll.statistics = {"cols":[{"type":"string"},{"type":"number"}],"rows":[]};
      _.each(poll.alternatives, function(alternative){
        poll.statistics.rows.push({"c": [{ "v": alternative},{"v":0} ]});
      });
      return callback(poll.statistics);
    },

    close: function (params, callback) {
      Log.json(params);
      Poll.update({id:params.poll_id}, {status:'closed'}, function (err, updated) {
        if (err) {return callback(err, null)}
          Log.info(updated);
        Log.info(updated[0]);
        return callback(null, updated[0]);  
      });
    },

    update_statistic: function (poll, callback) {

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

      Session.findOne({id:session.id, owner:session.owner}).populate('polls', {enabled:true}).exec(function (err, session) {
       if(err){return callback(err, null);}

       var response = {};

       if(session && session.polls.length > 0) {
        response.polls = session.polls;
        Log.debug(response.polls);
        response.status = true;
      } else {
        response.polls = {};
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
     (quantity_altvs >= 2 && params.question.trim() !== '') ? params.status = 'ready' : params.status = 'pending'; 
     Poll.update({id:params.poll_id, session:params.session_id}, params).exec(function (err, updated) {
       if(err) { return callback(err, null) }
         response.poll_id = updated[0].id;
       return callback(null, response);
     });
   },

   disable: function (params, callback) {
    var response = {};
    Poll.update({id:params.poll_id, session:params.session_id}, {enabled:false}).exec(function(err, poll){
     if(err) {callback(err, null);}
     if(!Validator.objectIsEmpty(poll)) {
      response.status = true;
      Log.info('Enquete desabilitada!');  
      callback(null, response);
    } else {
     response.status = false;
     Log.error('Enquete Não encontrada!');  
     callback(null, response);
   }
 });
  }
};

