module.exports = {
	input_foreah: function(alternative, i, correct_alternative) {
		var btn_disabled;
		var remove_field_class;
		var checked;

		(correct_alternative === i) ? checked = 'checked' : '';
		
		if (i < 2) {
			btn_disabled = 'disabled="disabled"';
			remove_field_class = '';	
		} else {
			btn_disabled = '';
			remove_field_class = 'remove_field';
		}   
		return '<div class="input-group alternative glyphicon glyphicon-move order_alternative"><span class="input-group-addon"><input type="radio" name="correct_alternative" value="'+i+'" '+checked+'></span><input style="max-width:100%;float:right" class="form-control" name="alternatives[]" type="text" value="'+alternative+'" placeholder="Descrição da alternativa..." /><span class="input-group-btn '+remove_field_class+'"><button class="btn btn-danger" '+btn_disabled+' type="button"><span class="glyphicon glyphicon-remove"></span></button></span></div>';
	},

	check_status: function (quiz) {
		switch(quiz.status) {
			case 'open':
			return 'panel-success';
			break;
			case 'closed':
			return 'panel-default';
			break;
			case 'pending':
			return 'panel-warning';
			break;
			break;
			default:
			return 'panel-error';
		}
	},

	link_action_quiz: function (link_to, icon, title, data_confirm, add_class) {
		if(data_confirm){
			return '<a href="'+link_to+'" class="btn btn-default '+add_class+'" title="'+title+'" data-confirm="'+data_confirm+'" rule="button" ><span class="glyphicon glyphicon-'+icon+'" aria-hidden="true"></span></a>';
		}
		return '<a href="'+link_to+'" class="btn btn-default" title="'+title+'" rule="button"><span class="glyphicon glyphicon-'+icon+'" aria-hidden="true"></span></a>';
	},

	modal_quiz_preview: function(quiz_id) {
		return '<a type="button" class="btn btn-default" rule="button" data-toggle="modal" title="Preview" data-target="#modal-'+ quiz_id +'"><span class="glyphicon glyphicon-eye-open" aria-hidden="true"></span></a>';
	},

	modal_ranking: function(quiz) {
      return "<a type='button' title='Ranking' id='"+quiz.id+"' data-quiz='"+ JSON.stringify(quiz) +"' class='btn btn-default show_ranking' rule='button' data-toggle='modal' title='Preview' data-target='#modal-"+ quiz.id +"'><span class='glyphicon glyphicon-star' aria-hidden='true'></span></a>";
   },

	check_radio_true: function (option) {
		var check = null;
		(option) ? check ='checked=checked' : check = '';
		return check;
	},

	check_radio_false: function (option) {
		var check = null;
		(!option) ? check = 'checked=checked' : check ='';
		return check;
	},

	input_for_missing: function (alternative) {
		var amount_min = 2;
		var amount_alters = 0;
		var html_alter = '';
		var btn_disabled;
		var remove_field_class;

		(typeof alternative !== 'undefined') ? amount_alters = alternative.length : '';
		while(amount_alters < amount_min) {
			if (amount_alters < 2) {
				btn_disabled = 'disabled="disabled"';
				remove_field_class = '';	
			} else {
				btn_disabled = '';
				remove_field_class = 'remove_field';
			}   
			html_alter += '<div class="input-group alternative glyphicon glyphicon-move order_alternative"><span class="input-group-addon"><input type="radio" name="correct_alternative" value="'+amount_alters+'"></span><input style="max-width:100%;float:right" class="form-control" name="alternatives[]" type="text" placeholder="Descrição da alternativa..." /><span class="input-group-btn '+remove_field_class+'"><button class="btn btn-danger" '+btn_disabled+' type="button"><span class="glyphicon glyphicon-remove"></span></button></span></div>';
			amount_alters++;
		}
		return html_alter;
	},


	plurarize: function (number, singular_context) {
		
		if(number !== 1) {
			return number+' '+singular_context+'s';
		}

		if(number === 1) {
			return number+' '+singular_context;
		}
	},

	abstention_votes: function (participants, votes) {
		return participants - votes;
	},

	select_points: function (question, number) {
		var selectd = (question && question.points.toString() === number.toString()) ? 'selected' : ''
		return selectd;
	},

	popoverInfo: function (question) {
		var content = '<p>1. Você deve informar no mínimo duas alternativas pra esta questão.</p><p> 2. Você deve informar qual delas é a correta. </p>';
		var popover = '<button type="button" class="btn btn-warning popoverInfo" data-html="true"  data-content="'+content+'" rel="popover" data-placement="top"  data-original-title="Pendências"><span class="glyphicon glyphicon-exclamation-sign" aria-hidden="true"></span></button>';
		return (question.status === 'invalid') ? popover : '';
	}
};