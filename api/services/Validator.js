module.exports = {
   
   verifyEmptyParams: function(json){
      var errors = {};
      if(Object.keys(json).length > 0){

         Object.keys(json).forEach(function(key) {
            if(json[key].trim() === ''){
               errors[key] = new Array();
               errors[key].push(sails.__('validator.messages.empty_field'));
            }
         });
      }
      return errors;
   },
   
   /*
    * TODO: Extract to lib/plugin
    */ 
   unique: function(model, field, value, errors, callback) {
      sails.log.debug('Validator unique for ==> ' + model.globalId);
      sails.log.debug('Validator Errors ==> ' + JSON.stringify(errors));

      conditions = {};
      conditions[field] = value;

      model.findOne(conditions, function (unique_err, unique_model) {
         if (unique_err) {return next(unique_err);}

         if (unique_model) {
            if (errors == undefined) { 
               errors = {"error":"E_VALIDATION","status":400,"summary":"1 attribute is invalid","model": model.globalId};
            }
            if (errors['invalidAttributes'] == undefined) { errors['invalidAttributes'] = {}; }
            if (errors['invalidAttributes']['field'] == undefined) {errors['invalidAttributes'][field] = Array(); }

            errors['invalidAttributes'][field].push({"rule":"unique","message":"\"unique\" attribute should be unique: ''"});

            if (errors['ValidationError'] == undefined) { errors['ValidationError'] = errors['invalidAttributes'] };
         }
         callback(errors)
      }); 
   }
}
