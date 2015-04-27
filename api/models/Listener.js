/**
 * Listeners.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/#!documentation/models
 */

module.exports = {
   schema: true,
   attributes: {

      name : { 
         type: 'string',
         required: true 
      },

      email : { 
         type: 'string',
         required: true,
         email: true,
         unique: true,
      },

      password : { 
         type: 'string',
         required: true 
      },

      logged_room : { 
         type: 'string',
         defaultsTo: null 
      },

      participants: {
         collection:'session', //Referente ao modelo Session
         via: 'listeners'
      }
   },

   validationMessages: {
      name: {
         required: 'você deve informar seu nome',
      },
      email: {
         required: 'você deve informar seu email',
         unique: 'email já cadastrado!',
         email: 'deve ser um email válido!'
      },
      password: {
         required: 'você deve informar sua senha',
      },
   },

   //Before save crypt the password attribute
   beforeCreate: function (attrs, next) {

      if(attrs.password != undefined) {
         var bcrypt = require('bcrypt-nodejs');
         var salt = bcrypt.genSaltSync(10);

         // Hash the password with the salt
         attrs.password = bcrypt.hashSync(attrs.password, salt);
         sails.log.debug('[Action: beforeCreate] Password Updated');
      }
      next();
   },

   /*
    * Validates unique and custom messages
    * Thinking about extract to plugin
    */
   createIfValid: function (params, callback) {
      Listener.validate(params, function (errors) {
         sails.log.debug('Error create Listener on validate  ==> ' + JSON.stringify(errors));

         Validator.unique(Listener, 'email', params.email, errors, function (errors) {

            if (errors) {
               var pretty_errors = SailsValidador(Listener, errors);
               sails.log.debug('Error create Listener ==> ' + JSON.stringify(pretty_errors));
               return callback(pretty_errors);
            }

            Listener.create(params, function (err, record) {
               sails.log.debug('Listerner created');
               return callback(null, record);
            });

         });
      });
   },

   authenticate: function(params, callback) {
      Listener.findOne({email: params.email}).exec( function(err, listener) {
         if(err || !listener) {
            sails.log.debug("Authenticate listener" + err);
            callback({error:{ message: sails.__('liseter.auth.error') }});
         } else {
            var bcrypt = require('bcrypt-nodejs');
            bcrypt.compare(params.password, listener.password, function(err, equals) {
               if (equals) {
                  callback(null, listener);
               } else {
                  callback({error:{message: sails.__('liseter.auth.error') }});
               }
            });
         }
      });
   },
   leave: function (session, socket) {
      if (session.listener) {
         var conditions = { id: session.listener.id }

         Listener.findOne(conditions).exec(function (err, listener) {
            if(err){return sails.log.error("Error listner sign-out " + err);}

            sails.log.error('Listener ' + JSON.stringify(session.listener) + ' leave session ' + session.listener.logged_room);

            var session_id = listener.logged_room;
            listener.logged_room = null;

            listener.save(function (err, record) {

               Listener.publishUpdate(listener.id, {logged_room:null});
               sails.sockets.leave(socket, session_id);
               Listener.unsubscribe(socket, listener);

               session.listener = undefined;
               sails.log.error('Listener logged out ['+JSON.stringify(session)+']');
            });
         });
      }  
   },
}
