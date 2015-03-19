/**
 * Takes a Sails Model object (e.g. User) and a ValidationError object and translates it into a friendly
 * object for sending via JSON to client-side frameworks.
 *
 * To use add a new object on your model describing what validation errors should be translated:
 *
 * module.exports = {
 *   attributes: {
 *     name: {
 *       type: 'string',
 *       required: true
 *     }
 *   },
 *
 *   validation_messages: {
 *     name: {
 *       required: 'you have to specify a name or else'
 *     }
 *   }
 * };
 *
 * Then in your controller you could write something like this:
 *
 * var validator = require('sails-validator-tool');
 *
 * Mymodel.create(options).done(function(error, mymodel) {
 *   if(error) {
 *       error_object = validator(Mymodel, error);
 *       res.send({result: false, errors: error_object});
 *   }
 * });
 *
 * @param model {Object} An instance of a Sails.JS model object.
 * @param validationErrors {Object} A standard Sails.JS validation object.
 *
 * @returns {Object} An object error messages in array.
 * NOTE:
 *   ARRANGEMENT OF ERROR MESSAGES WILL FOLLOW HOW YOU DEFINE YOUR FIELD
 */

module.exports = function(model, err){
  if(!err.ValidationError) return

  var validationError = err.ValidationError;
  var custom_messages = model.validationMessages;
  var error_fields = Object.keys(validationError);
  var error_messages = {};

  error_fields.forEach(function(field){
    error_messages[field] = new Array();

    field_messages = custom_messages[field]
    validationError[field].forEach(function(err){
      if(!field_messages) error_messages[field].push(field + " should be " + err.rule);
      else{
        error_message = field_messages[err.rule]? field_messages[err.rule] : (field + " should be " + err.rule);
        error_messages[field].push(error_message)
      }

    });
  });

  return error_messages;
}