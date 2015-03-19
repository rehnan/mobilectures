var application = sails.config.globals;

var PollsController = {

	show: function(req, res) {
		application.title = req.__('option_polls');
		res.view('speaker/polls/show', {layout: 'layout_options'});
	},

};

module.exports = PollsController;