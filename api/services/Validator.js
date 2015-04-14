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
   }
}
