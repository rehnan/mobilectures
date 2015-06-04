module.exports = {
	show: function(alternative) {
		return '<div class="input-group alternative"><input class="form-control" name="alternatives[]" type="text" value="'+alternative+'" placeholder="Descrição da alternativa..." /><span class="input-group-btn remove_field"><button class="btn btn-danger" type="button"><span class="glyphicon glyphicon-remove"></span></button></span></div>';
    },

    least_one: function (length) {
    	var html_alter = '<div class="input-group alternative"><input class="form-control" name="alternatives[]" type="text" placeholder="Descrição da alternativa..." /><span class="input-group-btn remove_field"><button class="btn btn-danger" type="button"><span class="glyphicon glyphicon-remove"></span></button></span></div>'
    	return (length === 0) ? html_alter : '';
    }
};