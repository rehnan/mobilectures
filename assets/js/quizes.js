
$(document).ready(function (){  ml.quizes.load() });

ml.quizes = {

	load: function () {
		ml.quizes.addAndRemove_inputs();
		ml.quizes.sortable_inputs();
		ml.quizes.remove_empty_alternatives();
	},

	addAndRemove_inputs: function () {
		if ($('#form_new_question').length <= 0) {return;}

		    var max_fields      = 10; //maximum input boxes allowed
		    var wrapper         = $(".input_fields_wrap"); //Fields wrapper
		    var add_button      = $(".add_field_button"); //Add button ID
		    
		    var x = 1; //initlal text box count
		    $(add_button).click(function(e){ //on add input button click
		    	e.preventDefault();
		        if(x < max_fields){ //max input box allowed
		            x++; //text box increment
		            $(wrapper).append('<div class="input-group alternative glyphicon glyphicon-move order_alternative"><span class="input-group-addon"><input type="radio" name="correct_alternative" value="'+x+'"></span><input style="max-width:100%;float:right" class="form-control" name="alternatives[]" type="text" placeholder="Descrição da alternativa..." /><span class="input-group-btn remove_field"><button class="btn btn-danger" type="button"><span class="glyphicon glyphicon-remove"></span></button></span></div>'); //add input box
		         }
		         $('.input_fields_wrap div input').focus();
		      });
		    
                
		    $(wrapper).on("click",".remove_field", function(e){ //user click on remove text
		    	e.preventDefault(); $(this).parent('div').remove(); x--;
		    })
		 },

		 sortable_inputs: function () {
		 	if ($('#form_new_question').length <= 0) {return;}

		 	$(".question").sortable({
		 		tolerance: 'pointer',
		 		revert: 'invalid',
		 		placeholder: 'span2 alternative',
		 		sort: function( event, ui ) {
		 			console.log(event);
		 			console.log(ui);
		 		},
		 		forceHelperSize: true
		 	});
		 },

		 remove_empty_alternatives: function () {
		 	if ($('#form_new_question').length <= 0) {return;}

		 	$(".btn_save_altvs").click(function() {
		 		var form = $("#form_new_question");
		 		$(form).find('input.form-control').each(function(){
		 			var input = $.trim($(this).val());
		 			var numbers_input = $(form).find('input.form-control').size();

		 			if(input.length === 0 && numbers_input > 2) {
					//Remove div pai do input vazio
					$(this).parents('div.alternative').remove();
				} 
			});
		 	});
		 },


};