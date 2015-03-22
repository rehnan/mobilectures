module.exports = {
	errors: {	
		form:{
			class: function (input, errors) {
				if (Object.keys(errors).length > 0 && errors[input] !== undefined)  
					return "has-error has-feedback";
				else
					return "";		
			},
			message: function (input, errors) {
				if (Object.keys(errors).length > 0 && errors[input] !== undefined) {
					var error_messages = errors[input];
					var messages = "";

					_.each(error_messages, function(message) {
						messages += '<span class="help-block">' + message + '</span>';
					});

					return messages;
				
				} else { return "" };
			}
		}
	},

	signin: {
		push_error: function(input_value, key, message, array_errors){
			if(input_value.trim() === ''){
				array_errors[key] = new Array();
       			array_errors[key].push(message);
       		}
		},

		clear_errors: function(array){
			array = {};
		}	
	}
}	