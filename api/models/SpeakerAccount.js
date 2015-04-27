/**
 * SpeakerAccounts.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/#!documentation/models
 */

module.exports = {
   schema: true,
   attributes: {
      name: {
         type: 'string',
         required: true
      },

      email: {
         type: 'string',
         unique: true,
         required: true,
         email: true
      },

      password: {
         type: 'string',
         required: true
      },

      //Association with sessions (Uma conta de palestrante pode gerenciar várias sessões)
      //Possui uma coleção de sessões
      sessions:{
         collection: 'session', //do modelo Sessions
         via: 'owner' //via atributo owner (Localizado no modelo Sessions)
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

   new: {
      name: '',
      email: '',
      password: '',
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
      SpeakerAccount.validate(params, function (errors) {
         sails.log.debug('Speaker Errors ==> ' + JSON.stringify(errors));

         Validator.unique(SpeakerAccount, 'email', params.email, errors, function (errors) {

            if (errors) {
               pretty_errors = SailsValidador(SpeakerAccount, errors);
               sails.log.debug('Speaker Errors ==> ' + JSON.stringify(pretty_errors));
               return callback(pretty_errors);
            }

            SpeakerAccount.create(params, function (err, record) {
               sails.log.debug('Speaker valid');
               return callback(null, record);
            });

         });
      });
   },

   /*
    * Update with validates unique and custom messages
    * Thinking about extract to plugin
    * This not update password
    */
   updateIfValid: function (params, callback) {
      SpeakerAccount.findOne({id: params.user_id}, function (err, speaker) {
         if (err) {return next(err);}

         var current_email = speaker.email;
         speaker.email = params.email;
         speaker.name = params.name;
         speaker.validate(function (errors) {

            var check_errors = function (errors, speaker) {
               if (errors) {
                  errors_messages = SailsValidador(SpeakerAccount, errors);
                  callback(errors_messages);
               } else {
                  speaker.save();
                  callback(null, speaker);
               }
            }

            if (params.email !== current_email) {
               SpeakerAccount.findOne({email: params.email }, function (unique_err, unique_user) {
                  if (unique_err) {return next(unique_err);}

                  if (unique_user) {
                     if (errors == undefined) { 
                        errors = {"error":"E_VALIDATION","status":400,"summary":"1 attribute is invalid","model":"SpeakerAccount"}  
                     }
                     if (errors['invalidAttributes'] == undefined) { errors['invalidAttributes'] = {} }  
                     if (errors['invalidAttributes']['email'] == undefined) {errors['invalidAttributes']['email'] = Array() }

                     errors['invalidAttributes']['email'].push({"rule":"unique","message":"\"unique\" attribute should be unique: ''"});

                     if (errors['ValidationError'] == undefined) { errors['ValidationError'] = errors['invalidAttributes'] };
                  }
                  check_errors(errors, speaker);
               });
            } else {
               check_errors(errors, speaker);
            }
         });
      });
   },

   /*
    * Update password with custom messages
    */
   updatePassword: function (params, callback) {

      SpeakerAccount.findOne({id: params.user_id}).exec(function(err, speaker) {
         if(err){return sails.log.debug(err);}

         var bcrypt = require('bcrypt-nodejs');
         bcrypt.compare(params.current_password, speaker.password, function(err, isEquals) {
            var errors = Validator.verifyEmptyParams(params);

            if (!isEquals) {
               sails.log.debug('speaker wrong password ond update');

               if (errors['current_password'] == undefined) {errors['current_password'] = new Array();}
               errors['current_password'].push(sails.__('validator.messages.wrong_password'));
            }

            if (params.new_password.trim() !== params.confirm_password.trim()) {
               sails.log.debug('Password doens\'t match' + JSON.stringify(errors['new_password'] ));

               if (errors['new_password'] == undefined) {errors['new_password'] = new Array();}
               errors['new_password'].push(sails.__('validator.messages.password_match'));

               if (errors['confirm_password'] == undefined) {errors['confirm_password'] = new Array();}
               errors['confirm_password'].push(sails.__('validator.messages.password_match'));
            }

            if (Object.keys(errors).length <= 0) {
               var bcrypt = require('bcrypt-nodejs');
               var salt = bcrypt.genSaltSync(10);
               // Hash the password with the salt
               speaker.password = bcrypt.hashSync(params.new_password, salt);
               speaker.save();
               callback(null, speaker);
            } else {
               callback(errors);
            }
         });
      });
   }
};

