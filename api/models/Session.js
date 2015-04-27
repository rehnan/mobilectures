/**
 * Sessions.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/#!documentation/models
 */

module.exports = {
   schema: true,
   attributes: {

      name: {
         type: 'string',
         required: true,
      },

      key: {
         type: 'string',
         required: true,
         minLength: 6,
         unique: true
      },

      description: {
         type: 'string',
         required: true,
      },

      status: {
         type: 'boolean',
         defaultsTo: false 
      },

      //Pertence à um proprietário (palestrante)
      owner: {
         model:'speakeraccount' //Referente ao modelo SpeakerAccounts
      },

      //Tem uma coleção de ouvintes (listeners) participantes conectados
      listeners: {
         collection:'listener', //Referente ao modelo Listeners
         via: 'participants' //Relação estabelecida via atributo owners localizado no modelo Listeners 
      },

      //Possui uma coleção de dúvidas
      doubts: {
         collection: 'doubt', //Do modelo doubt
         via: 'belongs' //Relação estabelecida via atributo belongs localizado no modelo Listeners 
      }
   },

   validationMessages: {
      name: {
         required: 'Você deve informar o nome da sessão',
      },
      key: {
         required: 'você deve informar a chave de sessão',
         minLength: 'deve possuir no mínimo 6 números',
         unique: 'chave deve ser única!',
      },
      description: {
         required: 'você deve informar uma descrição sobre a sessão',
      },
   },

   new: {
      name: '',
      key: '',
      description: '',
      status: false
   },

   /*
    * Validates unique and custom messages
    * Thinking about extract to plugin
    */
   createIfValid: function (params, callback) {
      params.status = (params.status === "true");
      Session.validate(params, function (errors) {
         sails.log.debug('Session Errors ==> ' + JSON.stringify(errors));

         Validator.unique(Session, 'key', params.key, errors, function (errors) {

            if (errors) {
               pretty_errors = SailsValidador(Session, errors);
               sails.log.debug('Session Errors ==> ' + JSON.stringify(pretty_errors));
               return callback(pretty_errors);
            }

            Session.create(params, function (err, record) {
               sails.log.debug('Session create');
               return callback(null, record);
            });

         });
      });
   },
};

