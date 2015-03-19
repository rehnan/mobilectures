var application = sails.config.globals;

var DoubtsController = {

	show: function(req, res) {
		application.title = req.__('option_doubts');
		res.view('speaker/doubts/show', {layout: 'layout_options'});
	},

};

module.exports = DoubtsController;