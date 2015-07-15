module.exports = {
	input_foreah: function(alternative, i) {
		var btn_disabled;
		var remove_field_class;
		if (i < 2) {
			btn_disabled = 'disabled="disabled"';
			remove_field_class = '';	
		} else {
			btn_disabled = '';
			remove_field_class = 'remove_field';
		}   
		return '<div class="input-group alternative glyphicon glyphicon-move order_alternative"><input style="max-width:93%;float:right" class="form-control" name="alternatives[]" type="text" value="'+alternative+'" placeholder="Descrição da alternativa..." /><span class="input-group-btn '+remove_field_class+'"><button class="btn btn-danger" '+btn_disabled+' type="button"><span class="glyphicon glyphicon-remove"></span></button></span></div>';
	},

	check_sent: function (poll) {
		Log.debug(poll.status);
		switch(poll.status) {
			case 'open':
			return 'panel-success';
			break;
			case 'closed':
			return 'panel-default';
			break;
			case 'pending':
			return 'panel-warning';
			break;
			case 'ready':
			return 'panel-info';
			break;
			default:
			return 'panel-error';
		}
	},

	link_action_poll: function (link_to, icon, title, data_confirm) {
		if(data_confirm){
			return '<a href="'+link_to+'" class="btn btn-default" title="'+title+'" data-confirm="'+data_confirm+'" rule="button" ><span class="glyphicon glyphicon-'+icon+'" aria-hidden="true"></span></a>';
		}
		return '<a href="'+link_to+'" class="btn btn-default" title="'+title+'" rule="button"><span class="glyphicon glyphicon-'+icon+'" aria-hidden="true"></span></a>';
	},

	modal_poll_preview: function(poll_id) {
		return '<a type="button" class="btn btn-default" rule="button" data-toggle="modal" title="Preview" data-target="#modal-'+ poll_id +'"><span class="glyphicon glyphicon-eye-open" aria-hidden="true"></span></a>';
	},

	form_poll_preview:function(poll) {
		
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
			html_alter += '<div class="input-group alternative glyphicon glyphicon-move order_alternative"><input style="max-width:93%;float:right" class="form-control" name="alternatives[]" type="text" placeholder="Descrição da alternativa..." /><span class="input-group-btn '+remove_field_class+'"><button class="btn btn-danger" '+btn_disabled+' type="button"><span class="glyphicon glyphicon-remove"></span></button></span></div>';
			amount_alters++;
		}
		return html_alter;
	}
};