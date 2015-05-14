/**
* Doubt.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {

 attributes: {

      description : { 
         type: 'text',
         required: true 
      },

      private : { 
         type: 'boolean',
         required: true  
      },

        //Uma ou mais dúvida pertence há uma sessão
      session: {
        	model: 'Session'
      },

      listener: {
         model: 'Listener'
      },

      answered: {
         type: 'boolean',
         defaultsTo: false
      },

      enabled: {
         type: 'boolean',
         defaultsTo: true
      },
   },

   validationMessages: {

      private: {
         required: 'Você deve informar',
      },

      description: {
         required: 'você deve informar a descrição da dúvida',
      },  
   },

    /*
    * Validates unique and custom messages
    * Thinking about extract to plugin
    */
   createIfValid: function (params, req, callback) {

       Doubt.validate(params, function (errors) {

         if (errors) {
           Log.debug('Doubt Errors ==> ' + JSON.stringify(errors));
           pretty_errors = SailsValidador(Doubt, errors);
           Log.debug('Pretty Errors ==> ' + JSON.stringify(pretty_errors));
           return callback(pretty_errors, null, null);
        }

        Session.findOne({id:params.session}).populate('doubts').exec(function (err, session) {
           if(err){return callback(err, null, null);}
           session.doubts.add(params);
           session.save(function(err, record){
             if(err){return callback(err, null, null);}
             Log.debug('Doubt created');
                  //Publicando novo objeto doubt criado
                  var index = record.doubts.length;
                  var doubt = record.doubts[index-1];
                  
                  Doubt.publishCreate(record);
                  callback(null, doubt, index);
               });
        });
     });
   },

   show: function (params, callback){
      
      Session.findOne({id:params.session_id}).populate('doubts', {listener:params.listener_id}).exec(function (err, session) {
           if(err){return callback(err, null);}

           var response = {};

           if(session && session.doubts.length > 0) {
             response.doubts = session.doubts;
             response.status = true;
           } else {
             response.doubts = {};
             response.status = false;
           }
           callback(null, response);
        });
   },

   update_answered:function (conditions, doubt_id, callback) {
       var response = {};

       Session.findOne(conditions).populate('doubts', {id:doubt_id, enabled:true}).exec(function (err, session){
         if(err){return callback(err, response);}
         response.session_id = session.id;
         if(session && session.doubts.length > 0) {
              //Atribuindo à variável o objeto dúvida encontrado  
              var doubt = session.doubts[0];

              //Setando atributo checked do objeto
              if(doubt.answered) {
                 doubt.answered = false;
                 response.flash = 'A dúvida '+doubt.id +' foi reaberta!';
              } else {
                 doubt.answered = true;
                 response.flash = 'A dúvida '+doubt.id +' foi respondida!';
              } 
              
              //Commitando alterações no banco
              doubt.save(function(err,updated){
               if(err){return callback(err, response);}
               response.updated = true;
               return callback(null, response);
               //Log.debug('Doubt ID '+updated.id+' Doubt decription '+updated.description);
            });
         }else{
              response.updated = false;
              response.flash = 'Dúvida inexistente!!';
              return callback(null, response);
         }
      });
   },

   count: function(conditions, callback) {
      Session.findOne(conditions).populate('doubts', {enabled:true}).exec(function (err, session){
        if(err){return callback(err, null);}
        //Log.debug('Número de dúvidas: '+ JSON.stringify(session.doubts.length));
            return callback(null, session.doubts.length);
      });
   },

   destroy: function(conditions, doubt_id, callback){
      var response = {};

      Session.findOne(conditions).populate('doubts', {id:doubt_id, enabled:true}).exec(function (err, session){
        if(err){return callback(err, response);}
        response.session_id = session.id;
        if(session && session.doubts.length > 0) {
                       //Atribuindo à variável o objeto dúvida encontrado  
                       var doubt = session.doubts[0];

                       //Setando atributo enabled par false do objeto (Indicar remoção do atributo)
                       doubt.enabled = false;
                       
                       //Commitando alterações no banco
                       doubt.save(function(err, updated){
                        if(err){return callback(err, response);}
                        response.destroyed = true;
                        response.flash = 'A dúvida '+updated.id +' foi excluída com sucesso!';
                        //Publicando update de remoção da dúvida
                        Doubt.publishUpdate(doubt.id, {enabled:doubt.enabled});
                        return callback(null, response);
                     });
        }else{
           response.destroyed = false;
           response.flash = 'A dúvida '+doubt_id +' não pode ser excluída!';
           return callback(null, response);
        }
      });
   }
};

