

$(document).ready(function (){  ml.polls.load() });

ml.polls = {

	load: function () {
		ml.polls.addAndRemove_inputs();
		ml.polls.sortable_inputs();
	},

	addAndRemove_inputs: function () {
		    var max_fields      = 10; //maximum input boxes allowed
		    var wrapper         = $(".input_fields_wrap"); //Fields wrapper
		    var add_button      = $(".add_field_button"); //Add button ID
		    
		    var x = 1; //initlal text box count
		    $(add_button).click(function(e){ //on add input button click
		    	e.preventDefault();
		        if(x < max_fields){ //max input box allowed
		            x++; //text box increment
		            $(wrapper).append('<div class="input-group alternative"><input class="form-control" name="alternatives[]" type="text" placeholder="Descrição da alternativa..." /><span class="input-group-btn remove_field"><button class="btn btn-danger" type="button"><span class="glyphicon glyphicon-remove"></span></button></span></div>'); //add input box
		         }
		      });
		    
		    $(wrapper).on("click",".remove_field", function(e){ //user click on remove text
		    	e.preventDefault(); $(this).parent('div').remove(); x--;
		    })
	},

	sortable_inputs: function () {
		
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
	}
};

